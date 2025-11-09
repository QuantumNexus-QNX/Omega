'use client';

import React, { useState, useEffect } from 'react';
import { SpectralVisualization } from './components/SpectralVisualization';
import { SpectralControls } from './components/SpectralControls';
import { DistanceMatrix } from './components/DistanceMatrix';
import { AudioControls } from '../components/AudioControls';
import { computeSpectralTriple, PRESET_MODELS, SpectralTripleResult } from './lib/spectral-triple';
import { getSoundEngine } from '../lib/audio/sound-engine';

export default function SpectralPage() {
  const [result, setResult] = useState<SpectralTripleResult | null>(null);
  const [transitionMatrix, setTransitionMatrix] = useState<number[][]>(PRESET_MODELS.ADDENDUM_B.matrix);
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const [geodesicPair, setGeodesicPair] = useState<{ from: number; to: number } | null>(null);
  const [isComputing, setIsComputing] = useState(false);
  const [showMath, setShowMath] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState('ADDENDUM_B');

  // Compute spectral triple on mount and when model changes
  useEffect(() => {
    computeModel(transitionMatrix, PRESET_MODELS.ADDENDUM_B.epsilon);
  }, []);

  const computeModel = async (matrix: number[][], epsilon: number, presetKey?: string) => {
    setIsComputing(true);
    
    // Update selected preset if provided
    if (presetKey) {
      setSelectedPreset(presetKey);
    }
    
    // Simulate async computation (in production, this could be WASM)
    await new Promise(resolve => setTimeout(resolve, 100));
    
    try {
      const computed = computeSpectralTriple(matrix, epsilon);
      setResult(computed);
      setTransitionMatrix(matrix);
      setSelectedNode(null);
      setGeodesicPair(null);
    } catch (error) {
      console.error('Failed to compute spectral triple:', error);
    } finally {
      setIsComputing(false);
    }
  };

  const handleNodeSelect = (index: number) => {
    setSelectedNode(index);
    setGeodesicPair(null);
    
    // Play sound for node selection
    const soundEngine = getSoundEngine();
    if (result) {
      soundEngine.playStateTransition(selectedNode ?? 0, index, result.metadata.dimension);
    }
  };

  const handleCellClick = (i: number, j: number) => {
    if (i !== j) {
      setGeodesicPair({ from: i, to: j });
      setSelectedNode(null);
      
      // Play sound for distance
      const soundEngine = getSoundEngine();
      if (result) {
        const distance = result.distances[i][j];
        soundEngine.playConnesDistance(distance, result.metadata.maxDistance);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a0a2e] to-[#0a0a0f]">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/30 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <a
                href="/"
                className="text-gray-400 hover:text-white transition-colors"
              >
                ← Back
              </a>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Spectral Triple Geometry
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <AudioControls />
              
              <button
                onClick={() => setShowMath(!showMath)}
                className="px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/50 rounded-lg text-purple-300 text-sm transition-colors"
              >
                {showMath ? '📖 Hide Math' : '🔬 Show Math'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Introduction */}
        <section className="mb-8">
          <div className="bg-gradient-to-r from-purple-500/10 via-cyan-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="text-3xl">🌌</span>
              Visualizing Consciousness Geometry
            </h2>
            
            <p className="text-gray-300 leading-relaxed mb-4">
              A <span className="text-cyan-400 font-semibold">spectral triple</span> (𝒜, ℋ, 𝒟) 
              encodes the intrinsic geometry of a finite state space. For Markov chains modeling 
              consciousness dynamics, the <span className="text-purple-400 font-semibold">Dirac operator 𝒟</span> measures 
              how distinguishable different mental states are via the <span className="text-pink-400 font-semibold">Connes distance</span>.
            </p>

            <p className="text-gray-300 leading-relaxed">
              This interactive visualizer computes spectral triples from transition matrices, 
              revealing the geometric structure underlying state transitions. States that are 
              "far apart" in Connes distance require many observations to distinguish reliably.
            </p>
          </div>
        </section>

        {/* Mathematical Details (collapsible) */}
        {showMath && (
          <section className="mb-8">
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6 space-y-4">
              <h3 className="text-xl font-bold text-white mb-4">Mathematical Framework</h3>

              <div>
                <h4 className="text-lg font-semibold text-cyan-400 mb-2">1. Spectral Triple Construction</h4>
                <p className="text-gray-300 text-sm leading-relaxed mb-2">
                  For a finite Markov chain with transition matrix <strong>P</strong>, we construct:
                </p>
                <ul className="list-disc list-inside text-gray-300 text-sm space-y-1 ml-4">
                  <li>Algebra: 𝒜 = ℂⁿ (diagonal matrices)</li>
                  <li>Hilbert space: ℋ = ℓ²(π) with inner product weighted by stationary distribution π</li>
                  <li>Dirac operator: 𝒟 derived from symmetrized generator</li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-purple-400 mb-2">2. Generator Symmetrization</h4>
                <p className="text-gray-300 text-sm leading-relaxed mb-2">
                  The generator <strong>L = P - I</strong> is symmetrized using π:
                </p>
                <div className="bg-black/50 p-3 rounded font-mono text-sm text-cyan-300">
                  L<sup>sym</sup> = ½(Π<sup>½</sup> L Π<sup>-½</sup> + Π<sup>-½</sup> L<sup>T</sup> Π<sup>½</sup>)
                </div>
                <p className="text-gray-400 text-xs mt-2">
                  where Π = diag(π₀, π₁, ..., πₙ₋₁)
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-pink-400 mb-2">3. Dirac Operator</h4>
                <p className="text-gray-300 text-sm leading-relaxed mb-2">
                  The Dirac operator is built from the eigendecomposition of -L<sup>sym</sup>:
                </p>
                <div className="bg-black/50 p-3 rounded font-mono text-sm text-cyan-300">
                  𝒟 = U diag(1/(ε + λᵢ)) U<sup>T</sup>
                </div>
                <p className="text-gray-400 text-xs mt-2">
                  where λᵢ are eigenvalues and ε is a regularization parameter
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-yellow-400 mb-2">4. Connes Distance</h4>
                <p className="text-gray-300 text-sm leading-relaxed mb-2">
                  The distance between states ρᵢ and ρⱼ is:
                </p>
                <div className="bg-black/50 p-3 rounded font-mono text-sm text-cyan-300">
                  d(ρᵢ, ρⱼ) = sup<sub>‖[𝒟,a]‖ ≤ 1</sub> |fᵢ - fⱼ|
                </div>
                <p className="text-gray-400 text-xs mt-2">
                  For diagonal observables, this simplifies to a quadratic form involving |𝒟|
                </p>
              </div>

              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 mt-4">
                <p className="text-sm text-gray-300">
                  <strong className="text-purple-400">Reference:</strong> See Addendum B of the 
                  consciousness framework for complete derivations and proofs.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Loading State */}
        {isComputing && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mb-4" />
              <p className="text-cyan-400 font-mono text-lg">Computing spectral triple...</p>
              <p className="text-gray-500 text-sm mt-2">Building Dirac operator and computing distances</p>
            </div>
          </div>
        )}

        {/* Main Visualization Grid */}
        {!isComputing && result && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Controls */}
            <div className="lg:col-span-1">
              <SpectralControls
                onModelChange={computeModel}
                currentDimension={result.metadata.dimension}
                selectedPreset={selectedPreset}
              />
            </div>

            {/* Right Column: Visualization + Matrix */}
            <div className="lg:col-span-2 space-y-6">
              {/* 3D Visualization */}
              <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="text-2xl">🎨</span>
                  3D State Space
                </h3>
                
                <div className="h-[500px]">
                  <SpectralVisualization
                    result={result}
                    transitionMatrix={transitionMatrix}
                    onNodeSelect={handleNodeSelect}
                    showGeodesic={geodesicPair}
                  />
                </div>

                {geodesicPair && (
                  <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <p className="text-sm text-yellow-300">
                      <strong>Geodesic shown:</strong> State {geodesicPair.from} → State {geodesicPair.to}
                      <br />
                      <strong>Connes distance:</strong> {result.distances[geodesicPair.from][geodesicPair.to].toFixed(6)}
                    </p>
                  </div>
                )}
              </div>

              {/* Distance Matrix */}
              <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                <DistanceMatrix
                  result={result}
                  selectedNode={selectedNode}
                  onCellClick={handleCellClick}
                />
              </div>
            </div>
          </div>
        )}

        {/* Footer Info */}
        <section className="mt-12 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
              <h4 className="text-cyan-400 font-semibold mb-2 flex items-center gap-2">
                <span>🔍</span>
                Interpretation
              </h4>
              <p className="text-sm text-gray-300">
                Large Connes distances indicate states that require many observations to distinguish. 
                This captures the "perceptual distance" between mental states.
              </p>
            </div>

            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
              <h4 className="text-purple-400 font-semibold mb-2 flex items-center gap-2">
                <span>⚡</span>
                Spectral Gap
              </h4>
              <p className="text-sm text-gray-300">
                The spectral gap (λ₀ - λ₁) measures mixing time. Larger gaps mean faster convergence 
                to equilibrium.
              </p>
            </div>

            <div className="bg-pink-500/10 border border-pink-500/30 rounded-lg p-4">
              <h4 className="text-pink-400 font-semibold mb-2 flex items-center gap-2">
                <span>🎯</span>
                Applications
              </h4>
              <p className="text-sm text-gray-300">
                Spectral triples provide a rigorous geometric framework for analyzing consciousness 
                models, attention dynamics, and cognitive state spaces.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Parallax Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
    </div>
  );
}
