'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const MU = 0.569; // Equilibrium constant = learning rate!

type CyclePhase = 'prediction' | 'diffusion' | 'measurement' | 'update' | 'idle';

interface CycleState {
  phase: CyclePhase;
  predictionPos: THREE.Vector3;
  measurementPos: THREE.Vector3;
  posteriorPos: THREE.Vector3;
  diffusionScale: number;
  cycleCount: number;
}

// Diffusing Prediction Cloud
function PredictionCloud({ 
  position, 
  scale, 
  phase 
}: { 
  position: THREE.Vector3; 
  scale: number; 
  phase: CyclePhase;
}) {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate particles
  const particles = useMemo(() => {
    const positions = [];
    const particleCount = 300;
    
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 0.15 * Math.random();
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      positions.push(x, y, z);
    }
    
    return new Float32Array(positions);
  }, []);

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      // Pulsing animation
      const pulse = 1 + 0.1 * Math.sin(clock.getElapsedTime() * 3);
      pointsRef.current.scale.setScalar(scale * pulse);
    }
  });

  return (
    <points ref={pointsRef} position={position}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color={phase === 'diffusion' ? "#ffaa44" : "#88ccff"}
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

// Measurement Marker
function MeasurementMarker({ position, visible }: { position: THREE.Vector3; visible: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current && visible) {
      const scale = 1 + 0.2 * Math.sin(clock.getElapsedTime() * 5);
      meshRef.current.scale.setScalar(scale);
    }
  });

  if (!visible) return null;

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.08, 16, 16]} />
      <meshPhongMaterial
        color="#ff4444"
        emissive="#ff4444"
        emissiveIntensity={1.0}
      />
    </mesh>
  );
}

// Bayesian Update Arrow
function UpdateArrow({ 
  from, 
  to, 
  visible 
}: { 
  from: THREE.Vector3; 
  to: THREE.Vector3; 
  visible: boolean;
}) {
  if (!visible) return null;

  const direction = new THREE.Vector3().subVectors(to, from);
  const length = direction.length();
  const midpoint = new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5);

  return (
    <group>
      <arrowHelper args={[direction.normalize(), from, length, 0x44ff44, 0.2, 0.1]} />
    </group>
  );
}

// Main Scene
function CollapseCycleScene({ cycleState }: { cycleState: CycleState }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      
      {/* Base Riemann Sphere */}
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshPhongMaterial
          color="#1a1a2e"
          transparent
          opacity={0.15}
          wireframe
        />
      </mesh>

      {/* Truth value markers */}
      <mesh position={[0, 1, 0]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshPhongMaterial color="#ffaa44" emissive="#ffaa44" emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[-0.5, -0.5, 0]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshPhongMaterial color="#ff4444" emissive="#ff4444" emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[0.5, -0.5, 0]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshPhongMaterial color="#44ff44" emissive="#44ff44" emissiveIntensity={0.4} />
      </mesh>

      {/* Prediction Cloud */}
      <PredictionCloud
        position={cycleState.predictionPos}
        scale={cycleState.diffusionScale}
        phase={cycleState.phase}
      />

      {/* Measurement Marker */}
      <MeasurementMarker
        position={cycleState.measurementPos}
        visible={cycleState.phase === 'measurement' || cycleState.phase === 'update'}
      />

      {/* Update Arrow */}
      <UpdateArrow
        from={cycleState.predictionPos}
        to={cycleState.posteriorPos}
        visible={cycleState.phase === 'update'}
      />

      <OrbitControls enableDamping dampingFactor={0.05} />
    </>
  );
}

