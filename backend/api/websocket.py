"""
WebSocket Connection Manager with Sequence Number Ordering

Implements the protocol from the implementation package with:
- Monotonic sequence counters per session
- Automatic sequence attachment to all broadcasts
- Dead connection cleanup
- Session lifecycle management
- Conflict detection

Reference: MANUS AI Implementation Package - Artifact 1
Author: Trivector.ai Team
"""

from fastapi import WebSocket, WebSocketDisconnect
from typing import Dict, Set, Optional
import asyncio
import json
from datetime import datetime

from models.messages import SessionState, User
from utils.logger import logger
from services.auth import verify_token
from services.redis_service import redis_service


class ConnectionManager:
    """
    Manages WebSocket connections with per-session sequence numbering.
    
    Key features:
    - Monotonic sequence counters per session
    - Automatic sequence attachment to all broadcasts
    - Dead connection cleanup
    - Session lifecycle management
    - Conflict detection for simultaneous updates
    """
    
    def __init__(self):
        # sessionId -> Set[WebSocket]
        self.active_connections: Dict[str, Set[WebSocket]] = {}
        
        # sessionId -> current sequence number (monotonic)
        self.session_seq: Dict[str, int] = {}
        
        # sessionId -> SessionState (current parameter state)
        self.session_state: Dict[str, SessionState] = {}
        
        # sessionId -> Dict[userId, User]
        self.session_users: Dict[str, Dict[str, User]] = {}
        
        # WebSocket -> userId mapping
        self.ws_to_user: Dict[WebSocket, str] = {}
        
        # Track last update time per parameter per session (for conflict detection)
        self.last_update_time: Dict[str, Dict[str, datetime]] = {}
    
    async def connect(self, websocket: WebSocket, session_id: str):
        """
        Accept new WebSocket connection and initialize session if needed.
        
        Performance: O(1) for session lookup, O(1) for set insertion
        """
        await websocket.accept()
        
        if session_id not in self.active_connections:
            self.active_connections[session_id] = set()
            
            # Try to restore from Redis
            restored_state = redis_service.load_session_state(session_id)
            if restored_state:
                logger.info(f"🔄 Restored session {session_id} from Redis")
                self.session_seq[session_id] = restored_state.get('seq', 0)
                self.session_state[session_id] = SessionState(**{k: v for k, v in restored_state.items() if k != 'seq' and k != 'updated_at'})
                self.session_users[session_id] = {}
                self.last_update_time[session_id] = {}
            else:
                # New session
                self.session_seq[session_id] = 0
                self.session_state[session_id] = SessionState()
                self.session_users[session_id] = {}
                self.last_update_time[session_id] = {}
                logger.info(f"📝 Created new session: {session_id}")
        
        self.active_connections[session_id].add(websocket)
        logger.info(f"🔌 Client connected to session {session_id}. Total: {len(self.active_connections[session_id])}")
    
    def disconnect(self, websocket: WebSocket, session_id: str):
        """
        Remove WebSocket and cleanup empty sessions.
        
        Performance: O(1) for set removal, O(1) for dict cleanup
        """
        if session_id in self.active_connections:
            self.active_connections[session_id].discard(websocket)
            
            # Remove user mapping
            if websocket in self.ws_to_user:
                user_id = self.ws_to_user[websocket]
                del self.ws_to_user[websocket]
                
                # Remove from session users
                if session_id in self.session_users and user_id in self.session_users[session_id]:
                    del self.session_users[session_id][user_id]
            
            # Cleanup empty sessions
            if not self.active_connections[session_id]:
                del self.active_connections[session_id]
                del self.session_seq[session_id]
                del self.session_state[session_id]
                del self.session_users[session_id]
                del self.last_update_time[session_id]
                logger.info(f"🗑️  Session {session_id} cleaned up (no clients)")
    
    async def broadcast(
        self, 
        session_id: str, 
        message: dict, 
        exclude: Optional[WebSocket] = None
    ):
        """
        Broadcast message to all clients in session with automatic sequencing.
        
        CRITICAL: This method automatically increments and attaches sequence
        numbers to ensure total ordering of all broadcasts.
        
        Args:
            session_id: Target session
            message: Message dict (will be mutated to add 'seq')
            exclude: Optional WebSocket to exclude (e.g., sender)
        
        Performance: O(n) where n = clients in session
        """
        if session_id not in self.active_connections:
            return
        
        # Increment sequence number (monotonic)
        self.session_seq[session_id] += 1
        message['seq'] = self.session_seq[session_id]
        message['timestamp'] = datetime.utcnow().isoformat()
        
        # Update session state if this is a parameter update
        if message.get('type') == 'param:broadcast':
            params = message['payload']['params']
            for key, value in params.items():
                if hasattr(self.session_state[session_id], key):
                    setattr(self.session_state[session_id], key, value)
                    self.last_update_time[session_id][key] = datetime.utcnow()
            
            # Recompute beta
            self.session_state[session_id].compute_beta()
            
            # Save to Redis
            redis_service.save_session_state(
                session_id,
                self.session_state[session_id],
                self.session_seq[session_id]
            )
            
            # Add to history
            redis_service.add_to_history(
                session_id,
                message['payload'].get('userId', 'unknown'),
                params,
                self.session_seq[session_id]
            )
        
        dead_sockets = set()
        
        for ws in self.active_connections[session_id]:
            if ws == exclude:
                continue
            
            try:
                await ws.send_json(message)
            except Exception as e:
                logger.error(f"❌ Error broadcasting to client: {e}")
                dead_sockets.add(ws)
        
        # Clean up dead connections
        for ws in dead_sockets:
            self.disconnect(ws, session_id)
    
    def get_session_state(self, session_id: str) -> dict:
        """Get current parameter state for session (used for resync)."""
        if session_id not in self.session_state:
            return {
                'params': SessionState().dict(),
                'seq': 0
            }
        
        return {
            'params': self.session_state[session_id].dict(),
            'seq': self.session_seq.get(session_id, 0)
        }
    
    def get_session_users(self, session_id: str) -> list:
        """Get list of users in session."""
        if session_id not in self.session_users:
            return []
        
        return [user.dict() for user in self.session_users[session_id].values()]
    
    def add_user(self, websocket: WebSocket, session_id: str, user: User):
        """Add user to session."""
        if session_id not in self.session_users:
            self.session_users[session_id] = {}
        
        self.session_users[session_id][user.id] = user
        self.ws_to_user[websocket] = user.id
        
        # Save to Redis
        redis_service.add_user_to_session(
            session_id,
            user.id,
            user.dict()
        )
        
        logger.info(f"👤 User {user.name} ({user.id}) joined session {session_id}")
    
    def detect_conflict(
        self, 
        session_id: str, 
        param: str, 
        new_value: float,
        user_id: str
    ) -> Optional[dict]:
        """
        Detect if a parameter update conflicts with a recent update.
        
        Returns conflict info if detected, None otherwise.
        """
        if session_id not in self.last_update_time:
            return None
        
        if param not in self.last_update_time[session_id]:
            return None
        
        # Check if update was within last 500ms (conflict window)
        last_update = self.last_update_time[session_id][param]
        time_since_update = (datetime.utcnow() - last_update).total_seconds()
        
        if time_since_update < 0.5:  # 500ms conflict window
            current_value = getattr(self.session_state[session_id], param, None)
            
            if current_value is not None and abs(current_value - new_value) > 0.001:
                # Find who made the conflicting update
                conflicting_user = None
                for uid, user in self.session_users[session_id].items():
                    if uid != user_id:
                        conflicting_user = user
                        break
                
                return {
                    'param': param,
                    'yourValue': new_value,
                    'theirValue': current_value,
                    'theirUserId': conflicting_user.id if conflicting_user else 'unknown',
                    'theirUserName': conflicting_user.name if conflicting_user else 'Another user'
                }
        
        return None
    
    async def shutdown(self):
        """Gracefully shutdown all connections."""
        logger.info("🛑 Shutting down WebSocket manager...")
        
        for session_id in list(self.active_connections.keys()):
            for ws in list(self.active_connections[session_id]):
                try:
                    await ws.close()
                except:
                    pass
        
        self.active_connections.clear()
        self.session_seq.clear()
        self.session_state.clear()
        self.session_users.clear()
        self.ws_to_user.clear()
        self.last_update_time.clear()


