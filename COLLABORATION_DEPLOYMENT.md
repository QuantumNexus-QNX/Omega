# WebSocket Collaboration System - Deployment Guide

## 🎯 Overview

This guide covers deploying the real-time collaboration system for Trivector.ai, enabling multiple users to explore consciousness mathematics together with synchronized parameters.

---

## 📦 What Was Built

### Backend (FastAPI)
- **WebSocket Server** - Real-time bidirectional communication
- **Connection Manager** - Sequence-numbered message ordering
- **Session Management** - Multi-user session lifecycle
- **Conflict Detection** - 500ms window for simultaneous updates
- **Auto-reconnection** - Exponential backoff with jitter

### Frontend (React/Next.js)
- **useWebSocket Hook** - Auto-reconnecting WebSocket client
- **CollaborationContext** - Parameter synchronization
- **ConflictResolution** - Modal UI for conflict resolution
- **SessionManager** - Create/join/leave session controls
- **UserPresence** - Avatar stack showing active users

---

## 🚀 Deployment Steps

### 1. Backend Deployment

#### Option A: Local Development

```bash
# Navigate to backend directory
cd backend/

# Create virtual environment
python3.11 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env with your configuration

# Run server
python main.py
```

Server will start at `http://localhost:8000`

#### Option B: Production (Docker)

```dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

```bash
# Build and run
docker build -t trivector-backend .
docker run -p 8000:8000 --env-file .env trivector-backend
```

#### Option C: Production (Render/Railway/Fly.io)

**render.yaml:**
```yaml
services:
  - type: web
    name: trivector-websocket
    env: python
    buildCommand: pip install -r backend/requirements.txt
    startCommand: cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: ENV
        value: production
      - key: FRONTEND_URL
        value: https://trivector.ai
```

### 2. Frontend Configuration

Add environment variable to `.env.local`:

```bash
# WebSocket server URL
NEXT_PUBLIC_WS_URL=ws://localhost:8000  # Development
# NEXT_PUBLIC_WS_URL=wss://api.trivector.ai  # Production
```

### 3. Build and Deploy Frontend

```bash
# Install dependencies (if not already)
npm install

# Build
npm run build

# Deploy to Vercel
vercel --prod
```

---

## 🔧 Configuration

### Backend Environment Variables

```bash
# Environment
ENV=production

# Server
PORT=8000
HOST=0.0.0.0

# Frontend URL (for CORS)
FRONTEND_URL=https://trivector.ai

# JWT Secret (optional - for authenticated users)
JWT_SECRET=your-secret-key-here
JWT_ALGORITHM=HS256
JWT_EXPIRATION=86400

# Redis (optional - for session persistence)
REDIS_URL=redis://localhost:6379/0

# Logging
LOG_LEVEL=INFO
```

### Frontend Environment Variables

```bash
# WebSocket server URL
NEXT_PUBLIC_WS_URL=wss://api.trivector.ai
```

---

## 🧪 Testing

### Manual Testing Checklist

#### Single User
- [ ] Open `/trilogic` page
- [ ] Click "Start Collaboration"
- [ ] Verify session ID appears
- [ ] Adjust μ, Ω, κ parameters
- [ ] Check no errors in console

#### Multi-User (Same Session)
- [ ] User A: Start collaboration, copy link
- [ ] User B: Open link in new browser/incognito
- [ ] User A: Adjust μ slider
- [ ] User B: Verify μ updates in real-time
- [ ] User B: Adjust Ω slider
- [ ] User A: Verify Ω updates in real-time
- [ ] Both: Check user presence avatars appear

#### Conflict Resolution
- [ ] User A & B: Simultaneously adjust same parameter
- [ ] Verify conflict modal appears
- [ ] Test "Keep Your Value" strategy
- [ ] Test "Accept Their Value" strategy
- [ ] Test "Use Average" strategy
- [ ] Verify both users sync after resolution

#### Reconnection
- [ ] User A: Start session
- [ ] User B: Join session
- [ ] User B: Close browser tab
- [ ] User A: Adjust parameters
- [ ] User B: Reopen tab (same URL)
- [ ] Verify User B resyncs to latest state

#### Session Management
- [ ] Create session
- [ ] Copy link
- [ ] Leave session
- [ ] Join existing session by ID
- [ ] Verify URL updates correctly

### Automated Testing

```bash
# Backend tests
cd backend/
pytest

# Frontend tests
npm test
```

---

## 📊 Monitoring

### Health Check

```bash
curl http://localhost:8000/health
```

Response:
```json
{
  "status": "healthy",
  "service": "trivector-websocket",
  "version": "1.0.0",
  "active_sessions": 3,
  "total_connections": 7
}
```

### Logs

Backend logs are written to:
- Console: Colored structured logs
- File: `logs/trivector_YYYY-MM-DD.log` (7-day retention)

Key log patterns to monitor:
- `🔌 Client connected` - New connection
- `❌ Error broadcasting` - Dead connection
- `⚠️ Conflict detected` - Simultaneous update
- `🔄 Resync` - Client reconnection

---

## 🐛 Troubleshooting

### WebSocket Connection Fails

**Symptoms:** "WebSocket error" in console

**Solutions:**
1. Check backend is running: `curl http://localhost:8000/health`
2. Verify CORS settings in `main.py` include frontend URL
3. Check firewall allows WebSocket connections (port 8000)
4. Ensure `NEXT_PUBLIC_WS_URL` is correct

### Parameters Don't Sync

**Symptoms:** User B doesn't see User A's changes

