'use client';

/**
 * Collapse Animation Component
 * 
 * Shows the quantum-like collapse of undefined state (∅) into {0, 1}
 * Demonstrates measurement/observation in tri-logic
 */

import React, { useState } from 'react';

interface CollapseAnimationProps {
  onCollapse?: () => void;
}

export default function CollapseAnimation({ onCollapse }: CollapseAnimationProps) {
  const [isCollapsing, setIsCollapsing] = useState(false);

  const handleCollapse = () => {
    setIsCollapsing(true);
    onCollapse?.();
    
    // Reset after animation
    setTimeout(() => {
      setIsCollapsing(false);
    }, 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Quantum Collapse</h3>
          <p className="text-sm text-gray-400">
            Watch ∅ (undefined) collapse into {'{0, 1}'}
          </p>
        </div>
        <button
          onClick={handleCollapse}
          disabled={isCollapsing}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg 
                     hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200"
        >
          {isCollapsing ? 'Collapsing...' : 'Collapse ∅ → {0,1}'}
        </button>
      </div>

      {isCollapsing && (
        <div className="p-4 bg-black/30 rounded-lg border border-purple-500/30">
          <div className="flex items-center justify-center space-x-8">
            {/* Undefined state */}
            <div className="text-center animate-pulse">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 
                              flex items-center justify-center text-2xl font-bold text-white
                              animate-ping">
                ∅
              </div>
              <p className="mt-2 text-xs text-gray-400">Undefined</p>
            </div>

            {/* Arrow */}
            <div className="text-3xl text-purple-400 animate-bounce">→</div>

            {/* Collapsed states */}
            <div className="flex space-x-4">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-400 to-red-600 
                                flex items-center justify-center text-xl font-bold text-white
                                animate-fade-in">
                  0
                </div>
                <p className="mt-2 text-xs text-gray-400">False</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 
                                flex items-center justify-center text-xl font-bold text-white
                                animate-fade-in animation-delay-500">
                  1
                </div>
                <p className="mt-2 text-xs text-gray-400">True</p>
              </div>
            </div>
          </div>

          <div className="mt-4 text-center text-sm text-gray-400">
            <p className="italic">
              "Binary logic is the collapsed measurement state of tri-logic"
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
