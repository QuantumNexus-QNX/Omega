'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface HistoryEvent {
  seq: number;
  user_id: string;
  params: Record<string, number>;
  timestamp: string;
}

interface SessionReplayProps {
  sessionId: string;
  onReplay?: (params: Record<string, number>) => void;
  className?: string;
}

export const SessionReplay: React.FC<SessionReplayProps> = ({
  sessionId,
  onReplay,
  className = ''
}) => {
  const [history, setHistory] = useState<HistoryEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [speed, setSpeed] = useState(1); // 1x, 2x, 4x
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load history
  const loadHistory = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/v1/history/${sessionId}/full`);
      
      if (response.ok) {
        const data = await response.json();
        setHistory(data.events);
      }
    } catch (error) {
      console.error('[Replay] Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  // Play/pause replay
  const togglePlay = () => {
    if (playing) {
      // Pause
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setPlaying(false);
    } else {
      // Play
      setPlaying(true);
    }
  };

  // Reset to beginning
  const reset = () => {
    setCurrentIndex(0);
    setPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Step forward
  const stepForward = () => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Step backward
  const stepBackward = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Jump to specific event
  const jumpTo = (index: number) => {
    setCurrentIndex(index);
  };

  // Playback effect
  useEffect(() => {
    if (playing && currentIndex < history.length - 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex(prev => {
          if (prev >= history.length - 1) {
            setPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000 / speed); // Adjust interval based on speed
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [playing, currentIndex, history.length, speed]);

  // Apply current event parameters
  useEffect(() => {
    if (history[currentIndex] && onReplay) {
      onReplay(history[currentIndex].params);
    }
  }, [currentIndex, history, onReplay]);

  if (loading) {
    return (
      <div className={`p-4 bg-gray-900 rounded-lg ${className}`}>
        <div className="text-gray-400 animate-pulse">Loading session history...</div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className={`p-4 bg-gray-900 rounded-lg ${className}`}>
        <button
          onClick={loadHistory}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-all"
        >
          📜 Load Session History
        </button>
      </div>
    );
  }

  const currentEvent = history[currentIndex];
  const progress = (currentIndex / (history.length - 1)) * 100;

  return (
    <div className={`p-6 bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 border border-purple-500/30 rounded-lg ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-purple-400">📜 Session Replay</h3>
        <div className="text-sm text-gray-400">
          {history.length} events
        </div>
      </div>

      {/* Current Event Info */}
      <div className="bg-black/30 rounded-lg p-4 mb-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Event:</span>
            <span className="ml-2 text-white font-mono">{currentIndex + 1} / {history.length}</span>
          </div>
          <div>
            <span className="text-gray-400">Seq:</span>
            <span className="ml-2 text-cyan-400 font-mono">{currentEvent.seq}</span>
          </div>
          <div>
            <span className="text-gray-400">User:</span>
            <span className="ml-2 text-purple-400 font-mono">{currentEvent.user_id.slice(-6)}</span>
          </div>
          <div>
            <span className="text-gray-400">Time:</span>
            <span className="ml-2 text-pink-400 font-mono">
              {new Date(currentEvent.timestamp).toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* Parameters */}
        <div className="mt-3 pt-3 border-t border-gray-700">
          <div className="text-xs text-gray-400 mb-2">Parameters:</div>
          <div className="flex gap-3 flex-wrap">
            {Object.entries(currentEvent.params).map(([key, value]) => (
              <div key={key} className="px-2 py-1 bg-cyan-600/20 border border-cyan-500/50 rounded text-xs">
                <span className="text-cyan-400 font-mono">{key}</span>
                <span className="text-white font-mono ml-1">= {value.toFixed(4)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-600 to-pink-600"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.2 }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{new Date(history[0].timestamp).toLocaleTimeString()}</span>
          <span>{new Date(history[history.length - 1].timestamp).toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-3">
        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={reset}
            className="p-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition-all"
            title="Reset to beginning"
          >
            ⏮️
          </button>

          <button
            onClick={stepBackward}
            disabled={currentIndex === 0}
            className="p-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            title="Step backward"
          >
            ⏪
          </button>

          <button
            onClick={togglePlay}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium rounded-lg transition-all shadow-lg"
          >
            {playing ? '⏸️ Pause' : '▶️ Play'}
          </button>

          <button
            onClick={stepForward}
            disabled={currentIndex === history.length - 1}
            className="p-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            title="Step forward"
          >
            ⏩
          </button>
        </div>

        {/* Speed Control */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">Speed:</span>
          {[1, 2, 4].map(s => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`px-2 py-1 rounded text-xs transition-all ${
                speed === s
                  ? 'bg-cyan-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* Timeline (optional - show all events) */}
      <div className="mt-4 max-h-32 overflow-y-auto">
        <div className="space-y-1">
          {history.map((event, index) => (
            <button
              key={event.seq}
              onClick={() => jumpTo(index)}
              className={`w-full text-left px-2 py-1 rounded text-xs transition-all ${
                index === currentIndex
                  ? 'bg-purple-600/30 border border-purple-500/50'
                  : 'bg-gray-800/50 hover:bg-gray-800 border border-transparent'
              }`}
            >
              <span className="text-gray-400">#{event.seq}</span>
              <span className="ml-2 text-gray-500">{new Date(event.timestamp).toLocaleTimeString()}</span>
              <span className="ml-2 text-cyan-400 font-mono text-[10px]">
                {Object.keys(event.params).join(', ')}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
