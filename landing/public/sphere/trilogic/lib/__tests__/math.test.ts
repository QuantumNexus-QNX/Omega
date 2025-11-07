/**
 * Unit tests for mathematical functions
 * 
 * Verifies stereographic projection, Möbius transformations, and cross-ratio preservation
 */

import { Vector3 } from 'three';
import { complex } from 'mathjs';
import {
  stereographicProjection,
  inverseStereographicProjection,
  applyMobiusTransformation,
  crossRatio,
  transformSpherePoint
} from '../math';

describe('Stereographic Projection', () => {
  test('projects south pole to origin', () => {
    const southPole = new Vector3(0, 0, -1);
    const result = stereographicProjection(southPole);
    
    expect(result).not.toBeNull();
    expect((result as any).re).toBeCloseTo(0, 10);
    expect((result as any).im).toBeCloseTo(0, 10);
  });
  
  test('projects equator point correctly', () => {
    const equatorPoint = new Vector3(1, 0, 0);
    const result = stereographicProjection(equatorPoint);
    
    expect(result).not.toBeNull();
    expect((result as any).re).toBeCloseTo(1, 10);
    expect((result as any).im).toBeCloseTo(0, 10);
  });
  
  test('north pole maps to infinity', () => {
    const northPole = new Vector3(0, 0, 1);
    const result = stereographicProjection(northPole);
    
    expect(result).toBeNull();
  });
});

describe('Inverse Stereographic Projection', () => {
  test('maps origin to south pole', () => {
    const origin = complex(0, 0);
    const result = inverseStereographicProjection(origin);
    
    expect(result.x).toBeCloseTo(0, 10);
    expect(result.y).toBeCloseTo(0, 10);
    expect(result.z).toBeCloseTo(-1, 10);
  });
  
  test('maps infinity to north pole', () => {
    const result = inverseStereographicProjection(null);
    
    expect(result.x).toBeCloseTo(0, 10);
    expect(result.y).toBeCloseTo(0, 10);
    expect(result.z).toBeCloseTo(1, 10);
  });
  
  test('round-trip projection preserves points', () => {
    const original = new Vector3(0.5, 0.5, 0.707);
    original.normalize(); // Ensure it's on unit sphere
    
    const projected = stereographicProjection(original);
    const roundTrip = inverseStereographicProjection(projected);
    
    expect(roundTrip.x).toBeCloseTo(original.x, 5);
    expect(roundTrip.y).toBeCloseTo(original.y, 5);
    expect(roundTrip.z).toBeCloseTo(original.z, 5);
  });
});

describe('Möbius Transformations', () => {
  test('identity transformation', () => {
    const z = complex(2, 3);
    const result = applyMobiusTransformation(z, { a: 1, b: 0, c: 0, d: 1 });
    
    expect(result).not.toBeNull();
    expect((result as any).re).toBeCloseTo(2, 10);
    expect((result as any).im).toBeCloseTo(3, 10);
  });
  
  test('inversion swaps 0 and infinity', () => {
    const zero = complex(0, 0);
    const result = applyMobiusTransformation(zero, { a: 0, b: 1, c: 1, d: 0 });
    
    expect(result).toBeNull(); // 0 → ∞
    
    const infResult = applyMobiusTransformation(null, { a: 0, b: 1, c: 1, d: 0 });
    expect(infResult).not.toBeNull();
    expect((infResult as any).re).toBeCloseTo(0, 10);
    expect((infResult as any).im).toBeCloseTo(0, 10);
  });
  
  test('rotation by 90 degrees', () => {
    const z = complex(1, 0);
    const result = applyMobiusTransformation(z, { 
      a: { re: 0, im: 1 }, 
      b: 0, 
      c: 0, 
      d: 1 
    });
    
    expect(result).not.toBeNull();
    expect((result as any).re).toBeCloseTo(0, 10);
    expect((result as any).im).toBeCloseTo(1, 10);
  });
  
  test('translation', () => {
    const z = complex(1, 1);
    const result = applyMobiusTransformation(z, { 
      a: 1, 
      b: { re: 2, im: 0 }, 
      c: 0, 
      d: 1 
    });
    
    expect(result).not.toBeNull();
    expect((result as any).re).toBeCloseTo(3, 10);
    expect((result as any).im).toBeCloseTo(1, 10);
  });
  
  test('throws error for degenerate transformation', () => {
    const z = complex(1, 1);
    
    expect(() => {
      applyMobiusTransformation(z, { a: 1, b: 1, c: 1, d: 1 });
    }).toThrow('Degenerate Möbius transformation');
  });
});

describe('Cross-Ratio Preservation', () => {
  test('cross-ratio is preserved under Möbius transformation', () => {
    const z1 = complex(0, 0);
    const z2 = complex(1, 0);
    const z3 = complex(0, 1);
    const z4 = complex(1, 1);
    
    const originalCR = crossRatio(z1, z2, z3, z4);
    
    // Apply a simple translation Möbius transformation to all four points
    const params = { a: 1, b: { re: 2, im: 1 }, c: 0, d: 1 };
    const t1 = applyMobiusTransformation(z1, params);
    const t2 = applyMobiusTransformation(z2, params);
    const t3 = applyMobiusTransformation(z3, params);
    const t4 = applyMobiusTransformation(z4, params);
    
    const transformedCR = crossRatio(t1, t2, t3, t4);
    
    // Cross-ratio should be preserved (within numerical tolerance)
    expect((transformedCR as any).re).toBeCloseTo((originalCR as any).re, 3);
    expect((transformedCR as any).im).toBeCloseTo((originalCR as any).im, 3);
  });
});

describe('Sphere Point Transformation', () => {
  test('transforms point on sphere correctly', () => {
    const point = new Vector3(1, 0, 0);
    const params = { a: 1, b: 0, c: 0, d: 1 }; // Identity
    
    const result = transformSpherePoint(point, params);
    
    expect(result.x).toBeCloseTo(point.x, 5);
    expect(result.y).toBeCloseTo(point.y, 5);
    expect(result.z).toBeCloseTo(point.z, 5);
  });
  
  test('transformed point remains on unit sphere', () => {
    const point = new Vector3(0.5, 0.5, 0.707);
    point.normalize();
    
    const params = { a: { re: 0, im: 1 }, b: 1, c: 1, d: 0 };
    const result = transformSpherePoint(point, params);
    
    // Check that result is on unit sphere
    const length = Math.sqrt(result.x * result.x + result.y * result.y + result.z * result.z);
    expect(length).toBeCloseTo(1, 5);
  });
});

