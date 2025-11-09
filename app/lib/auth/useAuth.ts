/**
 * Authentication Hook
 * 
 * Manages user authentication state and JWT tokens.
 */

import { useState, useEffect, useCallback } from 'react';

interface User {
  user_id: string;
  username: string;
  email?: string;
  is_anonymous: boolean;
  expires_at: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const TOKEN_KEY = 'trivector_auth_token';
const USER_KEY = 'trivector_user';

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    loading: true,
    error: null
  });

  // Load token from localStorage on mount
  useEffect(() => {
    const loadAuth = async () => {
      if (typeof window === 'undefined') {
        setState(prev => ({ ...prev, loading: false }));
        return;
      }

      const token = localStorage.getItem(TOKEN_KEY);
      const userJson = localStorage.getItem(USER_KEY);

      if (token && userJson) {
        try {
          const user = JSON.parse(userJson);
          
          // Verify token is still valid
          const response = await fetch(`${API_URL}/api/v1/auth/verify?token=${token}`);
          
          if (response.ok) {
            const data = await response.json();
            setState({
              user: data,
              token,
              loading: false,
              error: null
            });
          } else {
            // Token invalid, clear storage
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
            setState({
              user: null,
              token: null,
              loading: false,
              error: null
            });
          }
        } catch (error) {
          console.error('[Auth] Error verifying token:', error);
          setState({
            user: null,
            token: null,
            loading: false,
            error: 'Failed to verify authentication'
          });
        }
      } else {
        setState(prev => ({ ...prev, loading: false }));
      }
    };

    loadAuth();
  }, []);

  // Login as anonymous user
  const loginAnonymous = useCallback(async (username?: string, color?: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch(`${API_URL}/api/v1/auth/anonymous`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, color })
      });

      if (!response.ok) {
        throw new Error('Failed to create anonymous session');
      }

      const data = await response.json();

      // Save to localStorage
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify({
        user_id: data.user_id,
        username: data.username,
        is_anonymous: data.is_anonymous,
        expires_at: data.expires_at
      }));

      setState({
        user: {
          user_id: data.user_id,
          username: data.username,
          is_anonymous: data.is_anonymous,
          expires_at: data.expires_at
        },
        token: data.token,
        loading: false,
        error: null
      });

      return data.token;
    } catch (error) {
      console.error('[Auth] Error logging in anonymously:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to create anonymous session'
      }));
      return null;
    }
  }, []);

  // Login with credentials (OAuth integration point)
  const login = useCallback(async (email: string, password?: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch(`${API_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();

      // Save to localStorage
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify({
        user_id: data.user_id,
        username: data.username,
        email: data.email,
        is_anonymous: data.is_anonymous,
        expires_at: data.expires_at
      }));

      setState({
        user: {
          user_id: data.user_id,
          username: data.username,
          email: data.email,
          is_anonymous: data.is_anonymous,
          expires_at: data.expires_at
        },
        token: data.token,
        loading: false,
        error: null
      });

      return data.token;
    } catch (error) {
      console.error('[Auth] Error logging in:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Login failed'
      }));
      return null;
    }
  }, []);

  // Logout
  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setState({
      user: null,
      token: null,
      loading: false,
      error: null
    });
  }, []);

  // Refresh token
  const refreshToken = useCallback(async () => {
    if (!state.token) return null;

    try {
      const response = await fetch(`${API_URL}/api/v1/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: state.token })
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();

      // Update localStorage
      localStorage.setItem(TOKEN_KEY, data.token);

      setState(prev => ({
        ...prev,
        token: data.token,
        user: prev.user ? { ...prev.user, expires_at: data.expires_at } : null
      }));

      return data.token;
    } catch (error) {
      console.error('[Auth] Error refreshing token:', error);
      // Token refresh failed, logout
      logout();
      return null;
    }
  }, [state.token, logout]);

  // Auto-refresh token before expiration
  useEffect(() => {
    if (!state.user || !state.token) return;

    const expiresAt = new Date(state.user.expires_at);
    const now = new Date();
    const timeUntilExpiry = expiresAt.getTime() - now.getTime();

    // Refresh 1 hour before expiration
    const refreshTime = timeUntilExpiry - (60 * 60 * 1000);

    if (refreshTime > 0) {
      const timeout = setTimeout(() => {
        refreshToken();
      }, refreshTime);

      return () => clearTimeout(timeout);
    }
  }, [state.user, state.token, refreshToken]);

  return {
    user: state.user,
    token: state.token,
    loading: state.loading,
    error: state.error,
    isAuthenticated: !!state.user,
    isAnonymous: state.user?.is_anonymous ?? false,
    loginAnonymous,
    login,
    logout,
    refreshToken
  };
}
