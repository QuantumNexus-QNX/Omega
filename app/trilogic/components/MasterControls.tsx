'use client';

import React from 'react';
import { useParameters, PARAM_RANGES } from '../context/ParameterContext';

export default function MasterControls() {
  const { params, setMu, setOmega, setKappa, resetToCanonical, isCanonical } = useParameters();

  return (
    <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-lg p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
          Master Parameters
        </h3>
        <button
          onClick={resetToCanonical}
          disabled={isCanonical}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            isCanonical
              ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500 shadow-lg hover:shadow-purple-500/50'
          }`}
        >
          Reset to Canonical
        </button>
      </div>

      <div className="space-y-6">
        {/* Mu Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-cyan-300 font-medium flex items-center gap-2">
              <span className="text-2xl">μ</span>
              <span className="text-sm text-gray-400">(Equilibrium)</span>
            </label>
            <span className="text-cyan-400 font-mono text-lg font-bold">
              {params.mu.toFixed(3)}
            </span>
          </div>
          <input
            type="range"
            min={PARAM_RANGES.mu.min}
            max={PARAM_RANGES.mu.max}
            step={PARAM_RANGES.mu.step}
            value={params.mu}
            onChange={(e) => setMu(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-cyan"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>{PARAM_RANGES.mu.min}</span>
            <span className="text-cyan-400">0.569 (canonical)</span>
            <span>{PARAM_RANGES.mu.max}</span>
          </div>
        </div>

        {/* Omega Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-purple-300 font-medium flex items-center gap-2">
              <span className="text-2xl">Ω</span>
              <span className="text-sm text-gray-400">(Resonance)</span>
            </label>
            <span className="text-purple-400 font-mono text-lg font-bold">
              {params.omega.toFixed(3)} Hz
            </span>
          </div>
          <input
            type="range"
            min={PARAM_RANGES.omega.min}
            max={PARAM_RANGES.omega.max}
            step={PARAM_RANGES.omega.step}
            value={params.omega}
            onChange={(e) => setOmega(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-purple"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>{PARAM_RANGES.omega.min}</span>
            <span className="text-purple-400">0.847 (canonical)</span>
            <span>{PARAM_RANGES.omega.max}</span>
          </div>
        </div>

        {/* Kappa Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-pink-300 font-medium flex items-center gap-2">
              <span className="text-2xl">κ</span>
              <span className="text-sm text-gray-400">(Coupling)</span>
            </label>
            <span className="text-pink-400 font-mono text-lg font-bold">
              {params.kappa.toFixed(4)}
            </span>
          </div>
          <input
            type="range"
            min={PARAM_RANGES.kappa.min}
            max={PARAM_RANGES.kappa.max}
            step={PARAM_RANGES.kappa.step}
            value={params.kappa}
            onChange={(e) => setKappa(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-pink"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>{PARAM_RANGES.kappa.min}</span>
            <span className="text-pink-400">0.0207 (canonical)</span>
            <span>{PARAM_RANGES.kappa.max}</span>
          </div>
        </div>

        {/* Computed Beta Display */}
        <div className="mt-4 p-4 bg-gradient-to-r from-amber-900/20 to-yellow-900/20 border border-amber-500/30 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-amber-300 font-medium text-2xl">β</span>
              <span className="text-sm text-gray-400">(Wabi-Sabi, computed)</span>
            </div>
            <span className="text-amber-400 font-mono text-lg font-bold">
              {params.beta.toFixed(3)}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            β = 1 - μ - κ·c (where c = 10.8)
          </p>
        </div>

        {/* Live Update Indicator */}
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>All visualizations update in real-time</span>
        </div>
      </div>

      <style jsx>{`
        .slider-cyan::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #06b6d4, #0891b2);
          cursor: pointer;
          box-shadow: 0 0 10px rgba(6, 182, 212, 0.5);
        }
        .slider-purple::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #a855f7, #9333ea);
          cursor: pointer;
          box-shadow: 0 0 10px rgba(168, 85, 247, 0.5);
        }
        .slider-pink::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ec4899, #db2777);
          cursor: pointer;
          box-shadow: 0 0 10px rgba(236, 72, 153, 0.5);
        }
      `}</style>
    </div>
  );
}
