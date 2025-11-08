'use client';

/**
 * Sphere Controls Component
 * 
 * Provides interactive controls for the Riemann sphere:
 * - Focus View: Optimal camera angle
 * - Cross-Ratio Display: Shows invariance under Möbius transformations
 * - Animation controls
 * - Projection line toggle
 */

import React, { useState, useEffect } from 'react';

interface SphereControlsProps {
  showProjectionLines: boolean;
  showSpiral: boolean;
  animating: boolean;
  onToggleProjectionLines: () => void;
  onToggleSpiral: () => void;
  onToggleAnimation: () => void;
  onFocusView: () => void;
  crossRatio?: number;
}

export default function SphereControls({
  showProjectionLines,
  showSpiral,
  animating,
  onToggleProjectionLines,
  onToggleSpiral,
  onToggleAnimation,
  onFocusView,
  crossRatio
}: SphereControlsProps) {
  const [animationSpeed, setAnimationSpeed] = useState(1);

  return (
    <div className="space-y-4">
      {/* View Controls */}
      <div className="bg-black/30 rounded-lg p-4 border border-cyan-500/30">
        <h3 className="text-sm font-semibold text-cyan-400 mb-3">View Controls</h3>
        
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onFocusView}
            className="px-3 py-2 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 rounded 
                       border border-cyan-500/30 transition-all duration-200 text-sm"
          >
            🎯 Focus View
          </button>
          
          <button
            onClick={onToggleAnimation}
            className={`px-3 py-2 rounded border transition-all duration-200 text-sm ${
              animating
                ? 'bg-purple-600/30 text-purple-300 border-purple-500/30'
                : 'bg-gray-600/20 text-gray-300 border-gray-500/30'
            }`}
          >
            {animating ? '⏸ Pause' : '▶ Rotate'}
          </button>
        </div>
      </div>

      {/* Visualization Toggles */}
      <div className="bg-black/30 rounded-lg p-4 border border-purple-500/30">
        <h3 className="text-sm font-semibold text-purple-400 mb-3">Visualization</h3>
        
        <div className="space-y-2">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm text-gray-300">Projection Lines</span>
            <input
              type="checkbox"
              checked={showProjectionLines}
              onChange={onToggleProjectionLines}
              className="w-4 h-4 rounded bg-gray-700 border-gray-600 text-purple-600 
                         focus:ring-purple-500 focus:ring-offset-gray-800"
            />
          </label>
          
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm text-gray-300">Equilibrium Spiral</span>
            <input
              type="checkbox"
              checked={showSpiral}
              onChange={onToggleSpiral}
              className="w-4 h-4 rounded bg-gray-700 border-gray-600 text-purple-600 
                         focus:ring-purple-500 focus:ring-offset-gray-800"
            />
          </label>
        </div>
      </div>

      {/* Animation Speed */}
      {animating && (
        <div className="bg-black/30 rounded-lg p-4 border border-pink-500/30">
          <h3 className="text-sm font-semibold text-pink-400 mb-3">Animation Speed</h3>
          
          <div className="flex items-center space-x-3">
            <span className="text-xs text-gray-400">Slow</span>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={animationSpeed}
              onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
              className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-xs text-gray-400">Fast</span>
          </div>
          
          <div className="mt-2 text-center text-sm text-pink-300">
            {animationSpeed}x
          </div>
        </div>
      )}

      {/* Cross-Ratio Display */}
      {crossRatio !== undefined && (
        <div className="bg-black/30 rounded-lg p-4 border border-amber-500/30">
          <h3 className="text-sm font-semibold text-amber-400 mb-2">Cross-Ratio</h3>
          
          <div className="text-center">
            <div className="text-2xl font-mono text-amber-300 mb-1">
              {crossRatio.toFixed(4)}
            </div>
            <p className="text-xs text-gray-400">
              Invariant under Möbius transformations
            </p>
          </div>
          
          <div className="mt-3 p-2 bg-amber-500/10 rounded text-xs text-gray-300">
            <p className="mb-1">
              The cross-ratio [z₁, z₂; z₃, z₄] measures the relationship between four points.
            </p>
            <p className="text-amber-400">
              ✓ Preserved by all Möbius transformations
            </p>
          </div>
        </div>
      )}

      {/* Mathematical Constants */}
      <div className="bg-black/30 rounded-lg p-4 border border-green-500/30">
        <h3 className="text-sm font-semibold text-green-400 mb-3">Framework Constants</h3>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Equilibrium (μ)</span>
            <span className="font-mono text-cyan-300">0.569</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Resonance (Ω)</span>
            <span className="font-mono text-purple-300">0.847 Hz</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Tri-Logic</span>
            <span className="font-mono text-pink-300">{'{0, 1, ∅}'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
