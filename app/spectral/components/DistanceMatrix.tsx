'use client';

import React, { useState } from 'react';
import { SpectralTripleResult } from '../lib/spectral-triple';

interface DistanceMatrixProps {
  result: SpectralTripleResult;
  selectedNode: number | null;
  onCellClick?: (i: number, j: number) => void;
}

export const DistanceMatrix: React.FC<DistanceMatrixProps> = ({
  result,
  selectedNode,
  onCellClick
}) => {
  const [hoveredCell, setHoveredCell] = useState<{ i: number; j: number } | null>(null);
  const n = result.distances.length;

  const getCellColor = (distance: number): string => {
    const normalized = distance / result.metadata.maxDistance;
    
    if (normalized < 0.25) return 'bg-cyan-500/80';
    if (normalized < 0.5) return 'bg-purple-500/80';
    if (normalized < 0.75) return 'bg-pink-500/80';
    return 'bg-yellow-500/80';
  };

  const getCellOpacity = (distance: number): string => {
    const normalized = distance / result.metadata.maxDistance;
    return `opacity-${Math.round(normalized * 100)}`;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <span className="text-2xl">📊</span>
          Connes Distance Matrix
        </h3>
        
        {hoveredCell && (
          <div className="text-sm font-mono">
            <span className="text-gray-400">d(</span>
            <span className="text-cyan-400">{hoveredCell.i}</span>
            <span className="text-gray-400">, </span>
            <span className="text-purple-400">{hoveredCell.j}</span>
            <span className="text-gray-400">) = </span>
            <span className="text-yellow-400 font-bold">
              {result.distances[hoveredCell.i][hoveredCell.j].toFixed(6)}
            </span>
          </div>
        )}
      </div>

      {/* Matrix Grid */}
      <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Column headers */}
          <div className="flex mb-2">
            <div className="w-12" /> {/* Empty corner */}
            {Array.from({ length: n }).map((_, j) => (
              <div
                key={j}
                className="w-16 text-center text-xs font-mono text-gray-400"
              >
                {j}
              </div>
            ))}
          </div>

          {/* Matrix rows */}
          {result.distances.map((row, i) => (
            <div key={i} className="flex items-center mb-1">
              {/* Row header */}
              <div className="w-12 text-right pr-3 text-xs font-mono text-gray-400">
                {i}
              </div>

              {/* Cells */}
              {row.map((distance, j) => {
                const isSelected = selectedNode === i || selectedNode === j;
                const isDiagonal = i === j;
                const isHovered = hoveredCell?.i === i && hoveredCell?.j === j;

                return (
                  <button
                    key={j}
                    onClick={() => onCellClick?.(i, j)}
                    onMouseEnter={() => setHoveredCell({ i, j })}
                    onMouseLeave={() => setHoveredCell(null)}
                    className={`
                      w-16 h-12 border border-gray-700 transition-all relative
                      ${isDiagonal ? 'bg-gray-800' : getCellColor(distance)}
                      ${isSelected ? 'ring-2 ring-yellow-400' : ''}
                      ${isHovered ? 'scale-110 z-10 ring-2 ring-white' : ''}
                      ${!isDiagonal ? 'hover:scale-105 cursor-pointer' : 'cursor-default'}
                    `}
                    style={{
                      opacity: isDiagonal ? 0.3 : 0.5 + (distance / result.metadata.maxDistance) * 0.5
                    }}
                  >
                    {!isDiagonal && (
                      <span className="text-xs font-mono text-white font-bold">
                        {distance.toFixed(3)}
                      </span>
                    )}
                    {isDiagonal && (
                      <span className="text-xs font-mono text-gray-600">0</span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs">
        <span className="text-gray-400">Distance Scale:</span>
        <div className="flex items-center gap-2">
          <div className="w-8 h-4 bg-cyan-500/80 rounded" />
          <span className="text-gray-400">Low</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-4 bg-purple-500/80 rounded" />
          <span className="text-gray-400">Medium</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-4 bg-pink-500/80 rounded" />
          <span className="text-gray-400">High</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-4 bg-yellow-500/80 rounded" />
          <span className="text-gray-400">Very High</span>
        </div>
      </div>

      {/* Stationary Distribution */}
      <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
        <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <span>📈</span>
          Stationary Distribution π
        </h4>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {result.stationaryDistribution.map((pi, i) => (
            <div
              key={i}
              className={`
                p-3 rounded-lg border-2 transition-all
                ${selectedNode === i
                  ? 'border-yellow-400 bg-yellow-400/10'
                  : 'border-gray-700 bg-gray-900/50'
                }
              `}
            >
              <div className="text-xs text-gray-400 mb-1">State {i}</div>
              <div className="text-lg font-mono font-bold text-cyan-400">
                {pi.toFixed(4)}
              </div>
              
              {/* Visual bar */}
              <div className="mt-2 h-1 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-500"
                  style={{ width: `${pi * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Eigenvalues */}
      <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
        <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <span>🌊</span>
          Spectral Eigenvalues λᵢ
        </h4>
        
        <div className="space-y-2">
          {result.eigenvalues.slice(0, Math.min(5, result.eigenvalues.length)).map((lambda, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-xs text-gray-400 w-8">λ{i}</span>
              <div className="flex-1 h-6 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-cyan-500"
                  style={{
                    width: `${Math.min(100, (lambda / result.eigenvalues[0]) * 100)}%`
                  }}
                />
              </div>
              <span className="text-xs font-mono text-purple-400 w-24 text-right">
                {lambda.toFixed(6)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
