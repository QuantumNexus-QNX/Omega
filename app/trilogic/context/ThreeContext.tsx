'use client';

import React, { createContext, useContext, useRef, ReactNode } from 'react';
import * as THREE from 'three';

interface ThreeContextType {
  sharedGeometry: {
    sphere: THREE.SphereGeometry;
    line: THREE.BufferGeometry;
    point: THREE.SphereGeometry;
  };
  sharedMaterials: {
    sphere: THREE.MeshStandardMaterial;
    wireframe: THREE.LineBasicMaterial;
    point: THREE.MeshBasicMaterial;
  };
}

const ThreeContext = createContext<ThreeContextType | undefined>(undefined);

export function ThreeProvider({ children }: { children: ReactNode }) {
  // Create shared geometries once
  const sharedGeometry = useRef({
    sphere: new THREE.SphereGeometry(2, 64, 64),
    line: new THREE.BufferGeometry(),
    point: new THREE.SphereGeometry(0.1, 16, 16),
  });

  // Create shared materials once
  const sharedMaterials = useRef({
    sphere: new THREE.MeshStandardMaterial({
      color: 0x4a5568,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide,
    }),
    wireframe: new THREE.LineBasicMaterial({
      color: 0x9333ea,
      transparent: true,
      opacity: 0.5,
    }),
    point: new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
    }),
  });

  return (
    <ThreeContext.Provider
      value={{
        sharedGeometry: sharedGeometry.current,
        sharedMaterials: sharedMaterials.current,
      }}
    >
      {children}
    </ThreeContext.Provider>
  );
}

export function useThreeContext() {
  const context = useContext(ThreeContext);
  if (!context) {
    throw new Error('useThreeContext must be used within a ThreeProvider');
  }
  return context;
}
