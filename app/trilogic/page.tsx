'use client';

/**
 * Enhanced Tri-Logic Visualizer - Interactive Edition
 * Features:
 * - Master parameter controls (μ, Ω, κ)
 * - Cross-visualization links
 * - Progressive disclosure (Show Math, Beginner Mode)
 * - Performance optimizations (lazy loading)
 * - Polish (parallax, Ω pulse, smooth transitions)
 */

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { MobiusParams } from './lib/math';

// Context Providers
import { ParameterProvider } from './context/ParameterContext';
import { VisualizationProvider } from './context/VisualizationContext';
import { DisclosureProvider } from './context/DisclosureContext';
import { ThreeProvider } from './context/ThreeContext';
import { CollaborationProvider, useCollaboration } from './context/CollaborationContext';

// Enhancement Components
import MasterControls from './components/MasterControls';
import DependencyArrows from './components/DependencyArrows';
import DisclosureControls from './components/DisclosureControls';
import ParallaxBackground from './components/ParallaxBackground';
import OmegaPulse from './components/OmegaPulse';
import PageTransitions, { TabTransition } from './components/PageTransitions';
import LazyVisualization from './components/LazyVisualization';
import { AudioControls } from '../components/AudioControls';
import { SessionManager } from '../components/SessionManager';
import { UserPresence } from '../components/UserPresence';
import { ConflictResolution } from '../components/ConflictResolution';

// Existing Components
import ControlPanel from './components/ControlPanel';
import TruthTable from './components/TruthTable';
import EducationalInfo from './components/EducationalInfo';
import CodeExporter from './components/CodeExporter';
import CollapseAnimation from './components/CollapseAnimation';
import SphereControls from './components/SphereControls';
import UndefinedPropagation from './components/UndefinedPropagation';
import WabiSabiSpace from './components/WabiSabiSpace';
import SpectralDistance from './components/SpectralDistance';
import TensorTriad from './components/TensorTriad';
import CollapseCycles from './components/CollapseCycles';
import SheafCoherence from './components/SheafCoherence';

// Dynamically import RiemannSphereEnhanced
const RiemannSphereEnhanced = dynamic(() => import('./components/RiemannSphereEnhanced'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-black/20 rounded-lg">
      <div className="text-purple-400 animate-pulse">Loading enhanced 3D visualization...</div>
    </div>
  )
});

