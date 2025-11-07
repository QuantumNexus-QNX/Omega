'use client';

import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line, Sphere, Html } from '@react-three/drei';
import * as THREE from 'three';
import {
  getTriLogicPoints,
  applyMobiusToSphere,
  MobiusTransform,
  MOBIUS_TRANSFORMS,
  TriLogicPoint,
} from '@/lib/trilogic';

interface SphereSceneProps {
  transform: MobiusTransform;
  showProjection: boolean;
}

function TriLogicMarker({ point, transformed }: { point: TriLogicPoint; transformed: THREE.Vector3 }) {
  return (
    <group>
      {/* Original point */}
      <Sphere args={[0.08, 16, 16]} position={point.position}>
        <meshStandardMaterial color={point.color} emissive={point.color} emissiveIntensity={0.3} />
      </Sphere>
      
      {/* Transformed point (if different) */}
      {!point.position.equals(transformed) && (
        <>
          <Sphere args={[0.08, 16, 16]} position={transformed}>
            <meshStandardMaterial 
              color={point.color} 
              emissive={point.color} 
              emissiveIntensity={0.6}
              opacity={0.8}
              transparent
            />
          </Sphere>
          
          {/* Connection line */}
          <Line
            points={[point.position, transformed]}
            color={point.color}
            lineWidth={2}
            opacity={0.4}
            transparent
          />
        </>
      )}
    </group>
  );
}

function ProjectionPlane({ points }: { points: TriLogicPoint[] }) {
  const planeRef = useRef<THREE.Mesh>(null);
  
  return (
    <group>
      {/* Equatorial plane for stereographic projection */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[4, 4]} />
        <meshStandardMaterial
          color="#1a1a2e"
          transparent
          opacity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Grid on the plane */}
      <gridHelper args={[4, 20, '#00d9ff', '#8b5cf6']} rotation={[0, 0, 0]} />
    </group>
  );
}

function SphereScene({ transform, showProjection }: SphereSceneProps) {
  const sphereRef = useRef<THREE.Mesh>(null);
  const points = useMemo(() => getTriLogicPoints(), []);
  
  const transformedPoints = useMemo(() => {
    return points.map(p => applyMobiusToSphere(transform, p.position));
  }, [points, transform]);
  
  // Gentle rotation animation
  useFrame((state) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });
  
  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-10, -10, -10]} intensity={0.4} color="#8b5cf6" />
      
      {/* Main Riemann sphere */}
      <Sphere ref={sphereRef} args={[1, 64, 64]}>
        <meshStandardMaterial
          color="#0a0e1a"
          transparent
          opacity={0.15}
          wireframe={false}
          side={THREE.DoubleSide}
        />
      </Sphere>
      
      {/* Wireframe overlay */}
      <Sphere args={[1.01, 24, 24]}>
        <meshBasicMaterial
          color="#00d9ff"
          wireframe
          transparent
          opacity={0.1}
        />
      </Sphere>
      
      {/* Equator circle */}
      <Line
        points={Array.from({ length: 65 }, (_, i) => {
          const angle = (i / 64) * Math.PI * 2;
          return new THREE.Vector3(Math.cos(angle), Math.sin(angle), 0);
        })}
        color="#8b5cf6"
        lineWidth={2}
        opacity={0.6}
        transparent
      />
      
      {/* Meridian circles */}
      <Line
        points={Array.from({ length: 65 }, (_, i) => {
          const angle = (i / 64) * Math.PI * 2;
          return new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle));
        })}
        color="#00d9ff"
        lineWidth={1.5}
        opacity={0.3}
        transparent
      />
      
      <Line
        points={Array.from({ length: 65 }, (_, i) => {
          const angle = (i / 64) * Math.PI * 2;
          return new THREE.Vector3(0, Math.cos(angle), Math.sin(angle));
        })}
        color="#00d9ff"
        lineWidth={1.5}
        opacity={0.3}
        transparent
      />
      
      {/* Tri-logic points */}
      {points.map((point, i) => (
        <TriLogicMarker
          key={i}
          point={point}
          transformed={transformedPoints[i]}
        />
      ))}
      
      {/* Projection plane */}
      {showProjection && <ProjectionPlane points={points} />}
      
      {/* Orbit controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={2}
        maxDistance={8}
      />
    </>
  );
}

export default function RiemannSphere() {
  const [selectedTransform, setSelectedTransform] = useState<keyof typeof MOBIUS_TRANSFORMS>('identity');
  const [showProjection, setShowProjection] = useState(true);
  
  const transform = MOBIUS_TRANSFORMS[selectedTransform];
  const points = useMemo(() => getTriLogicPoints(), []);
  
  return (
    <div className="w-full h-full flex flex-col">
      {/* 3D Canvas */}
      <div className="flex-1 relative">
        <Canvas
          camera={{ position: [3, 2, 3], fov: 50 }}
          className="bg-gradient-to-br from-[#0a0e1a] via-[#0f1420] to-[#1a1a2e]"
        >
          <SphereScene transform={transform} showProjection={showProjection} />
        </Canvas>
        
        {/* Legend overlay */}
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-4 text-sm">
          <h3 className="font-semibold mb-2 text-cyan-400">Truth Values</h3>
          <div className="space-y-1">
            {points.map((point, i) => (
              <div key={i} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: point.color }}
                />
                <span className="text-gray-300">{point.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Controls */}
      <div className="bg-[#0a0e1a] border-t border-cyan-500/20 p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Transform selector */}
          <div>
            <label className="block text-sm font-medium text-cyan-400 mb-2">
              Möbius Transformation
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {Object.keys(MOBIUS_TRANSFORMS).map((key) => (
                <button
                  key={key}
                  onClick={() => setSelectedTransform(key as keyof typeof MOBIUS_TRANSFORMS)}
                  className={`px-4 py-2 rounded-lg border transition-all ${
                    selectedTransform === key
                      ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-500 text-cyan-300'
                      : 'border-gray-700 text-gray-400 hover:border-cyan-500/50 hover:text-cyan-400'
                  }`}
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          {/* Options */}
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={showProjection}
                onChange={(e) => setShowProjection(e.target.checked)}
                className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-gray-900"
              />
              Show Projection Plane
            </label>
          </div>
          
          {/* Info */}
          <div className="text-xs text-gray-500 border-t border-gray-800 pt-4">
            <p>
              <strong className="text-cyan-400">Stereographic Projection:</strong> Maps the Riemann sphere to the complex plane.
              Drag to rotate • Scroll to zoom • Right-click to pan
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

