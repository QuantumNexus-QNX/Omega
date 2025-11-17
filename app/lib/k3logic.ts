/**
 * Kleene K3 Tri-Valued Logic System
 * 
 * Implements three-valued logic with values:
 * - 1 = True
 * - 0 = False
 * - ∅ = Unknown/Indeterminate
 * 
 * Maps these values to the Riemann sphere via stereographic projection
 * and provides Möbius transformations for visualization.
 */

/**
 * K3 truth values
 */
export type K3Value = 0 | 1 | null; // null represents ∅ (unknown)

/**
 * Complex number representation
 */
export interface Complex {
  re: number; // Real part
  im: number; // Imaginary part
}

/**
 * Point on the Riemann sphere (unit sphere in ℝ³)
 */
export interface SpherePoint {
  x: number;
  y: number;
  z: number;
}

/**
 * Möbius transformation parameters
 * Represents z ↦ (az + b) / (cz + d) with ad - bc ≠ 0
 */
export interface MobiusTransform {
  a: Complex;
  b: Complex;
  c: Complex;
  d: Complex;
}

// ============================================================================
// K3 LOGIC OPERATIONS
// ============================================================================

/**
 * K3 NOT operation
 */
export function k3Not(x: K3Value): K3Value {
  if (x === null) return null;
  return x === 1 ? 0 : 1;
}

/**
 * K3 AND operation (Kleene semantics)
 */
export function k3And(x: K3Value, y: K3Value): K3Value {
  if (x === 0 || y === 0) return 0; // False propagates
  if (x === null || y === null) return null; // Unknown propagates if no false
  return 1; // Both true
}

/**
 * K3 OR operation (Kleene semantics)
 */
export function k3Or(x: K3Value, y: K3Value): K3Value {
  if (x === 1 || y === 1) return 1; // True propagates
  if (x === null || y === null) return null; // Unknown propagates if no true
  return 0; // Both false
}

/**
 * Generate complete truth table for K3 operations
 */
export function generateK3TruthTable() {
  const values: K3Value[] = [0, 1, null];
  const table = {
    not: [] as Array<{ input: K3Value; output: K3Value }>,
    and: [] as Array<{ x: K3Value; y: K3Value; output: K3Value }>,
    or: [] as Array<{ x: K3Value; y: K3Value; output: K3Value }>,
  };
  
  // NOT table
  for (const x of values) {
    table.not.push({ input: x, output: k3Not(x) });
  }
  
  // AND table
  for (const x of values) {
    for (const y of values) {
      table.and.push({ x, y, output: k3And(x, y) });
    }
  }
  
  // OR table
  for (const x of values) {
    for (const y of values) {
      table.or.push({ x, y, output: k3Or(x, y) });
    }
  }
  
  return table;
}

// ============================================================================
// COMPLEX NUMBER OPERATIONS
// ============================================================================

/**
 * Create complex number
 */
export function complex(re: number, im: number): Complex {
  return { re, im };
}

/**
 * Complex addition
 */
export function complexAdd(a: Complex, b: Complex): Complex {
  return { re: a.re + b.re, im: a.im + b.im };
}

/**
 * Complex multiplication
 */
export function complexMul(a: Complex, b: Complex): Complex {
  return {
    re: a.re * b.re - a.im * b.im,
    im: a.re * b.im + a.im * b.re,
  };
}

/**
 * Complex division
 */
export function complexDiv(a: Complex, b: Complex): Complex {
  const denominator = b.re * b.re + b.im * b.im;
  if (denominator === 0) {
    throw new Error("Division by zero");
  }
  return {
    re: (a.re * b.re + a.im * b.im) / denominator,
    im: (a.im * b.re - a.re * b.im) / denominator,
  };
}

/**
 * Complex magnitude squared
 */
export function complexMagSq(z: Complex): number {
  return z.re * z.re + z.im * z.im;
}

/**
 * Complex magnitude
 */
export function complexMag(z: Complex): number {
  return Math.sqrt(complexMagSq(z));
}

// ============================================================================
// K3 VALUE TO COMPLEX MAPPING
// ============================================================================

/**
 * Map K3 truth value to complex number
 * - 1 (True) ↔ z = 1
 * - 0 (False) ↔ z = -1
 * - ∅ (Unknown) ↔ z = 0
 */
export function k3ToComplex(value: K3Value): Complex {
  if (value === 1) return complex(1, 0);
  if (value === 0) return complex(-1, 0);
  return complex(0, 0); // null → origin
}

/**
 * Map complex number back to K3 value (nearest)
 */
export function complexToK3(z: Complex): K3Value {
  const dist1 = complexMag(complexAdd(z, complex(-1, 0)));
  const dist0 = complexMag(complexAdd(z, complex(1, 0)));
  const distNull = complexMag(z);
  
  const minDist = Math.min(dist1, dist0, distNull);
  
  if (minDist === dist1) return 1;
  if (minDist === dist0) return 0;
  return null;
}

