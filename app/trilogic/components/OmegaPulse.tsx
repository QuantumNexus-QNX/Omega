'use client';

import React, { useEffect, useState } from 'react';
import { useParameters } from '../context/ParameterContext';

export default function OmegaPulse() {
  const { params } = useParameters();
  const [pulseIntensity, setPulseIntensity] = useState(0);

  useEffect(() => {
    // Omega frequency in Hz (canonical: 0.847 Hz)
    const frequency = params.omega;
    const period = 1000 / frequency; // Period in milliseconds

    let animationFrame: number;
    let startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const phase = (elapsed % period) / period; // 0 to 1
      
      // Sine wave for smooth pulsing
      const intensity = Math.sin(phase * 2 * Math.PI) * 0.5 + 0.5; // 0 to 1
      setPulseIntensity(intensity);

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [params.omega]);

  return (
    <>
      {/* Subtle glow effect on framework constants */}
      <div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent pointer-events-none transition-opacity duration-100"
        style={{
          opacity: pulseIntensity * 0.3, // Very subtle
        }}
      />

      {/* Omega indicator in corner */}
      <div className="fixed bottom-4 left-4 z-40 pointer-events-none">
        <div className="flex items-center gap-2 bg-gradient-to-br from-purple-900/50 to-pink-900/50 border border-purple-500/30 rounded-lg px-3 py-2 backdrop-blur-sm">
          <div
            className="w-2 h-2 rounded-full bg-purple-500 transition-all duration-100"
            style={{
              boxShadow: `0 0 ${pulseIntensity * 10}px rgba(168, 85, 247, ${pulseIntensity * 0.8})`,
              transform: `scale(${1 + pulseIntensity * 0.2})`,
            }}
          />
          <span className="text-xs text-purple-300 font-mono">
            Ω = {params.omega.toFixed(3)} Hz
          </span>
        </div>
      </div>

      {/* Ambient pulse overlay (very subtle) */}
      <div
        className="fixed inset-0 pointer-events-none -z-5 transition-opacity duration-100"
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(168, 85, 247, ${pulseIntensity * 0.02}), transparent 70%)`,
        }}
      />
    </>
  );
}
