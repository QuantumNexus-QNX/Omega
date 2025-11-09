"""
Session History API

Provides endpoints for accessing session history and replay.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

from services.redis_service import redis_service
from utils.logger import logger

router = APIRouter()


class HistoryEvent(BaseModel):
    """Single history event"""
    seq: int
    user_id: str
    params: Dict[str, float]
    timestamp: str


class HistoryResponse(BaseModel):
    """History response"""
    session_id: str
    events: List[HistoryEvent]
    total_count: int


class SessionMetadataResponse(BaseModel):
    """Session metadata response"""
    session_id: str
    state: Dict[str, Any]
    users: List[Dict[str, Any]]
    user_count: int
    history_count: int
    seq: int


@router.get("/history/{session_id}", response_model=HistoryResponse)
async def get_session_history(
    session_id: str,
    start_seq: int = 0,
    end_seq: int = -1
):
    """
    Get session history (parameter changes over time).
    
    Args:
        session_id: Session identifier
        start_seq: Starting sequence number (default: 0)
        end_seq: Ending sequence number (default: -1 for all)
    
    Returns:
        List of parameter change events
    """
    if not redis_service.is_enabled():
        raise HTTPException(
            status_code=503,
            detail="History not available (Redis not configured)"
        )
    
    events = redis_service.get_history(session_id, start_seq, end_seq)
    
    return HistoryResponse(
        session_id=session_id,
        events=[HistoryEvent(**event) for event in events],
        total_count=len(events)
    )


@router.get("/history/{session_id}/full", response_model=HistoryResponse)
async def get_full_history(session_id: str):
    """
    Get complete session history.
    
    Useful for session replay or analysis.
    """
    if not redis_service.is_enabled():
        raise HTTPException(
            status_code=503,
            detail="History not available (Redis not configured)"
        )
    
    events = redis_service.get_full_history(session_id)
    
    return HistoryResponse(
        session_id=session_id,
        events=[HistoryEvent(**event) for event in events],
        total_count=len(events)
    )


@router.get("/history/{session_id}/metadata", response_model=SessionMetadataResponse)
async def get_session_metadata(session_id: str):
    """
    Get session metadata (state + users + history count).
    
    Useful for session overview without loading full history.
    """
    if not redis_service.is_enabled():
        raise HTTPException(
            status_code=503,
            detail="History not available (Redis not configured)"
        )
    
    metadata = redis_service.get_session_metadata(session_id)
    
    if not metadata:
        raise HTTPException(status_code=404, detail="Session not found")
    
    return SessionMetadataResponse(**metadata)


@router.get("/history/active", response_model=List[str])
async def get_active_sessions():
    """
    Get list of all active session IDs.
    
    Useful for admin dashboard or session browser.
    """
    if not redis_service.is_enabled():
        raise HTTPException(
            status_code=503,
            detail="History not available (Redis not configured)"
        )
    
    sessions = redis_service.get_active_sessions()
    
    return sessions


@router.delete("/history/{session_id}")
async def delete_session_history(session_id: str):
    """
    Delete session history and state.
    
    Useful for cleanup or GDPR compliance.
    """
    if not redis_service.is_enabled():
        raise HTTPException(
            status_code=503,
            detail="History not available (Redis not configured)"
        )
    
    redis_service.delete_session_state(session_id)
    
    logger.info(f"🗑️  Deleted history for session {session_id}")
    
    return {"status": "deleted", "session_id": session_id}
