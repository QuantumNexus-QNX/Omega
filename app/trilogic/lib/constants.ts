/**
 * Constants for Tri-Logic Visualizer
 * 
 * Defines the fundamental mappings between tri-logic truth values
 * and their representations on the Riemann sphere.
 */

import { Vector3 } from 'three';

/**
 * Truth value type: 0 (false), 1 (true), or null (undefined/∅)
 */
export type TruthValue = 0 | 1 | null;

/**
 * Truth value mappings to Riemann sphere coordinates
 * 
 * The Riemann sphere provides a natural geometric representation of tri-logic:
 * - False (0) maps to the south pole: (0, 0, -1)
 * - True (1) maps to the north pole: (0, 0, 1)
 * - Undefined (∅) maps to the point at infinity (represented at north pole for visualization)
 */
export const TRUTH_VALUE_POSITIONS: Record<string, Vector3> = {
  FALSE: new Vector3(0, -1, 0),  // South pole (0)
  TRUE: new Vector3(0, 1, 0),    // North pole (1)
  UNDEFINED: new Vector3(0, 1, 0) // Point at infinity (∅) - visualized at north pole
};

/**
 * Color scheme for cosmic/quantum aesthetic
 */
export const COLORS = {
  // Background
  background: '#0a0a0a',
  
  // Gradient accents
  purple: '#7c3aed',
  blue: '#2563eb',
  cyan: '#06b6d4',
  pink: '#ec4899',
  
  // Truth value colors
  truthFalse: '#ef4444',    // Bright red for false
  truthTrue: '#22c55e',     // Bright green for true
  truthUndefined: '#f59e0b', // Bright amber for undefined
  
  // UI elements
  sphereGrid: '#1f1f1f',
  sphereSurface: '#0f0f0f',
  projectionLine: '#4f46e5',
  glow: '#7c3aed',
  
  // Text
  textPrimary: '#f5f5f5',
  textSecondary: '#a3a3a3',
  textMuted: '#525252'
};

/**
 * Animation settings
 */
export const ANIMATION = {
  duration: 1000, // milliseconds
  fps: 60,
  easing: 'easeInOutCubic' as const
};

/**
 * Sphere visualization settings
 */
export const SPHERE = {
  radius: 1,
  segments: 64,
  gridDivisions: 16
};

/**
 * Möbius transformation presets
 */
export const MOBIUS_PRESETS = {
  IDENTITY: { a: 1, b: 0, c: 0, d: 1, name: 'Identity', description: 'M(z) = z' },
  INVERSION: { a: 0, b: 1, c: 1, d: 0, name: 'Inversion', description: 'M(z) = 1/z (swaps 0 ↔ ∞)' },
  ROTATION_90: { a: { re: 0, im: 1 }, b: 0, c: 0, d: 1, name: 'Rotation 90°', description: 'M(z) = iz' },
  ROTATION_180: { a: -1, b: 0, c: 0, d: 1, name: 'Rotation 180°', description: 'M(z) = -z' },
  TRANSLATION: { a: 1, b: { re: 0.5, im: 0 }, c: 0, d: 1, name: 'Translation', description: 'M(z) = z + 0.5' }
};