function TriLogicContent() {
  const [activeTab, setActiveTab] = useState<string>('sphere');
  const [transformation, setTransformation] = useState<MobiusParams | null>(null);
  const [showProjectionLines, setShowProjectionLines] = useState(true);
  const [showSpiral, setShowSpiral] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Collaboration hooks
  const collaboration = useCollaboration();

  const handleTransformationChange = useCallback((params: MobiusParams | null) => {
    setTransformation(params);
  }, []);

  const handleRotate = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 2000);
  }, []);

  const handleFocusView = useCallback(() => {
    console.log('Focus view triggered');
  }, []);

  const handleCollapse = useCallback(() => {
    console.log('Collapse animation triggered');
  }, []);

  const tabs = [
    { id: 'sphere', label: '🌐 Riemann Sphere', icon: '🌐' },
    { id: 'propagation', label: '🦠 Undefined Propagation', icon: '🦠' },
    { id: 'wabisabi', label: '🌸 Wabi-Sabi Space', icon: '🌸' },
    { id: 'spectral', label: '📏 Spectral Distance', icon: '📏' },
    { id: 'triad', label: '⚛️ Tensor Triad', icon: '⚛️' },
    { id: 'collapse', label: '🔄 Collapse Cycles', icon: '🔄' },
    { id: 'sheaf', label: '🔗 Sheaf Coherence', icon: '🔗' },
  ];

  return (
    <>
      <ParallaxBackground />
      <OmegaPulse />
      <DependencyArrows />

      <div className="min-h-screen relative">
        {/* Header */}
        <header className="border-b border-purple-500/20 backdrop-blur-sm bg-black/30 sticky top-0 z-40">
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
            <PageTransitions>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
                Tri-Logic Visualizer
              </h1>
              <p className="text-gray-400 text-sm md:text-base">
                Interactive exploration of the minimal complete logic system {'{0, 1, ∅}'} on the Riemann sphere
              </p>
              <div className="mt-4 flex items-center gap-4 flex-wrap">
                <div className="inline-block px-3 py-1 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full border border-purple-500/30">
                  <span className="text-xs text-purple-300">✨ Enhanced Interactive Edition</span>
                </div>
                <AudioControls />
                <DisclosureControls />
              </div>
              
              {/* Collaboration Controls */}
              <div className="mt-4 flex items-center justify-between gap-4 flex-wrap">
                <SessionManager
                  sessionId={collaboration.sessionId}
                  onCreateSession={collaboration.createSession}
                  onJoinSession={collaboration.joinSession}
                  onLeaveSession={collaboration.leaveSession}
                />
                {collaboration.connected && (
                  <UserPresence users={collaboration.users} />
                )}
              </div>
            </PageTransitions>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {/* Master Parameter Controls */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <MasterControls />
          </motion.section>

          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-gray-800">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50 scale-105'
                      : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Tab Content with Lazy Loading */}
          <div className="relative">
            <TabTransition isActive={activeTab === 'sphere'}>
              <LazyVisualization>
                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="bg-black/40 rounded-lg p-6 border border-purple-500/30">
                    <RiemannSphereEnhanced
                      transformation={transformation}
                      showProjectionLines={showProjectionLines}
                      showSpiral={showSpiral}
                      animating={isAnimating}
                    />
                  </div>
                  <div className="space-y-6">
                    <SphereControls
                      showProjectionLines={showProjectionLines}
                      showSpiral={showSpiral}
                      animating={isAnimating}
                      onToggleProjectionLines={() => setShowProjectionLines(!showProjectionLines)}
                      onToggleSpiral={() => setShowSpiral(!showSpiral)}
                      onToggleAnimation={handleRotate}
                      onFocusView={handleFocusView}
                    />
                    <CollapseAnimation onCollapse={handleCollapse} />
                    <ControlPanel
                      onTransform={(params) => setTransformation(params)}
                      onReset={() => setTransformation(null)}
                      animationSpeed={animationSpeed}
                      onAnimationSpeedChange={setAnimationSpeed}
                      showProjectionLines={showProjectionLines}
                      onToggleProjectionLines={() => setShowProjectionLines(!showProjectionLines)}
                    />
                  </div>
                </div>
              </LazyVisualization>
            </TabTransition>

            <TabTransition isActive={activeTab === 'propagation'}>
              <LazyVisualization>
                <UndefinedPropagation />
              </LazyVisualization>
            </TabTransition>

            <TabTransition isActive={activeTab === 'wabisabi'}>
              <LazyVisualization>
                <WabiSabiSpace />
              </LazyVisualization>
            </TabTransition>

            <TabTransition isActive={activeTab === 'spectral'}>
              <LazyVisualization>
                <SpectralDistance />
              </LazyVisualization>
            </TabTransition>

            <TabTransition isActive={activeTab === 'triad'}>
              <LazyVisualization>
                <TensorTriad />
              </LazyVisualization>
            </TabTransition>

            <TabTransition isActive={activeTab === 'collapse'}>
              <LazyVisualization>
                <CollapseCycles />
              </LazyVisualization>
            </TabTransition>

            <TabTransition isActive={activeTab === 'sheaf'}>
              <LazyVisualization>
                <SheafCoherence />
              </LazyVisualization>
            </TabTransition>
          </div>

          {/* Truth Tables and Educational Content */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 space-y-8"
          >
            <TruthTable />
            <EducationalInfo currentTransformation={transformation} />
            <CodeExporter />
          </motion.section>
        </main>

        {/* Footer */}
        <footer className="border-t border-purple-500/20 mt-16 py-8 bg-black/30">
          <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
            <p>Tri-Logic Visualizer - Enhanced Interactive Edition</p>
            <p className="mt-2">Making consciousness mathematics visceral</p>
          </div>
        </footer>
        
        {/* Conflict Resolution Modal */}
        <ConflictResolution
          conflict={collaboration.currentConflict}
          onResolve={collaboration.resolveConflict}
          onDismiss={collaboration.dismissConflict}
        />
      </div>
    </>
  );
}

export default function TriLogicPageEnhanced() {
  return (
    <ParameterProvider>
      <CollaborationProvider>
        <VisualizationProvider>
          <DisclosureProvider>
            <ThreeProvider>
              <TriLogicContent />
            </ThreeProvider>
          </DisclosureProvider>
        </VisualizationProvider>
      </CollaborationProvider>
    </ParameterProvider>
  );
}
