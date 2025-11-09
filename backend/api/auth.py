"""
Authentication API Endpoints

Provides REST endpoints for user authentication.
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from typing import Optional
import uuid

from services.auth import auth_service, TokenData
from utils.logger import logger

router = APIRouter()


class LoginRequest(BaseModel):
    """Login request (for future OAuth integration)"""
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    provider: Optional[str] = None  # 'google', 'github', etc.


class AnonymousLoginRequest(BaseModel):
    """Anonymous login request"""
    username: Optional[str] = None
    color: Optional[str] = None


class LoginResponse(BaseModel):
    """Login response"""
    token: str
    user_id: str
    username: str
    email: Optional[str] = None
    is_anonymous: bool
    expires_at: str


class RefreshRequest(BaseModel):
    """Token refresh request"""
    token: str


class RefreshResponse(BaseModel):
    """Token refresh response"""
    token: str
    expires_at: str


@router.post("/auth/anonymous", response_model=LoginResponse)
async def login_anonymous(request: AnonymousLoginRequest):
    """
    Create anonymous user session.
    
    No credentials required - generates a temporary user ID and JWT token.
    Perfect for quick collaboration without signup.
    """
    # Generate unique user ID
    user_id = f"anon_{uuid.uuid4().hex[:12]}"
    username = request.username or f"User {user_id[-6:]}"
    
    # Create JWT token
    token = auth_service.create_anonymous_token(user_id, username)
    
    # Decode to get expiration
    token_data = auth_service.verify_token(token)
    
    if not token_data:
        raise HTTPException(status_code=500, detail="Failed to create token")
    
    logger.info(f"👤 Anonymous user created: {username} ({user_id})")
    
    return LoginResponse(
        token=token,
        user_id=user_id,
        username=username,
        is_anonymous=True,
        expires_at=token_data.exp.isoformat()
    )


@router.post("/auth/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    """
    Authenticate user (OAuth integration point).
    
    Currently returns mock authenticated user.
    TODO: Integrate with OAuth providers (Google, GitHub, etc.)
    """
    # Mock authentication for now
    # In production, this would verify credentials with OAuth provider
    
    if not request.email:
        raise HTTPException(status_code=400, detail="Email required")
    
    # Generate user ID (in production, this would come from database)
    user_id = f"user_{uuid.uuid4().hex[:12]}"
    username = request.email.split('@')[0]
    
    # Create JWT token
    token = auth_service.create_token(
        user_id=user_id,
        username=username,
        email=request.email,
        is_anonymous=False
    )
    
    # Decode to get expiration
    token_data = auth_service.verify_token(token)
    
    if not token_data:
        raise HTTPException(status_code=500, detail="Failed to create token")
    
    logger.info(f"🔑 User authenticated: {username} ({user_id})")
    
    return LoginResponse(
        token=token,
        user_id=user_id,
        username=username,
        email=request.email,
        is_anonymous=False,
        expires_at=token_data.exp.isoformat()
    )


@router.post("/auth/refresh", response_model=RefreshResponse)
async def refresh(request: RefreshRequest):
    """
    Refresh JWT token (extend expiration).
    
    Useful for keeping users logged in without re-authentication.
    """
    new_token = auth_service.refresh_token(request.token)
    
    if not new_token:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    # Decode to get new expiration
    token_data = auth_service.verify_token(new_token)
    
    if not token_data:
        raise HTTPException(status_code=500, detail="Failed to refresh token")
    
    logger.info(f"🔄 Token refreshed for user {token_data.username}")
    
    return RefreshResponse(
        token=new_token,
        expires_at=token_data.exp.isoformat()
    )


@router.post("/auth/verify")
async def verify(token: str):
    """
    Verify JWT token validity.
    
    Returns user data if valid, 401 if invalid.
    """
    token_data = auth_service.verify_token(token)
    
    if not token_data:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    return {
        "valid": True,
        "user_id": token_data.user_id,
        "username": token_data.username,
        "email": token_data.email,
        "is_anonymous": token_data.is_anonymous,
        "expires_at": token_data.exp.isoformat()
    }


@router.get("/auth/me")
async def get_current_user(token: str):
    """
    Get current user information from token.
    
    Usage: GET /auth/me?token=<jwt_token>
    """
    token_data = auth_service.verify_token(token)
    
    if not token_data:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    return {
        "user_id": token_data.user_id,
        "username": token_data.username,
        "email": token_data.email,
        "is_anonymous": token_data.is_anonymous,
        "expires_at": token_data.exp.isoformat()
    }