// Main Component
export default function CollapseCycles() {
  const [cycleState, setCycleState] = useState<CycleState>({
    phase: 'idle',
    predictionPos: new THREE.Vector3(0, 1, 0), // Start at north pole (∅)
    measurementPos: new THREE.Vector3(0, 0, 0),
    posteriorPos: new THREE.Vector3(0, 0, 0),
    diffusionScale: 1.0,
    cycleCount: 0
  });

  const [isRunning, setIsRunning] = useState(false);
  const [cycleSpeed, setCycleSpeed] = useState(1.0);

  const runCycle = async () => {
    setIsRunning(true);

    // Phase 1: Prediction (start at ∅)
    setCycleState(prev => ({
      ...prev,
      phase: 'prediction',
      predictionPos: new THREE.Vector3(0, 1, 0),
      diffusionScale: 1.0
    }));
    await sleep(500 / cycleSpeed);

    // Phase 2: Diffusion (uncertainty grows)
    setCycleState(prev => ({ ...prev, phase: 'diffusion' }));
    for (let i = 0; i < 10; i++) {
      setCycleState(prev => ({
        ...prev,
        diffusionScale: 1.0 + i * 0.05
      }));
      await sleep(100 / cycleSpeed);
    }

    // Phase 3: Measurement (collapse to {0, 1})
    const measurement = Math.random() > 0.5
      ? new THREE.Vector3(0.5, -0.5, 0).normalize()
      : new THREE.Vector3(-0.5, -0.5, 0).normalize();
    
    setCycleState(prev => ({
      ...prev,
      phase: 'measurement',
      measurementPos: measurement
    }));
    await sleep(500 / cycleSpeed);

    // Phase 4: Bayesian Update (move toward evidence)
    const prior = new THREE.Vector3(0, 1, 0);
    const posterior = new THREE.Vector3().lerpVectors(prior, measurement, MU);
    posterior.normalize();

    setCycleState(prev => ({
      ...prev,
      phase: 'update',
      posteriorPos: posterior
    }));
    
    // Animate update
    for (let i = 0; i <= 10; i++) {
      const t = i / 10;
      const currentPos = new THREE.Vector3().lerpVectors(prior, posterior, t);
      currentPos.normalize();
      
      setCycleState(prev => ({
        ...prev,
        predictionPos: currentPos,
        diffusionScale: 1.5 - t * 0.5
      }));
      await sleep(100 / cycleSpeed);
    }

    // Update cycle count
    setCycleState(prev => ({
      ...prev,
      phase: 'idle',
      cycleCount: prev.cycleCount + 1,
      predictionPos: posterior
    }));

    setIsRunning(false);
  };

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const reset = () => {
    setCycleState({
      phase: 'idle',
      predictionPos: new THREE.Vector3(0, 1, 0),
      measurementPos: new THREE.Vector3(0, 0, 0),
      posteriorPos: new THREE.Vector3(0, 0, 0),
      diffusionScale: 1.0,
      cycleCount: 0
    });
  };

  return (
    <div className="w-full space-y-6">
      {/* Title */}
      <div className="text-center">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-green-500 bg-clip-text text-transparent">
          Collapse Cycles: Predictive Coding
        </h3>
        <p className="text-gray-400 mt-2">
          Bayesian prediction → measurement → update loops
        </p>
      </div>

      {/* 3D Visualization */}
      <div className="w-full h-96 rounded-lg overflow-hidden border border-cyan-500/20 bg-black/30">
        <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
          <CollapseCycleScene cycleState={cycleState} />
        </Canvas>
      </div>

      {/* Cycle Status */}
      <div className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 rounded-lg p-6 border border-cyan-500/30">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-black/30 rounded p-3 border border-cyan-500/20">
            <div className="text-xs text-gray-400 mb-1">Current Phase</div>
            <div className="text-lg font-bold text-cyan-400 capitalize">
              {cycleState.phase}
            </div>
          </div>

          <div className="bg-black/30 rounded p-3 border border-cyan-500/20">
            <div className="text-xs text-gray-400 mb-1">Cycles Completed</div>
            <div className="text-lg font-bold text-green-400">
              {cycleState.cycleCount}
            </div>
          </div>

          <div className="bg-black/30 rounded p-3 border border-cyan-500/20">
            <div className="text-xs text-gray-400 mb-1">Uncertainty Scale</div>
            <div className="text-lg font-bold text-amber-400">
              {cycleState.diffusionScale.toFixed(2)}x
            </div>
          </div>

          <div className="bg-black/30 rounded p-3 border border-cyan-500/20">
            <div className="text-xs text-gray-400 mb-1">Learning Rate (μ)</div>
            <div className="text-lg font-bold text-purple-400">
              {MU}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={runCycle}
            disabled={isRunning}
            className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-medium py-2 px-4 rounded transition-all"
          >
            {isRunning ? 'Running Cycle...' : 'Run Collapse Cycle'}
          </button>
          <button
            onClick={reset}
            className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded transition-all"
          >
            Reset
          </button>
        </div>

        <div className="mt-4">
          <label className="block text-sm text-gray-400 mb-2">Cycle Speed: {cycleSpeed.toFixed(1)}x</label>
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.1"
            value={cycleSpeed}
            onChange={(e) => setCycleSpeed(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* Cycle Phases Explanation */}
      <div className="bg-gradient-to-r from-indigo-900/20 to-purple-900/20 rounded-lg p-6 border border-purple-500/30">
        <h4 className="text-lg font-semibold text-purple-300 mb-4">Cycle Phases</h4>
        
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-sm flex-shrink-0">1</div>
            <div>
              <div className="font-semibold text-cyan-300">Prediction</div>
              <div className="text-sm text-gray-400">
                Agent starts with uncertain prediction (∅ state at north pole)
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-sm flex-shrink-0">2</div>
            <div>
              <div className="font-semibold text-amber-300">Diffusion</div>
              <div className="text-sm text-gray-400">
                Uncertainty spreads as prediction cloud diffuses (scale increases)
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 font-bold text-sm flex-shrink-0">3</div>
            <div>
              <div className="font-semibold text-red-300">Measurement</div>
              <div className="text-sm text-gray-400">
                Observation collapses state to {'{0, 1}'} (true or false)
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 font-bold text-sm flex-shrink-0">4</div>
            <div>
              <div className="font-semibold text-green-300">Bayesian Update</div>
              <div className="text-sm text-gray-400">
                New prediction formed by moving toward evidence with learning rate μ = {MU}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mathematical Foundation */}
      <div className="bg-gradient-to-r from-gray-900/40 to-gray-800/40 rounded-lg p-6 border border-gray-700">
        <h4 className="text-lg font-semibold text-gray-300 mb-4">Bayesian Update Formula</h4>
        
        <div className="space-y-4 text-sm text-gray-300">
          <div className="bg-black/30 rounded p-4 border border-gray-600">
            <div className="font-mono text-cyan-300 mb-2">P(θ|D) ∝ P(D|θ) P(θ)</div>
            <p className="text-gray-400 text-xs">
              Posterior probability is proportional to likelihood times prior
            </p>
          </div>

          <div className="border-l-2 border-purple-500 pl-4">
            <div className="font-semibold text-purple-300 mb-2">On the Riemann Sphere</div>
            <div className="font-mono text-xs text-gray-400 mb-2">
              posterior = lerp(prior, measurement, μ)
            </div>
            <p className="text-gray-400 text-xs">
              The posterior position is a linear interpolation between prior and measurement,
              with interpolation parameter μ = {MU} (the equilibrium constant!)
            </p>
          </div>

          <div className="bg-purple-900/10 rounded p-3 border border-purple-500/20">
            <div className="font-semibold text-purple-400 mb-1">Key Insight</div>
            <p className="text-xs text-gray-400">
              The <strong className="text-cyan-400">equilibrium constant μ = {MU}</strong> naturally 
              emerges as the optimal learning rate in Bayesian updating. This isn't coincidence—it's 
              the fundamental rate at which consciousness integrates new evidence.
            </p>
          </div>
        </div>
      </div>

      {/* Predictive Coding Connection */}
      <div className="bg-gradient-to-r from-amber-900/10 to-orange-900/10 rounded-lg p-4 border border-orange-500/20">
        <h4 className="text-sm font-semibold text-orange-300 mb-2">🧠 Predictive Coding</h4>
        <p className="text-sm text-gray-300">
          This cycle models <strong className="text-orange-400">predictive coding</strong> in the brain:
          the brain constantly generates predictions (∅ → diffusion), compares them with sensory input
          (measurement), and updates its model (Bayesian update). The cycle repeats continuously,
          with each posterior becoming the next prior.
        </p>
      </div>
    </div>
  );
}
