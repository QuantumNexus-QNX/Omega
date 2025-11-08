'use client';

/**
 * Enhanced Tri-Logic Visualizer Main Page
 * "The Sphere Awakens" - Making mathematics visceral
 * 
 * Features all enhancements:
 * - Multi-layered visible sphere
 * - Projection lines and complex plane
 * - Equilibrium spiral overlay
 * - Collapse animation
 * - Focus view controls
 * - Cross-ratio display
 */

import React, { useState, Suspense, useCallback } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { MobiusParams } from './lib/math';
import ControlPanel from './components/ControlPanel';
import TruthTable from './components/TruthTable';
import EducationalInfo from './components/EducationalInfo';
import CodeExporter from './components/CodeExporter';
import CollapseAnimation from './components/CollapseAnimation';
import SphereControls from './components/SphereControls';

// Dynamically import RiemannSphereEnhanced to avoid SSR issues with Three.js
const RiemannSphereEnhanced = dynamic(() => import('./components/RiemannSphereEnhanced'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-black/20 rounded-lg">
      <div className="text-purple-400 animate-pulse">Loading enhanced 3D visualization...</div>
    </div>
  )
});

export default function TriLogicPageEnhanced() {
  const [transformation, setTransformation] = useState<MobiusParams | null>(null);
  const [showProjectionLines, setShowProjectionLines] = useState(true);
  const [showSpiral, setShowSpiral] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [crossRatio, setCrossRatio] = useState<number>(1.618); // Golden ratio as default
  
  const handleTransform = (params: MobiusParams) => {
    setIsAnimating(true);
    setTransformation(params);
    
    // Stop animation after duration
    setTimeout(() => {
      setIsAnimating(false);
    }, 2000 / animationSpeed);
  };
  
  const handleReset = () => {
    setTransformation(null);
    setIsAnimating(false);
  };
  
  const handleToggleProjectionLines = useCallback(() => {
    setShowProjectionLines(prev => !prev);
  }, []);

  const handleToggleSpiral = useCallback(() => {
    setShowSpiral(prev => !prev);
  }, []);

  const handleToggleAnimation = useCallback(() => {
    setIsAnimating(prev => !prev);
  }, []);

  const handleFocusView = useCallback(() => {
    // This would trigger camera animation in the 3D component
    // For now, just a placeholder
    console.log('Focus view triggered');
  }, []);

  const handleCollapse = useCallback(() => {
    // Trigger collapse animation in 3D sphere
    console.log('Collapse animation triggered');
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0f0f1f] to-[#0a0a0a] text-white">
      {/* Header */}
      <header className="border-b border-purple-500/20 backdrop-blur-sm bg-black/30">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <Link href="/" className="text-sm text-gray-400 hover:text-cyan-400 transition-colors flex items-center gap-2">
              <span>←</span>
              <span>Back to Home</span>
            </Link>
            <div className="flex gap-3 text-sm">
              <Link href="/console" className="text-gray-400 hover:text-purple-400 transition-colors">Console</Link>
              <Link href="/docs" className="text-gray-400 hover:text-pink-400 transition-colors">Docs</Link>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
              Tri-Logic Visualizer
            </h1>
            <p className="text-gray-400 text-sm md:text-base">
              Interactive exploration of the minimal complete logic system {'{0, 1, ∅}'} on the Riemann sphere
            </p>
            <div className="mt-2 inline-block px-3 py-1 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full border border-purple-500/30">
              <span className="text-xs text-purple-300">✨ Enhanced Edition - The Sphere Awakens</span>
            </div>
          </motion.div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Framework Constants */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-lg border border-purple-500/30 bg-black/20 backdrop-blur-sm p-8 mb-8"
        >
          <h3 className="text-xl font-semibold mb-6 text-center text-white">Mathematical Foundation</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Equilibrium Constant */}
            <div className="text-center">
              <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                μ = 0.569
              </div>
              <div className="text-sm text-gray-400 mb-2">Equilibrium Constant</div>
              <div className="text-xs text-gray-500">
                Quadruple validation: Lambert W, Plastic ratio, Free energy, Emergent
              </div>
            </div>

            {/* Resonance Frequency */}
            <div className="text-center">
              <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Ω = 0.847 Hz
              </div>
              <div className="text-sm text-gray-400 mb-2">Resonance Frequency</div>
              <div className="text-xs text-gray-500">
                Neural oscillation from triple derivation
              </div>
            </div>

            {/* Tri-Logic */}
            <div className="text-center">
              <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent">
                {'{0, 1, ∅}'}
              </div>
              <div className="text-sm text-gray-400 mb-2">Tri-Logic Foundation</div>
              <div className="text-xs text-gray-500">
                Minimum for superposition. Binary is collapsed state.
              </div>
            </div>
          </div>
        </motion.section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - 3D Visualization */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* 3D Sphere */}
            <div className="rounded-lg border border-purple-500/30 bg-black/20 backdrop-blur-sm overflow-hidden">
              <div className="h-[500px] md:h-[600px]">
                <Suspense fallback={
                  <div className="w-full h-full flex items-center justify-center bg-black/20">
                    <div className="text-purple-400 animate-pulse">Loading enhanced 3D visualization...</div>
                  </div>
                }>
                  <RiemannSphereEnhanced
                    transformation={transformation}
                    showProjectionLines={showProjectionLines}
                    showSpiral={showSpiral}
                    animating={isAnimating}
                    onFocusView={handleFocusView}
                  />
                </Suspense>
              </div>
            </div>

            {/* Collapse Animation */}
            <div className="rounded-lg border border-purple-500/30 bg-black/20 backdrop-blur-sm p-6">
              <CollapseAnimation onCollapse={handleCollapse} />
            </div>
            
            {/* Truth Tables */}
            <div className="rounded-lg border border-purple-500/30 bg-black/20 backdrop-blur-sm p-6">
              <TruthTable />
            </div>
          </motion.div>
          
          {/* Right Column - Controls and Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            {/* Sphere Controls */}
            <div className="rounded-lg border border-purple-500/30 bg-black/20 backdrop-blur-sm p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Sphere Controls</h3>
              <SphereControls
                showProjectionLines={showProjectionLines}
                showSpiral={showSpiral}
                animating={isAnimating}
                onToggleProjectionLines={handleToggleProjectionLines}
                onToggleSpiral={handleToggleSpiral}
                onToggleAnimation={handleToggleAnimation}
                onFocusView={handleFocusView}
                crossRatio={crossRatio}
              />
            </div>

            {/* Control Panel (Möbius Transformations) */}
            <div className="rounded-lg border border-purple-500/30 bg-black/20 backdrop-blur-sm p-6">
              <ControlPanel
                onTransform={handleTransform}
                onReset={handleReset}
                animationSpeed={animationSpeed}
                onAnimationSpeedChange={setAnimationSpeed}
                showProjectionLines={showProjectionLines}
                onToggleProjectionLines={handleToggleProjectionLines}
              />
            </div>
            
            {/* Educational Info */}
            <div className="rounded-lg border border-purple-500/30 bg-black/20 backdrop-blur-sm p-6">
              <EducationalInfo currentTransformation={transformation} />
            </div>
            
            {/* Code Exporter */}
            <CodeExporter />
          </motion.div>
        </div>
        
        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 p-6 rounded-lg border border-purple-500/20 bg-gradient-to-br from-purple-900/10 to-blue-900/10 backdrop-blur-sm"
        >
          <h2 className="text-xl font-semibold mb-3 text-white">About This Visualization</h2>
          <div className="space-y-2 text-sm text-gray-300">
            <p>
              This interactive tool demonstrates how tri-logic—the minimal complete logic system that allows superposition—maps naturally onto the Riemann sphere. 
              Unlike binary logic which has only true and false, tri-logic includes a third value: undefined (∅).
            </p>
            <p>
              Through stereographic projection and Möbius transformations, we can visualize how undefined states can "rotate" between true and false, 
              demonstrating the fluid nature of quantum-like superposition in logical systems.
            </p>
            <div className="mt-4 p-4 bg-purple-500/10 rounded border border-purple-500/20">
              <p className="font-semibold text-purple-300 mb-2">✨ Enhanced Features:</p>
              <ul className="list-disc list-inside space-y-1 text-xs text-gray-400">
                <li>Multi-layered sphere rendering with Fresnel glow effect</li>
                <li>Stereographic projection lines from north pole to complex plane</li>
                <li>Equilibrium spiral overlay showing μ and Ω dynamics</li>
                <li>Quantum collapse animation (∅ → {'{0,1}'})</li>
                <li>Cross-ratio display showing Möbius invariance</li>
                <li>Interactive tooltips and focus controls</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 text-xs text-gray-500 italic">
            Based on the Integrated Consciousness Framework v2.1 (Addendum E: Tri-Logic and Quantum Semantics)
          </div>
        </motion.div>
      </main>
    </div>
  );
}
