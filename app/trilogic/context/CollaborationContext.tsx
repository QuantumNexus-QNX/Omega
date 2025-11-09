'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { useSearchParams } from 'next/navigation';
import { useWebSocket } from '../../lib/websocket/useWebSocket';
import { useParameters } from './ParameterContext';
import { useAuth } from '../../lib/auth/useAuth';
import type { Conflict } from '../../components/ConflictResolution';

interface CollaborationContextType {
  sessionId: string | null;
  connected: boolean;
  users: any[];
  currentConflict: Conflict | null;
  createSession: () => void;
  joinSession: (sessionId: string) => void;
  leaveSession: () => void;
  resolveConflict: (param: string, value: number, strategy: string) => void;
  dismissConflict: () => void;
}

const CollaborationContext = createContext<CollaborationContextType | undefined>(undefined);

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000';

export function CollaborationProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const { params, setMu, setOmega, setKappa } = useParameters();
  const { user, token, loginAnonymous, isAuthenticated } = useAuth();
  
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentConflict, setCurrentConflict] = useState<Conflict | null>(null);
  const [isUpdatingFromRemote, setIsUpdatingFromRemote] = useState(false);
  
  // Auto-login as anonymous if not authenticated
  useEffect(() => {
    if (!isAuthenticated && typeof window !== 'undefined') {
      loginAnonymous();
    }
  }, [isAuthenticated, loginAnonymous]);

  // Check for session ID in URL on mount
  useEffect(() => {
    const urlSessionId = searchParams?.get('session');
    if (urlSessionId) {
      setSessionId(urlSessionId);
    }
  }, [searchParams]);

  // WebSocket connection (only if authenticated)
  const ws = useWebSocket({
    url: WS_URL,
    sessionId: sessionId || 'default',
    userId: user?.user_id,
    userName: user?.username,
    token: token || undefined,
    
    onMessage: (message) => {
      if (message.type === 'param:broadcast') {
        // Update from another user
        setIsUpdatingFromRemote(true);
        
        const remoteParams = message.payload.params;
        if (remoteParams.mu !== undefined) setMu(remoteParams.mu);
        if (remoteParams.omega !== undefined) setOmega(remoteParams.omega);
        if (remoteParams.kappa !== undefined) setKappa(remoteParams.kappa);
        
        // Reset flag after update
        setTimeout(() => setIsUpdatingFromRemote(false), 100);
      }
    },
    
    onStateSync: (state) => {
      // Full state sync (on connect or reconnect)
      console.log('[Collab] Syncing state:', state);
      setIsUpdatingFromRemote(true);
      
      if (state.mu !== undefined) setMu(state.mu);
      if (state.omega !== undefined) setOmega(state.omega);
      if (state.kappa !== undefined) setKappa(state.kappa);
      
      setTimeout(() => setIsUpdatingFromRemote(false), 100);
    },
    
    onConflict: (conflict) => {
      console.log('[Collab] Conflict detected:', conflict);
      setCurrentConflict(conflict);
    },
    
    autoReconnect: true
  });

  // Send parameter updates to other users (debounced)
  useEffect(() => {
    if (!sessionId || !ws.connected || isUpdatingFromRemote) {
      return; // Don't send if not in session, not connected, or updating from remote
    }

    const timeoutId = setTimeout(() => {
      ws.sendParamUpdate({
        mu: params.mu,
        omega: params.omega,
        kappa: params.kappa
      });
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [params.mu, params.omega, params.kappa, sessionId, ws.connected, isUpdatingFromRemote]);

  const createSession = useCallback(() => {
    // Generate random session ID
    const newSessionId = Math.random().toString(36).substring(2, 10);
    setSessionId(newSessionId);
    
    // Update URL
    const url = new URL(window.location.href);
    url.searchParams.set('session', newSessionId);
    window.history.pushState({}, '', url);
  }, []);

  const joinSession = useCallback((id: string) => {
    setSessionId(id);
    
    // Update URL
    const url = new URL(window.location.href);
    url.searchParams.set('session', id);
    window.history.pushState({}, '', url);
  }, []);

  const leaveSession = useCallback(() => {
    setSessionId(null);
    ws.disconnect();
    
    // Remove session from URL
    const url = new URL(window.location.href);
    url.searchParams.delete('session');
    window.history.pushState({}, '', url);
  }, [ws]);

  const resolveConflict = useCallback((param: string, value: number, strategy: string) => {
    console.log('[Collab] Resolving conflict:', { param, value, strategy });
    
    // Update local state
    if (param === 'mu') setMu(value);
    else if (param === 'omega') setOmega(value);
    else if (param === 'kappa') setKappa(value);
    
    // Send resolution to server
    ws.resolveConflict(param, value, strategy);
    
    // Clear conflict
    setCurrentConflict(null);
  }, [ws, setMu, setOmega, setKappa]);

  const dismissConflict = useCallback(() => {
    setCurrentConflict(null);
  }, []);

  return (
    <CollaborationContext.Provider
      value={{
        sessionId,
        connected: ws.connected && ws.authenticated,
        users: ws.users,
        currentConflict,
        createSession,
        joinSession,
        leaveSession,
        resolveConflict,
        dismissConflict
      }}
    >
      {children}
    </CollaborationContext.Provider>
  );
}

export function useCollaboration() {
  const context = useContext(CollaborationContext);
  if (!context) {
    throw new Error('useCollaboration must be used within CollaborationProvider');
  }
  return context;
}
