'use client';

/**
 * Enhanced Riemann Sphere Component
 * "The Sphere Awakens" - Making mathematics visceral
 * 
 * Features:
 * - Multi-layered sphere rendering (wireframe + Fresnel glow + navigation grid)
 * - Optimal triangular positioning for truth values
 * - Stereographic projection lines (north pole → sphere → complex plane)
 * - Equilibrium spiral overlay (μ=0.569, Ω=0.847)
 * - Collapse animation (∅ → {0,1})
 * - Interactive tooltips and focus controls
 */

import React, { useRef, useMemo, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Line, Html } from '@react-three/drei';
import { Vector3, BufferGeometry, Float32BufferAttribute, Mesh, BackSide } from 'three';
import * as THREE from 'three';

import { MobiusParams, transformSpherePoint } from '../lib/math';

// Constants
const MU = 0.569; // Equilibrium constant
const OMEGA = 0.847; // Resonance frequency (Hz)
const SPHERE_RADIUS = 1;

// Fresnel glow shader material (simplified approach using standard materials)

/**
 * Helper: Complex to sphere using stereographic projection
 */
function complexToSphere(x: number, y: number): Vector3 {
  const r2 = x * x + y * y;
  const denom = 1 + r2;
  return new Vector3(
    2 * x / denom,
    (r2 - 1) / denom,
    2 * y / denom
  );
}

/**
 * Optimal positions for visual separation
 */
const LOGIC_POINTS = {
  false: {
    complex: { x: -0.5, y: -0.5 },  // Southwest on complex plane
    color: '#ff4444',  // Red
    label: '0 (False)'
  },
  true: {
    complex: { x: 0.5, y: -0.5 },   // Southeast on complex plane
    color: '#44ff44',  // Green
    label: '1 (True)'
  },
  undefined: {
    complex: { x: 0, y: 5 },        // Far north → near infinity
    color: '#ffaa44',  // Orange/Gold
    label: '∅ (Undefined)'
  }
};

/**
 * Wireframe sphere layer
 */
function WireframeSphere() {
  return (
    <mesh>
      <sphereGeometry args={[SPHERE_RADIUS, 32, 32]} />
      <meshBasicMaterial
        color={0x4a5568}
        wireframe
        transparent
        opacity={0.15}
      />
    </mesh>
  );
}

/**
 * Fresnel glow layer (using standard material with emissive)
 */
function FresnelGlow() {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Subtle pulsing glow effect
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.3 + 0.1 * Math.sin(state.clock.getElapsedTime() * 0.5);
    }
  });

  return (
    <mesh ref={meshRef} scale={[1.05, 1.05, 1.05]}>
      <sphereGeometry args={[SPHERE_RADIUS, 32, 32]} />
      <meshStandardMaterial
        color="#88ccff"
        emissive="#88ccff"
        emissiveIntensity={0.3}
        transparent
        opacity={0.15}
        side={BackSide}
      />
    </mesh>
  );
}

/**
 * Navigation grid (equator and meridians)
 */
function NavigationGrid() {
  const lines = useMemo(() => {
    const equatorPoints: Vector3[] = [];
    const meridian1Points: Vector3[] = [];
    const meridian2Points: Vector3[] = [];

    for (let i = 0; i <= 64; i++) {
      const theta = (i / 64) * Math.PI * 2;
      
      // Equator (XZ plane)
      equatorPoints.push(new Vector3(
        Math.cos(theta),
        0,
        Math.sin(theta)
      ));
      
      // Prime meridian (XY plane)
      meridian1Points.push(new Vector3(
        Math.cos(theta),
        Math.sin(theta),
        0
      ));
      
      // Second meridian (YZ plane)
      meridian2Points.push(new Vector3(
        0,
        Math.cos(theta),
        Math.sin(theta)
      ));
    }

    return [
      { points: equatorPoints, color: '#8b5cf6' },
      { points: meridian1Points, color: '#8b5cf6' },
      { points: meridian2Points, color: '#8b5cf6' }
    ];
  }, []);

  return (
    <>
      {lines.map((line, idx) => (
        <Line
          key={idx}
          points={line.points}
          color={line.color}
          lineWidth={2}
          transparent
          opacity={0.4}
        />
      ))}
    </>
  );
}

/**
 * Truth value markers with optimal positioning
 */
interface TruthValueMarkersProps {
  transformation?: MobiusParams | null;
  onMarkerClick?: (key: string) => void;
}

function TruthValueMarkers({ transformation, onMarkerClick }: TruthValueMarkersProps) {
  const markers = useMemo(() => {
    const baseMarkers = Object.entries(LOGIC_POINTS).map(([key, data]) => {
      const spherePos = complexToSphere(data.complex.x, data.complex.y);
      const markerSize = key === 'undefined' ? 0.12 : 0.08;
      
      return {
        key,
        position: spherePos,
        size: markerSize,
        color: data.color,
        label: data.label
      };
    });

    if (transformation) {
      return baseMarkers.map(marker => ({
        ...marker,
        position: transformSpherePoint(marker.position, transformation)
      }));
    }

    return baseMarkers;
  }, [transformation]);

  return (
    <>
      {markers.map((marker) => (
        <group key={marker.key} position={marker.position}>
          {/* Marker sphere */}
          <mesh onClick={() => onMarkerClick?.(marker.key)}>
            <sphereGeometry args={[marker.size, 32, 32]} />
            <meshPhongMaterial
              color={marker.color}
              emissive={marker.color}
              emissiveIntensity={0.5}
              shininess={100}
            />
          </mesh>
          
          {/* Point light for glow effect */}
          <pointLight color={marker.color} intensity={0.5} distance={0.3} />
          
          {/* Label */}
          <Html distanceFactor={10}>
            <div className="text-xs text-white bg-black/70 px-2 py-1 rounded whitespace-nowrap pointer-events-none">
              {marker.label}
            </div>
          </Html>
        </group>
      ))}
    </>
  );
}

