'use client';

import React from 'react';
import Link from 'next/link';

export default function ConsciousnessPage() {
  return (
    <div className="min-h-screen bg-black text-gray-100">
      {/* Header */}
      <header className="border-b border-cyan-500/20 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
            Trivector.ai
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Mathematical Consciousness Modeling
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 max-w-4xl mx-auto mb-12">
          A unified mathematical and computational framework integrating spectral geometry, 
          noncommutative geometry, higher category theory, and tri-valued logic.
        </p>
      </section>

      {/* JO Framework Constants */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
          JO Framework Constants
        </h2>
        <p className="text-center text-gray-400 mb-8">Empirical constants for consciousness modeling</p>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[
            { symbol: 'μ', name: 'mu', value: '0.5690', label: 'Equilibrium', desc: 'Baseline equilibrium state' },
            { symbol: 'Ω', name: 'omega', value: '0.8470', label: 'Resonance', desc: 'Primary resonance parameter' },
            { symbol: 'κ', name: 'kappa', value: '0.0323', label: 'Collapse', desc: 'Quantum collapse threshold' },
            { symbol: 'β', name: 'beta', value: '0.2070', label: 'Scaling', desc: 'Secondary scaling factor' },
          ].map((constant) => (
            <div key={constant.name} className="bg-gray-900/50 border border-cyan-500/20 rounded-lg p-6 hover:border-cyan-500/40 transition-colors">
              <div className="text-4xl font-bold text-cyan-400 mb-2">{constant.value}</div>
              <div className="text-2xl text-purple-400 mb-1">{constant.symbol} ({constant.name})</div>
              <div className="text-sm text-gray-400 mb-2">{constant.label}</div>
              <div className="text-xs text-gray-500">{constant.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Modules */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-12 text-center">Framework Modules</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Spectral Triple */}
          <Link href="/spectral" className="group">
            <div className="bg-gray-900/50 border border-cyan-500/20 rounded-lg p-8 hover:border-cyan-500/60 hover:bg-gray-900/70 transition-all">
              <div className="text-4xl mb-4">🌌</div>
              <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Spectral Triple Engine
              </h3>
              <p className="text-gray-400 mb-4">
                Pure TypeScript implementation of finite-state spectral triples with Connes distance calculations.
              </p>
              <ul className="text-sm text-gray-500 space-y-2 mb-6">
                <li>• Markov chain transition matrices</li>
                <li>• Stationary distribution computation</li>
                <li>• Connes distance approximation</li>
                <li>• 2D MDS embedding visualization</li>
              </ul>
              <div className="text-cyan-400 group-hover:text-cyan-300 transition-colors">
                Open Module →
              </div>
            </div>
          </Link>

          {/* Spectral WASM */}
          <Link href="/spectral-wasm" className="group">
            <div className="bg-gray-900/50 border border-purple-500/20 rounded-lg p-8 hover:border-purple-500/60 hover:bg-gray-900/70 transition-all">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                Spectral WASM Accelerator
              </h3>
              <p className="text-gray-400 mb-4">
                High-performance Rust/WASM accelerated spectral computations with fallback to TypeScript.
              </p>
              <ul className="text-sm text-gray-500 space-y-2 mb-6">
                <li>• Rust/WASM integration</li>
                <li>• Automatic fallback handling</li>
                <li>• Same UI as TypeScript version</li>
                <li>• Performance comparison</li>
              </ul>
              <div className="text-purple-400 group-hover:text-purple-300 transition-colors">
                Open Module →
              </div>
            </div>
          </Link>

          {/* Tri-Logic */}
          <Link href="/trilogic" className="group">
            <div className="bg-gray-900/50 border border-pink-500/20 rounded-lg p-8 hover:border-pink-500/60 hover:bg-gray-900/70 transition-all">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-pink-400 to-red-500 bg-clip-text text-transparent">
                Tri-Valued Logic
              </h3>
              <p className="text-gray-400 mb-4">
                Kleene K3 logic system mapped to the Riemann sphere via stereographic projection.
              </p>
              <ul className="text-sm text-gray-500 space-y-2 mb-6">
                <li>• K3 truth tables (AND, OR, NOT)</li>
                <li>• Riemann sphere visualization</li>
                <li>• Möbius transformations</li>
                <li>• Ω-modulated visuals</li>
              </ul>
              <div className="text-pink-400 group-hover:text-pink-300 transition-colors">
                Open Module →
              </div>
            </div>
          </Link>

          {/* Parameter Console */}
          <Link href="/console" className="group">
            <div className="bg-gray-900/50 border border-green-500/20 rounded-lg p-8 hover:border-green-500/60 hover:bg-gray-900/70 transition-all">
              <div className="text-4xl mb-4">⚙️</div>
              <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-green-400 to-teal-500 bg-clip-text text-transparent">
                Parameter Console
              </h3>
              <p className="text-gray-400 mb-4">
                Unified console for adjusting JO framework constants and viewing system diagnostics.
              </p>
              <ul className="text-sm text-gray-500 space-y-2 mb-6">
                <li>• Interactive parameter sliders</li>
                <li>• Real-time constant updates</li>
                <li>• System diagnostics panel</li>
                <li>• Cross-module synchronization</li>
              </ul>
              <div className="text-green-400 group-hover:text-green-300 transition-colors">
                Open Module →
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Framework Components */}
      <section className="container mx-auto px-4 py-16 bg-gray-900/30">
        <h2 className="text-3xl font-bold mb-12 text-center">Framework Components</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-cyan-400">Spectral Geometry</h3>
            <ul className="text-sm text-gray-400 space-y-2">
              <li>• Finite spectral triples (A, H, D)</li>
              <li>• Markov chain generators</li>
              <li>• Connes distance metrics</li>
              <li>• Eigenvalue decomposition</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-purple-400">ENCHC Framework</h3>
            <ul className="text-sm text-gray-400 space-y-2">
              <li>• Higher categories</li>
              <li>• Cohesive topoi</li>
              <li>• Noncommutative objects</li>
              <li>• Representation categories</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-pink-400">JO∞∞ Tensor Calculus</h3>
            <ul className="text-sm text-gray-400 space-y-2">
              <li>• Parallax operations</li>
              <li>• Collapse dynamics</li>
              <li>• Resonance effects</li>
              <li>• Tensor registry</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-cyan-500/20 bg-black/50 py-8 text-center text-gray-500">
        <div className="container mx-auto px-4">
          trivector.ai — Mathematical Consciousness Modeling Framework
        </div>
      </footer>
    </div>
  );
}