**Solutions:**
1. Check both users are in same session (same session ID)
2. Verify WebSocket connection status (green dot)
3. Check browser console for errors
4. Verify backend logs show both connections

### Conflict Modal Appears Constantly

**Symptoms:** Conflict modal shows on every parameter change

**Solutions:**
1. Check debounce timeout (should be 300ms)
2. Verify `isUpdatingFromRemote` flag is working
3. Check conflict window (should be 500ms)
4. Ensure sequence numbers are incrementing

### Session Not Found After Refresh

**Symptoms:** User loses session after browser refresh

**Solutions:**
1. Verify session ID is in URL (`?session=abc123`)
2. Check browser doesn't block URL parameters
3. Ensure CollaborationProvider reads from searchParams
4. Check backend hasn't cleaned up session (no users)

---

## 🔒 Security Considerations

### Production Checklist

- [ ] Enable HTTPS/WSS (not HTTP/WS)
- [ ] Implement JWT authentication (replace anonymous auth)
- [ ] Add rate limiting (prevent spam)
- [ ] Validate all parameter values server-side
- [ ] Sanitize session IDs (prevent injection)
- [ ] Add CSRF protection
- [ ] Enable Redis for session persistence
- [ ] Set up monitoring/alerting
- [ ] Configure firewall rules
- [ ] Use environment variables for secrets

### Rate Limiting

Add to `main.py`:

```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

@app.websocket("/api/v1/session/connect/{session_id}")
@limiter.limit("10/minute")  # Max 10 connections per minute per IP
async def websocket_connect(...):
    ...
```

---

## 📈 Performance Optimization

### Backend

1. **Redis Session Store** - Persist sessions across server restarts
2. **Message Compression** - Enable WebSocket compression
3. **Connection Pooling** - Reuse database connections
4. **Horizontal Scaling** - Use Redis pub/sub for multi-server

### Frontend

1. **Debouncing** - Already implemented (300ms)
2. **Message Batching** - Send multiple param updates together
3. **Lazy Loading** - Load collaboration features on demand
4. **Service Worker** - Cache static assets

---

## 🎯 Next Steps

### Enhancements

1. **Persistent Sessions** - Save to database
2. **User Authentication** - Real JWT with OAuth
3. **Session History** - Replay parameter changes
4. **Voice Chat** - WebRTC integration
5. **Cursor Tracking** - See where others are looking
6. **Annotations** - Collaborative notes
7. **Session Recording** - Export parameter timelines
8. **Admin Dashboard** - Monitor all sessions

### Scaling

1. **Redis Pub/Sub** - Multi-server WebSocket
2. **Load Balancer** - Distribute connections
3. **CDN** - Cache static frontend
4. **Database** - PostgreSQL for persistence
5. **Monitoring** - Prometheus + Grafana

---

## 📚 API Reference

### WebSocket Protocol

#### Client → Server

```typescript
// Authentication
{
  type: 'auth',
  payload: { token: string, name?: string, color?: string }
}

// Parameter update
{
  type: 'param:update',
  payload: { mu?: number, omega?: number, kappa?: number }
}

// Conflict resolution
{
  type: 'conflict:resolved',
  payload: { param: string, resolvedValue: number, strategy: string }
}

// Resync request
{
  type: 'session:resync',
  payload: { lastSeenSeq: number }
}

// Heartbeat
{
  type: 'ping'
}
```

#### Server → Client

```typescript
// Auth success
{
  type: 'auth:success',
  seq: number,
  timestamp: string,
  payload: {
    sessionId: string,
    userId: string,
    users: User[],
    currentState: { params: {...}, seq: number }
  }
}

// Parameter broadcast
{
  type: 'param:broadcast',
  seq: number,
  timestamp: string,
  payload: { userId: string, params: {...} }
}

// Conflict detected
{
  type: 'conflict:detected',
  seq: number,
  timestamp: string,
  payload: {
    param: string,
    yourValue: number,
    theirValue: number,
    theirUserId: string,
    theirUserName: string
  }
}

// User joined
{
  type: 'session:joined',
  seq: number,
  timestamp: string,
  payload: { user: User }
}

// User left
{
  type: 'session:left',
  seq: number,
  timestamp: string,
  payload: { userId: string }
}

// State sync
{
  type: 'session:state',
  seq: number,
  timestamp: string,
  payload: { params: {...}, seq: number }
}

// Heartbeat response
{
  type: 'pong'
}
```

### REST API

```bash
# Create session
POST /api/v1/sessions
Response: { session_id, join_url, created_at }

# List sessions
GET /api/v1/sessions
Response: [{ session_id, user_count, current_seq, state }]

# Get session
GET /api/v1/sessions/{session_id}
Response: { session_id, user_count, current_seq, state }

# Delete session
DELETE /api/v1/sessions/{session_id}
Response: { status: "deleted", session_id }
```

---

## ✅ Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] CORS settings correct
- [ ] SSL certificates ready (production)
- [ ] Monitoring set up
- [ ] Backup strategy defined

### Deployment
- [ ] Backend deployed and healthy
- [ ] Frontend deployed
- [ ] WebSocket connection works
- [ ] Multi-user sync tested
- [ ] Conflict resolution tested
- [ ] Reconnection tested

### Post-Deployment
- [ ] Monitor error rates
- [ ] Check connection counts
- [ ] Verify latency < 100ms
- [ ] Test from different networks
- [ ] Update documentation
- [ ] Notify users of new feature

---

**Built with restraint, deployed with confidence.** 🚀
