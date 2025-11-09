"""
REST API endpoints for session management

Provides HTTP endpoints for:
- Creating sessions
- Listing active sessions
- Getting session metadata
- Generating session join links
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import uuid
from datetime import datetime

from api.websocket import manager
from models.messages import SessionMetadata
from utils.logger import logger

router = APIRouter()


class CreateSessionRequest(BaseModel):
    """Request to create a new session"""
    name: Optional[str] = None


class CreateSessionResponse(BaseModel):
    """Response with new session details"""
    session_id: str
    join_url: str
    created_at: str


class SessionInfo(BaseModel):
    """Session information"""
    session_id: str
    user_count: int
    current_seq: int
    state: dict


@router.post("/sessions", response_model=CreateSessionResponse)
async def create_session(request: CreateSessionRequest):
    """
    Create a new collaboration session.
    
    Returns a session ID and join URL.
    """
    session_id = str(uuid.uuid4())[:8]  # Short session ID
    
    logger.info(f"📝 Creating new session: {session_id}")
    
    return CreateSessionResponse(
        session_id=session_id,
        join_url=f"/trilogic?session={session_id}",
        created_at=datetime.utcnow().isoformat()
    )


@router.get("/sessions", response_model=List[SessionInfo])
async def list_sessions():
    """
    List all active sessions.
    
    Returns session metadata including user count and current state.
    """
    sessions = []
    
    for session_id in manager.active_connections.keys():
        state = manager.get_session_state(session_id)
        
        sessions.append(SessionInfo(
            session_id=session_id,
            user_count=len(manager.active_connections[session_id]),
            current_seq=state['seq'],
            state=state['params']
        ))
    
    return sessions


@router.get("/sessions/{session_id}", response_model=SessionInfo)
async def get_session(session_id: str):
    """
    Get metadata for a specific session.
    
    Returns 404 if session doesn't exist.
    """
    if session_id not in manager.active_connections:
        raise HTTPException(status_code=404, detail="Session not found")
    
    state = manager.get_session_state(session_id)
    
    return SessionInfo(
        session_id=session_id,
        user_count=len(manager.active_connections[session_id]),
        current_seq=state['seq'],
        state=state['params']
    )


@router.delete("/sessions/{session_id}")
async def delete_session(session_id: str):
    """
    Delete a session and disconnect all users.
    
    Useful for admin cleanup.
    """
    if session_id not in manager.active_connections:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Disconnect all websockets
    for ws in list(manager.active_connections[session_id]):
        try:
            await ws.close()
        except:
            pass
        manager.disconnect(ws, session_id)
    
    logger.info(f"🗑️  Deleted session: {session_id}")
    
    return {"status": "deleted", "session_id": session_id}