/**
 * Complex plane visualization
 */
function ComplexPlane() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
      <circleGeometry args={[2, 64]} />
      <meshBasicMaterial
        color={0x1a1a2e}
        transparent
        opacity={0.3}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/**
 * North pole marker
 */
function NorthPoleMarker() {
  return (
    <mesh position={[0, 1, 0]}>
      <sphereGeometry args={[0.04, 16, 16]} />
      <meshBasicMaterial color={0xffffff} />
    </mesh>
  );
}

/**
 * Stereographic projection lines
 */
interface ProjectionLinesProps {
  show: boolean;
  transformation?: MobiusParams | null;
}

function ProjectionLines({ show, transformation }: ProjectionLinesProps) {
  if (!show) return null;

  const lines = useMemo(() => {
    const northPole = new Vector3(0, 1, 0);
    const projectionLines: { points: Vector3[]; color: string }[] = [];

    Object.entries(LOGIC_POINTS).forEach(([key, data]) => {
      let spherePoint = complexToSphere(data.complex.x, data.complex.y);
      
      if (transformation) {
        spherePoint = transformSpherePoint(spherePoint, transformation);
      }

      // Calculate plane point
      const direction = spherePoint.clone().sub(northPole).normalize();
      const t = (-2 - northPole.y) / direction.y;
      const planePoint = northPole.clone().add(direction.multiplyScalar(t));

      projectionLines.push({
        points: [northPole, spherePoint, planePoint],
        color: data.color
      });
    });

    return projectionLines;
  }, [transformation]);

  return (
    <>
      {lines.map((line, idx) => (
        <Line
          key={idx}
          points={line.points}
          color={line.color}
          lineWidth={1}
          transparent
          opacity={0.4}
        />
      ))}
    </>
  );
}

/**
 * Equilibrium spiral overlay
 */
interface EquilibriumSpiralProps {
  show: boolean;
}

function EquilibriumSpiral({ show }: EquilibriumSpiralProps) {
  const spiralRef = useRef<THREE.Line>(null);

  useFrame((state) => {
    if (spiralRef.current && show) {
      const time = state.clock.getElapsedTime();
      const material = spiralRef.current.material as THREE.LineBasicMaterial;
      material.opacity = 0.6 + 0.2 * Math.sin(time * OMEGA);
      spiralRef.current.rotation.z = time * 0.1;
    }
  });

  const { points, colors } = useMemo(() => {
    const spiralPoints: Vector3[] = [];
    const spiralColors: number[] = [];

    // Generate spiral: z(θ) = μ^θ · e^(iΩθ)
    for (let n = 0; n < 6; n++) {
      for (let step = 0; step < 20; step++) {
        const theta = n * Math.PI + (step / 20) * Math.PI;
        const r = Math.pow(MU, theta / Math.PI);
        const phase = OMEGA * theta;

        const x = r * Math.cos(phase);
        const y = r * Math.sin(phase);

        const spherePos = complexToSphere(x, y);
        spiralPoints.push(spherePos);

        // Color gradient: bright → dim as it collapses
        const brightness = r;
        spiralColors.push(brightness, brightness * 0.8, brightness * 1.0);
      }
    }

    return { points: spiralPoints, colors: spiralColors };
  }, []);

  if (!show) return null;

  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.Float32BufferAttribute(points.flatMap(p => [p.x, p.y, p.z]), 3));
    geom.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    return geom;
  }, [points, colors]);

  const material = useMemo(() => {
    return new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.8 });
  }, []);

  return (
    <primitive object={new THREE.Line(geometry, material)} ref={spiralRef} />
  );
}

/**
 * Main Enhanced Riemann Sphere
 */
interface RiemannSphereEnhancedProps {
  transformation?: MobiusParams | null;
  showProjectionLines?: boolean;
  showSpiral?: boolean;
  animating?: boolean;
  onFocusView?: () => void;
}

export default function RiemannSphereEnhanced({
  transformation = null,
  showProjectionLines = true,
  showSpiral = false,
  animating = false,
  onFocusView
}: RiemannSphereEnhancedProps) {
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);

  const handleMarkerClick = useCallback((key: string) => {
    setSelectedMarker(key);
  }, []);

  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [2, 1.5, 2], fov: 55 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "radial-gradient(circle at center, #0a0a1f 0%, #000000 100%)" }}
      >
        {/* Lighting */}
        <ambientLight intensity={1.2} />
        <pointLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
        <pointLight position={[-5, -5, -5]} intensity={0.4} color="#a78bfa" />
        <directionalLight position={[0, 10, 0]} intensity={0.5} />

        {/* Sphere layers */}
        <WireframeSphere />
        <FresnelGlow />
        <NavigationGrid />

        {/* Complex plane */}
        <ComplexPlane />
        
        {/* North pole marker */}
        <NorthPoleMarker />

        {/* Truth value markers */}
        <TruthValueMarkers
          transformation={transformation}
          onMarkerClick={handleMarkerClick}
        />

        {/* Projection lines */}
        <ProjectionLines
          show={showProjectionLines}
          transformation={transformation}
        />

        {/* Equilibrium spiral */}
        <EquilibriumSpiral show={showSpiral} />

        {/* Coordinate axes */}
        <axesHelper args={[1.5]} />

        {/* Controls */}
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={2}
          maxDistance={10}
        />
      </Canvas>
    </div>
  );
}
