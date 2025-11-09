"""
Trivector.ai WebSocket Collaboration Server

Real-time multi-user parameter synchronization with:
- Sequence-numbered message ordering
- Automatic conflict resolution
- Session management
- User presence tracking

Author: Trivector.ai Team
License: MIT
"""

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import uvicorn
import os
from dotenv import load_dotenv

from api.websocket import websocket_endpoint, manager
from api.sessions import router as sessions_router
from api.auth import router as auth_router
from api.history import router as history_router
from utils.logger import logger

# Load environment variables
load_dotenv()

# Environment configuration
ENV = os.getenv("ENV", "development")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
PORT = int(os.getenv("PORT", "8000"))


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    logger.info(f"🚀 Starting Trivector.ai WebSocket server (ENV={ENV})")
    logger.info(f"📡 Frontend URL: {FRONTEND_URL}")
    
    # Startup tasks
    yield
    
    # Shutdown tasks
    logger.info("🛑 Shutting down WebSocket server")
    await manager.shutdown()


# Create FastAPI app
app = FastAPI(
    title="Trivector.ai Collaboration API",
    description="Real-time WebSocket server for multi-user consciousness visualization",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        FRONTEND_URL,
        "https://trivector.ai",
        "https://www.trivector.ai",
        "http://localhost:3000",
        "http://localhost:3001"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring"""
    return {
        "status": "healthy",
        "service": "trivector-websocket",
        "version": "1.0.0",
        "active_sessions": len(manager.active_connections),
        "total_connections": sum(len(conns) for conns in manager.active_connections.values())
    }


# API info endpoint
@app.get("/")
async def root():
    """API information"""
    return {
        "service": "Trivector.ai Collaboration API",
        "version": "1.0.0",
        "docs": "/docs",
        "websocket": "/api/v1/session/connect/{session_id}",
        "health": "/health"
    }


# Include routers
app.include_router(auth_router, prefix="/api/v1", tags=["auth"])
app.include_router(sessions_router, prefix="/api/v1", tags=["sessions"])
app.include_router(history_router, prefix="/api/v1", tags=["history"])


# WebSocket endpoint
@app.websocket("/api/v1/session/connect/{session_id}")
async def websocket_connect(websocket: WebSocket, session_id: str):
    """
    Main WebSocket endpoint for real-time collaboration.
    
    Protocol:
    1. Client connects with session_id
    2. Client sends auth message with JWT
    3. Server responds with session state
    4. Client/server exchange param updates
    5. Server broadcasts to all clients with sequence numbers
    
    See api/websocket.py for full implementation.
    """
    await websocket_endpoint(websocket, session_id)


if __name__ == "__main__":
    # Run with uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=PORT,
        reload=(ENV == "development"),
        log_level="info",
        ws_ping_interval=20,
        ws_ping_timeout=20
    )
