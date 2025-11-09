"""
Redis Service for Session Persistence

Provides Redis-based storage for:
- Session state (parameters)
- Session history (parameter changes over time)
- User presence
- Message queue (for replay)
"""

import redis
import json
import os
from typing import Optional, Dict, List, Any
from datetime import datetime, timedelta

from utils.logger import logger
from models.messages import SessionState


class RedisService:
    """
    Redis-based session persistence.
    
    Key patterns:
    - session:{session_id}:state -> Current session state (JSON)
    - session:{session_id}:users -> Set of user IDs
    - session:{session_id}:history -> List of parameter changes (sorted by timestamp)
    - session:{session_id}:seq -> Current sequence number
    - user:{user_id}:sessions -> Set of session IDs user is in
    """
    
    def __init__(self):
        redis_url = os.getenv('REDIS_URL', 'redis://localhost:6379/0')
        
        try:
            self.client = redis.from_url(redis_url, decode_responses=True)
            self.client.ping()
            logger.info(f"✅ Redis connected: {redis_url}")
            self.enabled = True
        except Exception as e:
            logger.warning(f"⚠️  Redis not available: {e}. Running without persistence.")
            self.enabled = False
            self.client = None
    
    def is_enabled(self) -> bool:
        """Check if Redis is available."""
        return self.enabled and self.client is not None
    
    # ===== SESSION STATE =====
    
    def save_session_state(self, session_id: str, state: SessionState, seq: int):
        """
        Save current session state to Redis.
        
        Args:
            session_id: Session identifier
            state: Current parameter state
            seq: Current sequence number
        """
        if not self.is_enabled():
            return
        
        try:
            key = f"session:{session_id}:state"
            data = {
                **state.dict(),
                'seq': seq,
                'updated_at': datetime.utcnow().isoformat()
            }
            
            self.client.set(key, json.dumps(data))
            self.client.expire(key, timedelta(hours=24))  # 24-hour TTL
            
            # Also save sequence number separately for quick access
            self.client.set(f"session:{session_id}:seq", seq)
            self.client.expire(f"session:{session_id}:seq", timedelta(hours=24))
            
        except Exception as e:
            logger.error(f"❌ Error saving session state: {e}")
    
    def load_session_state(self, session_id: str) -> Optional[Dict[str, Any]]:
        """
        Load session state from Redis.
        
        Args:
            session_id: Session identifier
        
        Returns:
            Session state dict or None if not found
        """
        if not self.is_enabled():
            return None
        
        try:
            key = f"session:{session_id}:state"
            data = self.client.get(key)
            
            if data:
                return json.loads(data)
            
            return None
        
        except Exception as e:
            logger.error(f"❌ Error loading session state: {e}")
            return None
    
    def delete_session_state(self, session_id: str):
        """Delete session state from Redis."""
        if not self.is_enabled():
            return
        
        try:
            self.client.delete(f"session:{session_id}:state")
            self.client.delete(f"session:{session_id}:seq")
            self.client.delete(f"session:{session_id}:users")
            self.client.delete(f"session:{session_id}:history")
            
        except Exception as e:
            logger.error(f"❌ Error deleting session state: {e}")
    
    # ===== SESSION HISTORY =====
    
    def add_to_history(
        self,
        session_id: str,
        user_id: str,
        params: Dict[str, float],
        seq: int
    ):
        """
        Add parameter change to session history.
        
        Args:
            session_id: Session identifier
            user_id: User who made the change
            params: Changed parameters
            seq: Sequence number
        """
        if not self.is_enabled():
            return
        
        try:
            key = f"session:{session_id}:history"
            
            event = {
                'seq': seq,
                'user_id': user_id,
                'params': params,
                'timestamp': datetime.utcnow().isoformat()
            }
            
            # Add to sorted set (score = seq for ordering)
            self.client.zadd(key, {json.dumps(event): seq})
            
            # Set TTL
            self.client.expire(key, timedelta(hours=24))
            
            # Limit history to last 1000 events
            self.client.zremrangebyrank(key, 0, -1001)
            
        except Exception as e:
            logger.error(f"❌ Error adding to history: {e}")
    
    def get_history(
        self,
        session_id: str,
        start_seq: int = 0,
        end_seq: int = -1
    ) -> List[Dict[str, Any]]:
        """
        Get session history (parameter changes).
        
        Args:
            session_id: Session identifier
            start_seq: Starting sequence number (inclusive)
            end_seq: Ending sequence number (inclusive, -1 for all)
        
        Returns:
            List of history events
        """
        if not self.is_enabled():
            return []
        
        try:
            key = f"session:{session_id}:history"
            
            # Get events in sequence number range
            if end_seq == -1:
                events = self.client.zrangebyscore(key, start_seq, '+inf')
            else:
                events = self.client.zrangebyscore(key, start_seq, end_seq)
            
            return [json.loads(event) for event in events]
        
        except Exception as e:
            logger.error(f"❌ Error getting history: {e}")
            return []
    
    def get_full_history(self, session_id: str) -> List[Dict[str, Any]]:
        """Get complete session history."""
        return self.get_history(session_id, 0, -1)
    
    # ===== USER PRESENCE =====
    
    def add_user_to_session(self, session_id: str, user_id: str, user_data: Dict[str, Any]):
        """
        Add user to session.
        
        Args:
            session_id: Session identifier
            user_id: User identifier
            user_data: User information (name, color, etc.)
        """
        if not self.is_enabled():
            return
        
        try:
            # Add to session's user set
            session_key = f"session:{session_id}:users"
            self.client.hset(session_key, user_id, json.dumps(user_data))
            self.client.expire(session_key, timedelta(hours=24))
            
            # Add to user's session set
            user_key = f"user:{user_id}:sessions"
            self.client.sadd(user_key, session_id)
            self.client.expire(user_key, timedelta(hours=24))
            
        except Exception as e:
            logger.error(f"❌ Error adding user to session: {e}")
    
    def remove_user_from_session(self, session_id: str, user_id: str):
        """Remove user from session."""
        if not self.is_enabled():
            return
        
        try:
            session_key = f"session:{session_id}:users"
            self.client.hdel(session_key, user_id)
            
            user_key = f"user:{user_id}:sessions"
            self.client.srem(user_key, session_id)
            
        except Exception as e:
            logger.error(f"❌ Error removing user from session: {e}")
    
    def get_session_users(self, session_id: str) -> List[Dict[str, Any]]:
        """Get all users in a session."""
        if not self.is_enabled():
            return []
        
        try:
            key = f"session:{session_id}:users"
            users_data = self.client.hgetall(key)
            
            return [json.loads(data) for data in users_data.values()]
        
        except Exception as e:
            logger.error(f"❌ Error getting session users: {e}")
            return []
    
    # ===== SESSION MANAGEMENT =====
    
    def get_active_sessions(self) -> List[str]:
        """Get list of all active session IDs."""
        if not self.is_enabled():
            return []
        
        try:
            # Scan for all session:*:state keys
            keys = self.client.keys("session:*:state")
            
            # Extract session IDs
            return [key.split(':')[1] for key in keys]
        
        except Exception as e:
            logger.error(f"❌ Error getting active sessions: {e}")
            return []
    
    def get_session_metadata(self, session_id: str) -> Optional[Dict[str, Any]]:
        """Get session metadata (state + users + history count)."""
        if not self.is_enabled():
            return None
        
        try:
            state = self.load_session_state(session_id)
            users = self.get_session_users(session_id)
            history_count = self.client.zcard(f"session:{session_id}:history")
            
            if not state:
                return None
            
            return {
                'session_id': session_id,
                'state': state,
                'users': users,
                'user_count': len(users),
                'history_count': history_count,
                'seq': state.get('seq', 0)
            }
        
        except Exception as e:
            logger.error(f"❌ Error getting session metadata: {e}")
            return None


# Global Redis service instance
redis_service = RedisService()
