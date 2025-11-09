"""
Pydantic models for WebSocket messages

Defines the message protocol for real-time collaboration.
"""

from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, Literal
from datetime import datetime


class BaseMessage(BaseModel):
    """Base message with sequence number and timestamp"""
    type: str
    seq: Optional[int] = None
    timestamp: Optional[str] = None


class AuthMessage(BaseModel):
    """Client authentication message"""
    type: Literal["auth"]
    payload: Dict[str, str]  # {"token": "jwt_token"}


class AuthSuccessMessage(BaseMessage):
    """Server authentication success response"""
    type: Literal["auth:success"]
    payload: Dict[str, Any]  # {"sessionId", "users", "currentState"}


class AuthFailedMessage(BaseMessage):
    """Server authentication failure response"""
    type: Literal["auth:failed"]
    payload: Dict[str, str]  # {"error": "reason"}


class ParamUpdateMessage(BaseModel):
    """Client parameter update"""
    type: Literal["param:update"]
    payload: Dict[str, float]  # {"mu": 0.6, "omega": 0.9, ...}


class ParamBroadcastMessage(BaseMessage):
    """Server parameter broadcast to other clients"""
    type: Literal["param:broadcast"]
    payload: Dict[str, Any]  # {"userId", "params"}


class SessionJoinedMessage(BaseMessage):
    """User joined session notification"""
    type: Literal["session:joined"]
    payload: Dict[str, Any]  # {"user": {"id", "name"}}


class SessionLeftMessage(BaseMessage):
    """User left session notification"""
    type: Literal["session:left"]
    payload: Dict[str, str]  # {"userId"}


class SessionResyncMessage(BaseModel):
    """Client requests state resync (after reconnection)"""
    type: Literal["session:resync"]
    payload: Dict[str, int]  # {"lastSeenSeq": 123}


class SessionStateMessage(BaseMessage):
    """Server sends full session state"""
    type: Literal["session:state"]
    payload: Dict[str, Any]  # {"params", "seq"}


class PingMessage(BaseModel):
    """Client heartbeat ping"""
    type: Literal["ping"]


class PongMessage(BaseMessage):
    """Server heartbeat pong"""
    type: Literal["pong"]


class ConflictDetectedMessage(BaseMessage):
    """Server detected parameter conflict"""
    type: Literal["conflict:detected"]
    payload: Dict[str, Any]  # {"param", "yourValue", "theirValue", "theirUserId"}


class ConflictResolvedMessage(BaseModel):
    """Client resolved conflict"""
    type: Literal["conflict:resolved"]
    payload: Dict[str, Any]  # {"param", "resolvedValue", "strategy"}


# Session state model
class SessionState(BaseModel):
    """Current session parameter state"""
    mu: float = Field(default=0.569, ge=0.5, le=0.7)
    omega: float = Field(default=0.847, ge=0.5, le=1.5)
    kappa: float = Field(default=0.0207, ge=0.01, le=0.05)
    beta: Optional[float] = None  # Computed: 1 - mu - kappa * c
    
    def compute_beta(self, c: float = 10.8) -> float:
        """Compute wabi-sabi constant"""
        self.beta = 1 - self.mu - self.kappa * c
        return self.beta


# User model
class User(BaseModel):
    """User information"""
    id: str
    name: str
    avatar: Optional[str] = None
    color: Optional[str] = None  # For UI highlighting


# Session metadata
class SessionMetadata(BaseModel):
    """Session metadata"""
    session_id: str
    created_at: datetime
    user_count: int
    current_seq: int
    state: SessionState
