'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface SessionManagerProps {
  sessionId: string | null;
  onCreateSession: () => void;
  onJoinSession: (sessionId: string) => void;
  onLeaveSession: () => void;
  className?: string;
}

export const SessionManager: React.FC<SessionManagerProps> = ({
  sessionId,
  onCreateSession,
  onJoinSession,
  onLeaveSession,
  className = ''
}) => {
  const [joinId, setJoinId] = useState('');
  const [showJoinInput, setShowJoinInput] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    const link = `${window.location.origin}${window.location.pathname}?session=${sessionId}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleJoin = () => {
    if (joinId.trim()) {
      onJoinSession(joinId.trim());
      setJoinId('');
      setShowJoinInput(false);
    }
  };

  if (sessionId) {
    // Already in a session
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className="flex items-center gap-2 px-3 py-2 bg-green-600/20 border border-green-500/50 rounded-lg">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span className="text-sm text-green-400 font-mono">Session: {sessionId}</span>
        </div>

        <button
          onClick={handleCopyLink}
          className="px-3 py-2 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/50 rounded-lg text-cyan-400 text-sm transition-all"
        >
          {copied ? '✓ Copied!' : '📋 Copy Link'}
        </button>

        <button
          onClick={onLeaveSession}
          className="px-3 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 rounded-lg text-red-400 text-sm transition-all"
        >
          🚪 Leave
        </button>
      </div>
    );
  }

  // Not in a session
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <button
        onClick={onCreateSession}
        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium rounded-lg transition-all shadow-lg hover:shadow-purple-500/50"
      >
        🎯 Start Collaboration
      </button>

      {showJoinInput ? (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 'auto', opacity: 1 }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={joinId}
            onChange={(e) => setJoinId(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
            placeholder="Enter session ID"
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500 font-mono"
            autoFocus
          />
          <button
            onClick={handleJoin}
            className="px-3 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm transition-all"
          >
            Join
          </button>
          <button
            onClick={() => setShowJoinInput(false)}
            className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm transition-all"
          >
            Cancel
          </button>
        </motion.div>
      ) : (
        <button
          onClick={() => setShowJoinInput(true)}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 rounded-lg text-sm transition-all"
        >
          🔗 Join Session
        </button>
      )}
    </div>
  );
};
