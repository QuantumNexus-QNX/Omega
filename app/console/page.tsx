'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { JO_CONSTANTS } from '../lib/constants';

export default function ConsolePage() {
  const [mu, setMu] = useState(JO_CONSTANTS.MU);
  const [omega, setOmega] = useState(JO_CONSTANTS.OMEGA);
  const [kappa, setKappa] = useState(JO_CONSTANTS.KAPPA);
  const [beta, setBeta] = useState(JO_CONSTANTS.BETA);

  const validation = useMemo(() => validateConstants(mu, omega, kappa, beta), [mu, omega, kappa, beta]);

  const resetDefaults = () => {
    setMu(JO_CONSTANTS.MU);
    setOmega(JO_CONSTANTS.OMEGA);
    setKappa(JO_CONSTANTS.KAPPA);
    setBeta(JO_CONSTANTS.BETA);
  };

  const systemDiagnostics = useMemo(() => ({
    constants: { mu, omega, kappa, beta },
    validation: {
      valid: validation.valid,
      errors: validation.errors,
    },
  }), [mu, omega, kappa, beta, validation]);

  return (
    <div className="min-h-screen bg-black text-gray-100">
      {/* Header */}
      <header className="border-b border-cyan-500/20 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
            Trivector.ai
          </Link>
          <Link href="/consciousness" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
            ← Back to Framework
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Parameter Console & System Diagnostics
          </h1>
          <p className="text-gray-400 max-w-3xl mx-auto">
            The console provides centralized control over the JO framework constants (μ, Ω, κ, β) that govern consciousness modeling computations across all modules. Changes here are immediately reflected in spectral, tri-logic, and tensor operations.
          </p>
        </motion.div>

        {/* JO Framework Constants */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-gray-900/50 border border-cyan-500/20 rounded-lg p-8 mb-8"
        >
          <h2 className="text-2xl font-bold mb-6 text-cyan-400">JO Framework Constants</h2>
          <p className="text-sm text-gray-400 mb-6">Adjust empirical parameters for consciousness modeling</p>

          <div className="space-y-8">
            {/* μ - Equilibrium */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-lg font-semibold text-purple-400">μ Equilibrium Constant</label>
                <span className="text-2xl font-mono text-cyan-400">{mu.toFixed(4)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.001"
                value={mu}
                onChange={(e) => setMu(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <p className="text-xs text-gray-500 mt-2">Baseline equilibrium state in consciousness modeling</p>
            </div>

            {/* Ω - Resonance */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-lg font-semibold text-purple-400">Ω Resonance Frequency</label>
                <span className="text-2xl font-mono text-cyan-400">{omega.toFixed(4)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="2"
                step="0.001"
                value={omega}
                onChange={(e) => setOmega(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <p className="text-xs text-gray-500 mt-2">Primary resonance parameter (Hz or unitless)</p>
            </div>

            {/* κ - Collapse */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-lg font-semibold text-purple-400">κ Collapse/Threshold Constant</label>
                <span className="text-2xl font-mono text-cyan-400">{kappa.toFixed(4)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="0.1"
                step="0.0001"
                value={kappa}
                onChange={(e) => setKappa(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <p className="text-xs text-gray-500 mt-2">Governs quantum collapse and threshold behavior</p>
            </div>

            {/* β - Scaling */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-lg font-semibold text-purple-400">β Secondary Scaling Factor</label>
                <span className="text-2xl font-mono text-cyan-400">{beta.toFixed(4)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.001"
                value={beta}
                onChange={(e) => setBeta(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <p className="text-xs text-gray-500 mt-2">Modulates secondary effects and scaling relationships</p>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-cyan-500/20 pt-6">
            <button
              onClick={resetDefaults}
              className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-cyan-400 rounded-lg transition-colors border border-cyan-500/30"
            >
              Reset to Defaults
            </button>
            <p className="text-xs text-gray-500">
              Defaults: μ={JO_CONSTANTS.MU}, Ω={JO_CONSTANTS.OMEGA}, κ={JO_CONSTANTS.KAPPA}, β={JO_CONSTANTS.BETA}
            </p>
          </div>
        </motion.div>

        {/* System Diagnostics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {/* Validation Status */}
          <div className="bg-gray-900/50 border border-cyan-500/20 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-cyan-400">Validation Status</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${validation.valid ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
                <span className="text-sm">{validation.valid ? 'All parameters valid' : 'Validation errors detected'}</span>
              </div>
              {validation.errors.length > 0 && (
                <div className="mt-4 space-y-2">
                  {validation.errors.map((error, i) => (
                    <div key={i} className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded px-3 py-2">
                      {error}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* System State */}
          <div className="bg-gray-900/50 border border-cyan-500/20 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-cyan-400">System State (JSON)</h3>
            <pre className="text-xs text-gray-400 bg-black/50 p-4 rounded overflow-auto max-h-64">
              {JSON.stringify(systemDiagnostics, null, 2)}
            </pre>
          </div>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/spectral" className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white rounded-lg transition-all">
              Spectral Triple →
            </Link>
            <Link href="/trilogic" className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white rounded-lg transition-all">
              Tri-Logic →
            </Link>
            <Link href="/consciousness" className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-cyan-400 rounded-lg transition-colors border border-cyan-500/30">
              Framework Hub →
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="border-t border-cyan-500/20 bg-black/50 py-8 text-center text-gray-500 mt-16">
        <div className="container mx-auto px-4">
          trivector.ai — Mathematical Consciousness Modeling Framework
        </div>
      </footer>
    </div>
  );
}

function validateConstants(
  mu: number,
  omega: number,
  kappa: number,
  beta: number
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (mu < 0 || mu > 1) errors.push('μ must be in range [0, 1]');
  if (omega < 0 || omega > 2) errors.push('Ω must be in range [0, 2]');
  if (kappa < 0 || kappa > 0.1) errors.push('κ must be in range [0, 0.1]');
  if (beta < 0 || beta > 1) errors.push('β must be in range [0, 1]');

  return {
    valid: errors.length === 0,
    errors,
  };
}
