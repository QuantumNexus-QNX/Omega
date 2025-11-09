# Trivector.ai WebSocket Collaboration Server

Real-time multi-user parameter synchronization for consciousness mathematics visualization.

## Features

- ✅ **WebSocket Server** - FastAPI-based real-time communication
- ✅ **Sequence Numbering** - Monotonic message ordering per session
- ✅ **Conflict Detection** - 500ms window for simultaneous updates
- ✅ **Auto-Reconnection** - Exponential backoff with state resync
- ✅ **Session Management** - Multi-user session lifecycle
- ✅ **User Presence** - Track active collaborators
- ✅ **Anonymous Auth** - No login required (upgradeable to JWT)

## Quick Start

```bash
# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Run server
python main.py
```

Server starts at `http://localhost:8000`

## API Endpoints

### WebSocket
- `ws://localhost:8000/api/v1/session/connect/{session_id}`

### REST
- `GET /health` - Health check
- `POST /api/v1/sessions` - Create session
- `GET /api/v1/sessions` - List sessions
- `GET /api/v1/sessions/{id}` - Get session
- `DELETE /api/v1/sessions/{id}` - Delete session

## Architecture

```
┌─────────────┐
│   Client A  │─────┐
└─────────────┘     │
                    │    ┌──────────────────┐
┌─────────────┐     ├───▶│  FastAPI Server  │
│   Client B  │─────┤    │  (WebSocket)     │
└─────────────┘     │    └──────────────────┘
                    │            │
┌─────────────┐     │            ▼
│   Client C  │─────┘    ┌──────────────────┐
└─────────────┘          │ ConnectionManager│
                         │ (In-Memory)      │
                         └──────────────────┘
```

## Message Protocol

See [COLLABORATION_DEPLOYMENT.md](../COLLABORATION_DEPLOYMENT.md) for full protocol specification.

## Development

```bash
# Run with auto-reload
uvicorn main:app --reload --port 8000

# Run tests
pytest

# Format code
black .
```

## Production Deployment

See [COLLABORATION_DEPLOYMENT.md](../COLLABORATION_DEPLOYMENT.md) for deployment guide.

## License

MIT
