'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Conflict {
  param: string;
  yourValue: number;
  theirValue: number;
  theirUserId: string;
  theirUserName: string;
}

interface ConflictResolutionProps {
  conflict: Conflict | null;
  onResolve: (param: string, resolvedValue: number, strategy: string) => void;
  onDismiss: () => void;
}

const PARAM_LABELS: Record<string, string> = {
  mu: 'μ (Equilibrium)',
  omega: 'Ω (Resonance)',
  kappa: 'κ (Coupling)'
};

export const ConflictResolution: React.FC<ConflictResolutionProps> = ({
  conflict,
  onResolve,
  onDismiss
}) => {
  const [selectedStrategy, setSelectedStrategy] = useState<'yours' | 'theirs' | 'average' | null>(null);

  if (!conflict) return null;

  const paramLabel = PARAM_LABELS[conflict.param] || conflict.param;
  const average = (conflict.yourValue + conflict.theirValue) / 2;

  const handleResolve = (strategy: 'yours' | 'theirs' | 'average') => {
    let resolvedValue: number;

    switch (strategy) {
      case 'yours':
        resolvedValue = conflict.yourValue;
        break;
      case 'theirs':
        resolvedValue = conflict.theirValue;
        break;
      case 'average':
        resolvedValue = average;
        break;
    }

    onResolve(conflict.param, resolvedValue, strategy);
    setSelectedStrategy(null);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onDismiss}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', duration: 0.3 }}
          className="bg-gradient-to-br from-gray-900 via-purple-900/30 to-gray-900 border-2 border-amber-500/50 rounded-lg p-6 max-w-md w-full shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">⚠️</span>
            <div>
              <h3 className="text-xl font-bold text-amber-400">Parameter Conflict</h3>
              <p className="text-sm text-gray-400">
                {conflict.theirUserName} updated {paramLabel} at the same time
              </p>
            </div>
          </div>

          {/* Conflict Details */}
          <div className="bg-black/30 rounded-lg p-4 mb-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Parameter:</span>
              <span className="text-white font-mono font-bold">{paramLabel}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-cyan-400">Your value:</span>
              <span className="text-cyan-400 font-mono font-bold">
                {conflict.yourValue.toFixed(4)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-purple-400">Their value:</span>
              <span className="text-purple-400 font-mono font-bold">
                {conflict.theirValue.toFixed(4)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-pink-400">Average:</span>
              <span className="text-pink-400 font-mono font-bold">
                {average.toFixed(4)}
              </span>
            </div>
          </div>

          {/* Resolution Strategies */}
          <div className="space-y-3 mb-6">
            <p className="text-sm text-gray-400 mb-3">Choose a resolution strategy:</p>

            {/* Keep Yours */}
            <button
              onClick={() => handleResolve('yours')}
              className="w-full flex items-center justify-between p-3 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/50 rounded-lg transition-all group"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">👤</span>
                <div className="text-left">
                  <div className="text-white font-medium">Keep Your Value</div>
                  <div className="text-xs text-gray-400">Use {conflict.yourValue.toFixed(4)}</div>
                </div>
              </div>
              <span className="text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                →
              </span>
            </button>

            {/* Accept Theirs */}
            <button
              onClick={() => handleResolve('theirs')}
              className="w-full flex items-center justify-between p-3 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/50 rounded-lg transition-all group"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">👥</span>
                <div className="text-left">
                  <div className="text-white font-medium">Accept Their Value</div>
                  <div className="text-xs text-gray-400">Use {conflict.theirValue.toFixed(4)}</div>
                </div>
              </div>
              <span className="text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
                →
              </span>
            </button>

            {/* Average */}
            <button
              onClick={() => handleResolve('average')}
              className="w-full flex items-center justify-between p-3 bg-pink-600/20 hover:bg-pink-600/30 border border-pink-500/50 rounded-lg transition-all group"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🤝</span>
                <div className="text-left">
                  <div className="text-white font-medium">Use Average</div>
                  <div className="text-xs text-gray-400">Use {average.toFixed(4)}</div>
                </div>
              </div>
              <span className="text-pink-400 opacity-0 group-hover:opacity-100 transition-opacity">
                →
              </span>
            </button>
          </div>

          {/* Dismiss */}
          <button
            onClick={onDismiss}
            className="w-full py-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            Dismiss (keep current)
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
