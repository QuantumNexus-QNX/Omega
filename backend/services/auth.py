"""
JWT Authentication Service

Handles user authentication, token generation, and validation.
Supports both anonymous and authenticated users.
"""

from datetime import datetime, timedelta
from typing import Optional, Dict, Any
import jwt
import os
from pydantic import BaseModel

from utils.logger import logger


class TokenData(BaseModel):
    """JWT token payload"""
    user_id: str
    username: str
    email: Optional[str] = None
    is_anonymous: bool = False
    exp: datetime


class AuthService:
    """
    JWT-based authentication service.
    
    Features:
    - Generate JWT tokens
    - Validate and decode tokens
    - Support anonymous users
    - Token expiration
    """
    
    def __init__(self):
        self.secret_key = os.getenv('JWT_SECRET', 'dev-secret-key-change-in-production')
        self.algorithm = os.getenv('JWT_ALGORITHM', 'HS256')
        self.expiration_hours = int(os.getenv('JWT_EXPIRATION', '24'))  # 24 hours default
        
        if self.secret_key == 'dev-secret-key-change-in-production':
            logger.warning("⚠️  Using default JWT secret! Set JWT_SECRET in production!")
    
    def create_token(
        self,
        user_id: str,
        username: str,
        email: Optional[str] = None,
        is_anonymous: bool = False
    ) -> str:
        """
        Generate JWT token for user.
        
        Args:
            user_id: Unique user identifier
            username: Display name
            email: User email (optional)
            is_anonymous: Whether user is anonymous
        
        Returns:
            JWT token string
        """
        expiration = datetime.utcnow() + timedelta(hours=self.expiration_hours)
        
        payload = {
            'user_id': user_id,
            'username': username,
            'email': email,
            'is_anonymous': is_anonymous,
            'exp': expiration,
            'iat': datetime.utcnow()
        }
        
        token = jwt.encode(payload, self.secret_key, algorithm=self.algorithm)
        
        logger.info(f"🔑 Created token for user {username} (anonymous={is_anonymous})")
        
        return token
    
    def create_anonymous_token(self, user_id: str, username: Optional[str] = None) -> str:
        """
        Generate token for anonymous user.
        
        Args:
            user_id: Generated user ID
            username: Optional display name
        
        Returns:
            JWT token string
        """
        if not username:
            username = f"User {user_id[-6:]}"
        
        return self.create_token(
            user_id=user_id,
            username=username,
            is_anonymous=True
        )
    
    def verify_token(self, token: str) -> Optional[TokenData]:
        """
        Verify and decode JWT token.
        
        Args:
            token: JWT token string
        
        Returns:
            TokenData if valid, None if invalid
        """
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            
            return TokenData(
                user_id=payload['user_id'],
                username=payload['username'],
                email=payload.get('email'),
                is_anonymous=payload.get('is_anonymous', False),
                exp=datetime.fromtimestamp(payload['exp'])
            )
        
        except jwt.ExpiredSignatureError:
            logger.warning("⚠️  Token expired")
            return None
        
        except jwt.InvalidTokenError as e:
            logger.warning(f"⚠️  Invalid token: {e}")
            return None
    
    def refresh_token(self, token: str) -> Optional[str]:
        """
        Refresh an existing token (extend expiration).
        
        Args:
            token: Current JWT token
        
        Returns:
            New JWT token if valid, None if invalid
        """
        token_data = self.verify_token(token)
        
        if not token_data:
            return None
        
        # Create new token with same data but new expiration
        return self.create_token(
            user_id=token_data.user_id,
            username=token_data.username,
            email=token_data.email,
            is_anonymous=token_data.is_anonymous
        )
    
    def decode_token_unsafe(self, token: str) -> Optional[Dict[str, Any]]:
        """
        Decode token without verification (for debugging).
        
        ⚠️  DO NOT use for authentication!
        
        Args:
            token: JWT token string
        
        Returns:
            Decoded payload or None
        """
        try:
            return jwt.decode(token, options={"verify_signature": False})
        except Exception as e:
            logger.error(f"❌ Error decoding token: {e}")
            return None


# Global auth service instance
auth_service = AuthService()


# Helper functions for convenience
def create_token(user_id: str, username: str, email: Optional[str] = None) -> str:
    """Create JWT token for authenticated user."""
    return auth_service.create_token(user_id, username, email, is_anonymous=False)


def create_anonymous_token(user_id: str, username: Optional[str] = None) -> str:
    """Create JWT token for anonymous user."""
    return auth_service.create_anonymous_token(user_id, username)


def verify_token(token: str) -> Optional[TokenData]:
    """Verify JWT token."""
    return auth_service.verify_token(token)


def refresh_token(token: str) -> Optional[str]:
    """Refresh JWT token."""
    return auth_service.refresh_token(token)
