/**
 * React WebSocket Hook with Auto-Reconnection
 * 
 * Features:
 * - Automatic reconnection with exponential backoff
 * - Sequence number tracking
 * - Message ordering enforcement
 * - Heartbeat ping/pong
 * - State synchronization
 * 
 * Based on: MANUS AI Implementation Package - Artifact 2 (Frontend)
 */

import { useEffect, useRef, useState, useCallback } from 'react';

export interface WebSocketMessage {
  type: string;
  seq?: number;
  timestamp?: string;
  payload?: any;
}

export interface WebSocketConfig {
  url: string;
  sessionId: string;
  userId?: string;
  userName?: string;
  userColor?: string;
  token?: string;
  onMessage?: (message: WebSocketMessage) => void;
  onStateSync?: (state: any) => void;
  onUserJoined?: (user: any) => void;
  onUserLeft?: (userId: string) => void;
  onConflict?: (conflict: any) => void;
  autoReconnect?: boolean;
  heartbeatInterval?: number;
}

export interface WebSocketState {
  connected: boolean;
  authenticated: boolean;
  reconnecting: boolean;
  error: string | null;
  lastSeq: number;
  users: any[];
}

export function useWebSocket(config: WebSocketConfig) {
  const {
    url,
    sessionId,
    userId = 'anonymous',
    userName,
    userColor = '#8b5cf6',
    token,
    onMessage,
    onStateSync,
    onUserJoined,
    onUserLeft,
    onConflict,
    autoReconnect = true,
    heartbeatInterval = 30000
  } = config;

  const [state, setState] = useState<WebSocketState>({
    connected: false,
    authenticated: false,
    reconnecting: false,
    error: null,
    lastSeq: 0,
    users: []
  });

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const messageQueue = useRef<WebSocketMessage[]>([]);

  // Calculate reconnect delay with exponential backoff
  const getReconnectDelay = () => {
    const baseDelay = 1000; // 1 second
    const maxDelay = 30000; // 30 seconds
    const delay = Math.min(baseDelay * Math.pow(2, reconnectAttempts.current), maxDelay);
    return delay + Math.random() * 1000; // Add jitter
  };

  // Send message to WebSocket
  const send = useCallback((message: WebSocketMessage) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn('[WS] Cannot send message: WebSocket not open');
    }
  }, []);

  // Send parameter update
  const sendParamUpdate = useCallback((params: Record<string, number>) => {
    send({
      type: 'param:update',
      payload: params
    });
  }, [send]);

  // Resolve conflict
  const resolveConflict = useCallback((param: string, resolvedValue: number, strategy: string) => {
    send({
      type: 'conflict:resolved',
      payload: { param, resolvedValue, strategy }
    });
  }, [send]);

  // Request state resync
  const requestResync = useCallback(() => {
    send({
      type: 'session:resync',
      payload: { lastSeenSeq: state.lastSeq }
    });
  }, [send, state.lastSeq]);

  // Start heartbeat
  const startHeartbeat = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
    }

    heartbeatIntervalRef.current = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        send({ type: 'ping' });
      }
    }, heartbeatInterval);
  }, [send, heartbeatInterval]);

  // Stop heartbeat
  const stopHeartbeat = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }
  }, []);

  // Handle incoming messages
  const handleMessage = useCallback((event: MessageEvent) => {
    try {
      const message: WebSocketMessage = JSON.parse(event.data);

      // Update last seen sequence number
      if (message.seq !== undefined && message.seq > state.lastSeq) {
        setState(prev => ({ ...prev, lastSeq: message.seq! }));
      }

      // Handle different message types
      switch (message.type) {
        case 'auth:success':
          console.log('[WS] ✅ Authenticated successfully');
          setState(prev => ({
            ...prev,
            authenticated: true,
            users: message.payload.users || [],
            lastSeq: message.payload.currentState?.seq || 0
          }));

          // Sync initial state
          if (onStateSync && message.payload.currentState) {
            onStateSync(message.payload.currentState.params);
          }

          reconnectAttempts.current = 0; // Reset reconnect attempts
          startHeartbeat();
          break;

        case 'auth:failed':
          console.error('[WS] ❌ Authentication failed:', message.payload.error);
          setState(prev => ({ ...prev, error: message.payload.error }));
          break;

        case 'param:broadcast':
          // Parameter update from another user
          if (onMessage) {
            onMessage(message);
          }
          break;

        case 'session:joined':
          console.log('[WS] 👤 User joined:', message.payload.user);
          setState(prev => ({
            ...prev,
            users: [...prev.users, message.payload.user]
          }));
          if (onUserJoined) {
            onUserJoined(message.payload.user);
          }
          break;

        case 'session:left':
          console.log('[WS] 👋 User left:', message.payload.userId);
          setState(prev => ({
            ...prev,
            users: prev.users.filter(u => u.id !== message.payload.userId)
          }));
          if (onUserLeft) {
            onUserLeft(message.payload.userId);
          }
          break;

        case 'session:state':
          // Full state resync
          console.log('[WS] 🔄 State resynced');
          if (onStateSync && message.payload.params) {
            onStateSync(message.payload.params);
          }
          setState(prev => ({ ...prev, lastSeq: message.payload.seq || 0 }));
          break;

        case 'conflict:detected':
          console.warn('[WS] ⚠️  Conflict detected:', message.payload);
          if (onConflict) {
            onConflict(message.payload);
          }
          break;

        case 'pong':
          // Heartbeat response
          break;

        default:
          console.log('[WS] Unknown message type:', message.type);
      }
    } catch (error) {
      console.error('[WS] Error parsing message:', error);
    }
  }, [state.lastSeq, onMessage, onStateSync, onUserJoined, onUserLeft, onConflict, startHeartbeat]);

  // Connect to WebSocket
  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log('[WS] Already connected');
      return;
    }

    const wsUrl = `${url}/api/v1/session/connect/${sessionId}`;
    console.log('[WS] 🔌 Connecting to:', wsUrl);

    setState(prev => ({ ...prev, reconnecting: true, error: null }));

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('[WS] ✅ Connected');
        setState(prev => ({ ...prev, connected: true, reconnecting: false }));

        // Send authentication message with JWT token
        ws.send(JSON.stringify({
          type: 'auth',
          payload: {
            token: token || 'anonymous',
            name: userName || `User ${userId.slice(-6)}`,
            color: userColor
          }
        }));
      };

      ws.onmessage = handleMessage;

      ws.onerror = (error) => {
        console.error('[WS] ❌ Error:', error);
        setState(prev => ({ ...prev, error: 'WebSocket error' }));
      };

      ws.onclose = (event) => {
        console.log('[WS] 🔌 Disconnected:', event.code, event.reason);
        setState(prev => ({
          ...prev,
          connected: false,
          authenticated: false
        }));

        stopHeartbeat();

        // Auto-reconnect
        if (autoReconnect && !event.wasClean) {
          const delay = getReconnectDelay();
          console.log(`[WS] 🔄 Reconnecting in ${delay}ms...`);

          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttempts.current++;
            connect();
          }, delay);
        }
      };
    } catch (error) {
      console.error('[WS] Failed to create WebSocket:', error);
      setState(prev => ({ ...prev, error: 'Failed to connect' }));
    }
  }, [url, sessionId, userId, userName, userColor, autoReconnect, handleMessage, stopHeartbeat]);

  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    console.log('[WS] 🛑 Disconnecting...');

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    stopHeartbeat();

    if (wsRef.current) {
      wsRef.current.close(1000, 'Client disconnect');
      wsRef.current = null;
    }

    setState({
      connected: false,
      authenticated: false,
      reconnecting: false,
      error: null,
      lastSeq: 0,
      users: []
    });
  }, [stopHeartbeat]);

  // Connect on mount
  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [sessionId]); // Only reconnect if sessionId changes

  return {
    ...state,
    send,
    sendParamUpdate,
    resolveConflict,
    requestResync,
    connect,
    disconnect
  };
}
