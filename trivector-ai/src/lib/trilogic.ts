/**
 * Tri-logic system: {0, 1, ∅}
 * Maps truth values to the Riemann sphere via stereographic projection
 */

import * as THREE from 'three';

export type TruthValue = 0 | 1 | null; // null represents ∅ (empty/undefined)

export interface TriLogicPoint {
  value: TruthValue;
  position: THREE.Vector3;
  label: string;
  color: string;
}

/**
 * Map truth values to points on the Riemann sphere
 * - 0 → South pole (0, 0, -1)
 * - 1 → North pole (0, 0, 1)
 * - ∅ → Equator point (1, 0, 0)
 */
export function truthValueToSphere(value: TruthValue): THREE.Vector3 {
  switch (value) {
    case 0:
      return new THREE.Vector3(0, 0, -1); // South pole
    case 1:
      return new THREE.Vector3(0, 0, 1); // North pole
    case null:
      return new THREE.Vector3(1, 0, 0); // Equator (undefined)
    default:
      return new THREE.Vector3(0, 0, 0);
  }
}

/**
 * Stereographic projection from sphere to complex plane
 * Projects from north pole onto the equatorial plane
 */
export function stereographicProjection(point: THREE.Vector3): THREE.Vector2 {
  // Avoid division by zero at north pole
  if (Math.abs(point.z - 1) < 0.001) {
    return new THREE.Vector2(0, 0); // North pole projects to origin
  }
  
  const scale = 1 / (1 - point.z);
  return new THREE.Vector2(point.x * scale, point.y * scale);
}

/**
 * Inverse stereographic projection from complex plane to sphere
 */
export function inverseStereographic(w: THREE.Vector2): THREE.Vector3 {
  const wSq = w.x * w.x + w.y * w.y;
  const denom = wSq + 1;
  
  return new THREE.Vector3(
    (2 * w.x) / denom,
    (2 * w.y) / denom,
    (wSq - 1) / denom
  );
}

/**
 * Möbius transformation: f(z) = (az + b) / (cz + d)
 * Represented as a 2x2 complex matrix [[a, b], [c, d]]
 */
export interface MobiusTransform {
  a: THREE.Vector2; // Complex number as (real, imag)
  b: THREE.Vector2;
  c: THREE.Vector2;
  d: THREE.Vector2;
}

/**
 * Complex number multiplication
 */
function complexMul(z1: THREE.Vector2, z2: THREE.Vector2): THREE.Vector2 {
  return new THREE.Vector2(
    z1.x * z2.x - z1.y * z2.y,
    z1.x * z2.y + z1.y * z2.x
  );
}

/**
 * Complex number addition
 */
function complexAdd(z1: THREE.Vector2, z2: THREE.Vector2): THREE.Vector2 {
  return new THREE.Vector2(z1.x + z2.x, z1.y + z2.y);
}

/**
 * Complex number division
 */
function complexDiv(z1: THREE.Vector2, z2: THREE.Vector2): THREE.Vector2 {
  const denom = z2.x * z2.x + z2.y * z2.y;
  if (denom < 0.0001) return new THREE.Vector2(0, 0);
  
  return new THREE.Vector2(
    (z1.x * z2.x + z1.y * z2.y) / denom,
    (z1.y * z2.x - z1.x * z2.y) / denom
  );
}

/**
 * Apply Möbius transformation to a complex number
 */
export function applyMobius(transform: MobiusTransform, z: THREE.Vector2): THREE.Vector2 {
  const numerator = complexAdd(complexMul(transform.a, z), transform.b);
  const denominator = complexAdd(complexMul(transform.c, z), transform.d);
  return complexDiv(numerator, denominator);
}

/**
 * Apply Möbius transformation to a point on the Riemann sphere
 */
export function applyMobiusToSphere(transform: MobiusTransform, point: THREE.Vector3): THREE.Vector3 {
  // Project to complex plane
  const w = stereographicProjection(point);
  
  // Apply Möbius transformation
  const transformed = applyMobius(transform, w);
  
  // Project back to sphere
  return inverseStereographic(transformed);
}

/**
 * Predefined Möbius transformations
 */
export const MOBIUS_TRANSFORMS = {
  identity: {
    a: new THREE.Vector2(1, 0),
    b: new THREE.Vector2(0, 0),
    c: new THREE.Vector2(0, 0),
    d: new THREE.Vector2(1, 0),
  } as MobiusTransform,
  
  inversion: {
    a: new THREE.Vector2(0, 0),
    b: new THREE.Vector2(1, 0),
    c: new THREE.Vector2(1, 0),
    d: new THREE.Vector2(0, 0),
  } as MobiusTransform,
  
  rotation90: {
    a: new THREE.Vector2(0, 1),
    b: new THREE.Vector2(0, 0),
    c: new THREE.Vector2(0, 0),
    d: new THREE.Vector2(0, 1),
  } as MobiusTransform,
  
  scaling: {
    a: new THREE.Vector2(2, 0),
    b: new THREE.Vector2(0, 0),
    c: new THREE.Vector2(0, 0),
    d: new THREE.Vector2(1, 0),
  } as MobiusTransform,
};

/**
 * Get the three fundamental tri-logic points
 */
export function getTriLogicPoints(): TriLogicPoint[] {
  return [
    {
      value: 0,
      position: truthValueToSphere(0),
      label: '0 (False)',
      color: '#ff006e', // Magenta
    },
    {
      value: 1,
      position: truthValueToSphere(1),
      label: '1 (True)',
      color: '#00d9ff', // Cyan
    },
    {
      value: null,
      position: truthValueToSphere(null),
      label: '∅ (Undefined)',
      color: '#8b5cf6', // Purple
    },
  ];
}

