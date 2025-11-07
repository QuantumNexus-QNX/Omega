'use client';

/**
 * RiemannSphere Component
 * 
 * Interactive 3D visualization of the Riemann sphere with truth value mappings
 * and stereographic projection lines.
 */

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line, Sphere as DreiSphere, Html } from '@react-three/drei';
import { Vector3, BufferGeometry, Float32BufferAttribute } from 'three';
import { COLORS, SPHERE, TRUTH_VALUE_POSITIONS } from '../lib/constants';
import { MobiusParams, transformSpherePoint } from '../lib/math';

interface RiemannSphereProps {
  transformation?: MobiusParams | null;
  showProjectionLines?: boolean;
  animating?: boolean;
}

/**
 * Grid lines on the sphere for spatial reference
 */
function SphereGrid() {
  const gridLines = useMemo(() => {
    const lines: Vector3[][] = [];
    const divisions = SPHERE.gridDivisions;
    
    // Latitude lines
    for (let i = 1; i < divisions; i++) {
      const phi = (Math.PI * i) / divisions;
      const points: Vector3[] = [];
      
      for (let j = 0; j <= divisions * 2; j++) {
        const theta = (2 * Math.PI * j) / (divisions * 2);
        const x = SPHERE.radius * Math.sin(phi) * Math.cos(theta);
        const y = SPHERE.radius * Math.cos(phi);
        const z = SPHERE.radius * Math.sin(phi) * Math.sin(theta);
        points.push(new Vector3(x, y, z));
      }
      
      lines.push(points);
    }
    
    // Longitude lines
    for (let i = 0; i < divisions * 2; i++) {
      const theta = (2 * Math.PI * i) / (divisions * 2);
      const points: Vector3[] = [];
      
      for (let j = 0; j <= divisions; j++) {
        const phi = (Math.PI * j) / divisions;
        const x = SPHERE.radius * Math.sin(phi) * Math.cos(theta);
        const y = SPHERE.radius * Math.cos(phi);
        const z = SPHERE.radius * Math.sin(phi) * Math.sin(theta);
        points.push(new Vector3(x, y, z));
      }
      
      lines.push(points);
    }
    
    return lines;
  }, []);
  
  return (
    <>
      {gridLines.map((points, idx) => (
        <Line
          key={idx}
          points={points}
          color={COLORS.sphereGrid}
          lineWidth={0.5}
          transparent
          opacity={0.3}
        />
      ))}
    </>
  );
}

/**
 * Truth value markers on the sphere
 */
function TruthValueMarkers({ transformation }: { transformation?: MobiusParams | null }) {
  const markers = useMemo(() => {
    const baseMarkers = [
      { position: TRUTH_VALUE_POSITIONS.FALSE, color: COLORS.truthFalse, label: '0 (False)' },
      { position: TRUTH_VALUE_POSITIONS.TRUE, color: COLORS.truthTrue, label: '1 (True)' },
      { position: TRUTH_VALUE_POSITIONS.UNDEFINED, color: COLORS.truthUndefined, label: '∅ (Undefined)' }
    ];
    
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
      {markers.map((marker, idx) => (
        <group key={idx} position={marker.position}>
          <mesh>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial
              color={marker.color}
              emissive={marker.color}
              emissiveIntensity={0.5}
            />
          </mesh>
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
 * Stereographic projection lines
 */
function ProjectionLines({ show }: { show: boolean }) {
  if (!show) return null;
  
  const lines = useMemo(() => {
    // Lines from north pole to truth values
    return [
      {
        start: new Vector3(0, 1, 0),
        end: TRUTH_VALUE_POSITIONS.FALSE,
        color: COLORS.truthFalse
      },
      {
        start: new Vector3(0, 1, 0),
        end: TRUTH_VALUE_POSITIONS.TRUE,
        color: COLORS.truthTrue
      }
    ];
  }, []);
  
  return (
    <>
      {lines.map((line, idx) => (
        <Line
          key={idx}
          points={[line.start, line.end]}
          color={line.color}
          lineWidth={1.5}
          transparent
          opacity={0.4}
          dashed
          dashScale={50}
          dashSize={0.1}
          gapSize={0.05}
        />
      ))}
    </>
  );
}

/**
 * Rotating sphere with auto-rotation
 */
function RotatingSphere({ animating }: { animating: boolean }) {
  const meshRef = useRef<any>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current && animating) {
      meshRef.current.rotation.y += delta * 0.2;
    }
  });
  
  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[SPHERE.radius, SPHERE.segments, SPHERE.segments]} />
      <meshStandardMaterial
        color={COLORS.sphereSurface}
        transparent
        opacity={0.15}
        wireframe={false}
      />
    </mesh>
  );
}

/**
 * Main Riemann Sphere component
 */
export default function RiemannSphere({
  transformation = null,
  showProjectionLines = true,
  animating = false
}: RiemannSphereProps) {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [3, 2, 3], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        {/* Sphere and grid */}
        <RotatingSphere animating={animating} />
        <SphereGrid />
        
        {/* Truth value markers */}
        <TruthValueMarkers transformation={transformation} />
        
        {/* Projection lines */}
        <ProjectionLines show={showProjectionLines} />
        
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