# Global manager instance
manager = ConnectionManager()


async def websocket_endpoint(websocket: WebSocket, session_id: str):
    """
    Main WebSocket endpoint with full state machine implementation.
    
    State flow:
    1. CONNECTING -> Accept connection
    2. AUTHENTICATING -> Verify JWT (or anonymous)
    3. CONNECTED -> Handle messages
    4. RECONNECTING -> Handle resync
    5. DISCONNECT -> Cleanup
    
    Reference: Section 5.4 protocol specification
    """
    await manager.connect(websocket, session_id)
    user_id = None
    
    try:
        while True:
            data = await websocket.receive_json()
            msg_type = data.get('type')
            
            # ===== AUTH PHASE =====
            if msg_type == 'auth':
                token = data['payload'].get('token')
                
                # Verify JWT token
                token_data = verify_token(token) if token else None
                
                if token_data:
                    # Authenticated user (from JWT)
                    user_id = token_data.user_id
                    user_name = token_data.username
                    user = User(
                        id=user_id,
                        name=user_name,
                        color=data['payload'].get('color', '#8b5cf6' if token_data.is_anonymous else '#06b6d4')
                    )
                else:
                    # Invalid/missing token - reject
                    await websocket.send_json({
                        'type': 'auth:failed',
                        'payload': {'error': 'Invalid or missing authentication token'}
                    })
                    continue
                
                manager.add_user(websocket, session_id, user)
                
                # Send success with current session state (CRITICAL for sync)
                current_state = manager.get_session_state(session_id)
                await websocket.send_json({
                    'type': 'auth:success',
                    'payload': {
                        'sessionId': session_id,
                        'userId': user_id,
                        'users': manager.get_session_users(session_id),
                        'currentState': current_state
                    }
                })
                
                # Notify others of new user
                await manager.broadcast(
                    session_id,
                    {
                        'type': 'session:joined',
                        'payload': {'user': user.dict()}
                    },
                    exclude=websocket
                )
            
            # ===== PARAMETER UPDATE (HOT PATH) =====
            elif msg_type == 'param:update':
                if not user_id:
                    continue  # Not authenticated
                
                params = data['payload']
                
                # Check for conflicts
                conflicts = []
                for param, value in params.items():
                    conflict = manager.detect_conflict(session_id, param, value, user_id)
                    if conflict:
                        conflicts.append(conflict)
                
                # If conflicts detected, notify sender
                if conflicts:
                    for conflict in conflicts:
                        await websocket.send_json({
                            'type': 'conflict:detected',
                            'payload': conflict
                        })
                else:
                    # No conflicts, broadcast to all other clients
                    # (sequence number added automatically by manager.broadcast)
                    await manager.broadcast(
                        session_id,
                        {
                            'type': 'param:broadcast',
                            'payload': {
                                'userId': user_id,
                                'params': params
                            }
                        },
                        exclude=websocket
                    )
            
            # ===== CONFLICT RESOLUTION =====
            elif msg_type == 'conflict:resolved':
                if not user_id:
                    continue
                
                # User resolved conflict, broadcast their decision
                await manager.broadcast(
                    session_id,
                    {
                        'type': 'param:broadcast',
                        'payload': {
                            'userId': user_id,
                            'params': {data['payload']['param']: data['payload']['resolvedValue']}
                        }
                    },
                    exclude=websocket
                )
            
            # ===== RESYNC REQUEST (RECONNECTION) =====
            elif msg_type == 'session:resync':
                """
                Handle client reconnection with sequence-aware resync.
                
                Client sends their last seen sequence number.
                Server responds with full current state.
                """
                last_seen_seq = data['payload'].get('lastSeenSeq', 0)
                current_state = manager.get_session_state(session_id)
                
                # Send full state sync
                await websocket.send_json({
                    'type': 'session:state',
                    'payload': current_state
                })
                
                logger.info(f"🔄 Resync: client was at seq {last_seen_seq}, now at {current_state['seq']}")
            
            # ===== HEARTBEAT =====
            elif msg_type == 'ping':
                await websocket.send_json({'type': 'pong'})
    
    except WebSocketDisconnect:
        logger.info(f"🔌 Client disconnected from session {session_id}")
    
    except Exception as e:
        logger.error(f"❌ WebSocket error: {e}")
    
    finally:
        manager.disconnect(websocket, session_id)
        
        if user_id:
            await manager.broadcast(
                session_id,
                {
                    'type': 'session:left',
                    'payload': {'userId': user_id}
                }
            )