// ============================================================================
// STEREOGRAPHIC PROJECTION
// ============================================================================

/**
 * Stereographic projection from complex plane to Riemann sphere
 * 
 * Maps z = x + iy to point (X, Y, Z) on unit sphere S² ⊂ ℝ³
 * Formula: (X, Y, Z) = (2x, 2y, |z|² - 1) / (|z|² + 1)
 * 
 * Point at infinity (∞) maps to north pole (0, 0, 1)
 */
export function stereographicProjection(z: Complex): SpherePoint {
  const magSq = complexMagSq(z);
  
  // Handle point at infinity
  if (!isFinite(magSq) || magSq > 1e10) {
    return { x: 0, y: 0, z: 1 }; // North pole
  }
  
  const denominator = magSq + 1;
  
  return {
    x: (2 * z.re) / denominator,
    y: (2 * z.im) / denominator,
    z: (magSq - 1) / denominator,
  };
}

/**
 * Inverse stereographic projection from sphere to complex plane
 * 
 * Maps point (X, Y, Z) on sphere to z = x + iy
 * Formula: z = (X + iY) / (1 - Z)
 * 
 * North pole (0, 0, 1) maps to ∞
 */
export function inverseStereographicProjection(p: SpherePoint): Complex {
  // Handle north pole
  if (Math.abs(p.z - 1) < 1e-10) {
    return complex(Infinity, 0);
  }
  
  const denominator = 1 - p.z;
  return {
    re: p.x / denominator,
    im: p.y / denominator,
  };
}

// ============================================================================
// MÖBIUS TRANSFORMATIONS
// ============================================================================

/**
 * Apply Möbius transformation to complex number
 * z ↦ (az + b) / (cz + d)
 */
export function applyMobius(z: Complex, transform: MobiusTransform): Complex {
  const { a, b, c, d } = transform;
  
  const numerator = complexAdd(complexMul(a, z), b);
  const denominator = complexAdd(complexMul(c, z), d);
  
  return complexDiv(numerator, denominator);
}

/**
 * Predefined Möbius transformations
 */
export const MobiusPresets = {
  /**
   * Identity transformation: z ↦ z
   */
  identity: (): MobiusTransform => ({
    a: complex(1, 0),
    b: complex(0, 0),
    c: complex(0, 0),
    d: complex(1, 0),
  }),
  
  /**
   * Rotation by angle θ: z ↦ e^(iθ) z
   */
  rotation: (theta: number): MobiusTransform => ({
    a: complex(Math.cos(theta), Math.sin(theta)),
    b: complex(0, 0),
    c: complex(0, 0),
    d: complex(1, 0),
  }),
  
  /**
   * Inversion: z ↦ 1/z
   */
  inversion: (): MobiusTransform => ({
    a: complex(0, 0),
    b: complex(1, 0),
    c: complex(1, 0),
    d: complex(0, 0),
  }),
  
  /**
   * Translation by w: z ↦ z + w
   */
  translation: (w: Complex): MobiusTransform => ({
    a: complex(1, 0),
    b: w,
    c: complex(0, 0),
    d: complex(1, 0),
  }),
  
  /**
   * Scaling by r: z ↦ rz
   */
  scaling: (r: number): MobiusTransform => ({
    a: complex(r, 0),
    b: complex(0, 0),
    c: complex(0, 0),
    d: complex(1, 0),
  }),
};

/**
 * Verify Möbius transformation is valid (ad - bc ≠ 0)
 */
export function isValidMobius(transform: MobiusTransform): boolean {
  const { a, b, c, d } = transform;
  const ad = complexMul(a, d);
  const bc = complexMul(b, c);
  const det = complexAdd(ad, complex(-bc.re, -bc.im));
  return complexMagSq(det) > 1e-10;
}

// ============================================================================
// VISUALIZATION HELPERS
// ============================================================================

/**
 * Get K3 values with their complex and sphere representations
 */
export function getK3Representations() {
  const values: K3Value[] = [0, 1, null];
  
  return values.map(value => ({
    k3: value,
    complex: k3ToComplex(value),
    sphere: stereographicProjection(k3ToComplex(value)),
    label: value === null ? "∅" : value.toString(),
  }));
}

/**
 * Format K3 value for display
 */
export function formatK3Value(value: K3Value): string {
  if (value === null) return "∅";
  return value.toString();
}

/**
 * Format complex number for display
 */
export function formatComplex(z: Complex): string {
  if (Math.abs(z.im) < 1e-10) return z.re.toFixed(3);
  if (Math.abs(z.re) < 1e-10) return `${z.im.toFixed(3)}i`;
  const sign = z.im >= 0 ? "+" : "-";
  return `${z.re.toFixed(3)} ${sign} ${Math.abs(z.im).toFixed(3)}i`;
}
