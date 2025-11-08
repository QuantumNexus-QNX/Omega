'use client';

import React, { useEffect, useRef, useState } from 'react';
import { SpectralScene } from '../lib/spectral-scene';
import { SpectralTripleResult } from '../lib/spectral-triple';

interface SpectralVisualizationProps {
  result: SpectralTripleResult;
  transitionMatrix: number[][];
  onNodeSelect?: (index: number) => void;
  showGeodesic?: { from: number; to: number } | null;
}

export const SpectralVisualization: React.FC<SpectralVisualizationProps> = ({
  result,
  transitionMatrix,
  onNodeSelect,
  showGeodesic
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<SpectralScene | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize scene
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;

    // Set canvas size
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Create scene
    try {
      sceneRef.current = new SpectralScene({
        canvas,
        distances: result.distances,
        transitionMatrix,
        stationaryDistribution: result.stationaryDistribution
      });

      setIsLoading(false);

      // Listen for node selection
      canvas.addEventListener('nodeSelected', ((event: CustomEvent) => {
        if (onNodeSelect) {
          onNodeSelect(event.detail.index);
        }
      }) as EventListener);
    } catch (error) {
      console.error('Failed to initialize spectral scene:', error);
      setIsLoading(false);
    }

    // Cleanup
    return () => {
      if (sceneRef.current) {
        sceneRef.current.dispose();
        sceneRef.current = null;
      }
    };
  }, [result, transitionMatrix, onNodeSelect]);

  // Handle geodesic display
  useEffect(() => {
    if (sceneRef.current && showGeodesic) {
      sceneRef.current.showGeodesic(showGeodesic.from, showGeodesic.to);
    }
  }, [showGeodesic]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (sceneRef.current && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        sceneRef.current.resize(rect.width, rect.height);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full bg-[#0a0a0f] rounded-lg overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full" />
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0f]/80">
          <div className="text-center">
            <div className="inline-block w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mb-4" />
            <p className="text-cyan-400 font-mono">Initializing spectral scene...</p>
          </div>
        </div>
      )}

      {/* Instructions overlay */}
      <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-lg text-xs text-gray-300 font-mono">
        <p className="mb-1">🖱️ Drag to rotate • Scroll to zoom</p>
        <p>👆 Click nodes to select • View distances below</p>
      </div>

      {/* Metadata overlay */}
      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-4 py-3 rounded-lg text-xs font-mono space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-gray-400">Dimension:</span>
          <span className="text-cyan-400 font-bold">{result.metadata.dimension}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400">ε:</span>
          <span className="text-purple-400 font-bold">{result.metadata.epsilon.toExponential(1)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400">Max Distance:</span>
          <span className="text-pink-400 font-bold">{result.metadata.maxDistance.toFixed(4)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400">Spectral Gap:</span>
          <span className="text-yellow-400 font-bold">{result.metadata.spectralGap.toFixed(4)}</span>
        </div>
      </div>
    </div>
  );
};
