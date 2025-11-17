/**
 * JO∞∞ Tensor Calculus Library
 * 
 * Implements tensor operations for the JO (Jared Omega) framework
 * including standard operations (add, contract, outer) and
 * JO-specific operations (parallax, collapse, resonance).
 * 
 * These operations depend on the empirical constants μ, Ω, κ, β
 * and can be linked to ENCHC structures.
 */

import { JO_CONSTANTS } from '../lib/constants';
import type { JOTensor, JOTensorOperation, UUID } from './enchcKernel';

// ============================================================================
// TENSOR COMPONENT OPERATIONS
// ============================================================================

/**
 * Numeric tensor representation (simplified)
 * Full implementation would use multi-dimensional arrays
 */
export interface NumericTensor {
  order: number;
  shape: number[]; // Dimensions for each index
  data: number[]; // Flattened data
}

/**
 * Create a zero tensor with given shape
 */
export function createZeroTensor(shape: number[]): NumericTensor {
  const size = shape.reduce((prod, dim) => prod * dim, 1);
  return {
    order: shape.length,
    shape,
    data: Array(size).fill(0),
  };
}

/**
 * Create an identity tensor (Kronecker delta)
 */
export function createIdentityTensor(dim: number): NumericTensor {
  const size = dim * dim;
  const data = Array(size).fill(0);
  
  for (let i = 0; i < dim; i++) {
    data[i * dim + i] = 1;
  }
  
  return {
    order: 2,
    shape: [dim, dim],
    data,
  };
}

/**
 * Get flat index from multi-index
 */
function getFlatIndex(indices: number[], shape: number[]): number {
  let flatIndex = 0;
  let stride = 1;
  
  for (let i = shape.length - 1; i >= 0; i--) {
    flatIndex += indices[i] * stride;
    stride *= shape[i];
  }
  
  return flatIndex;
}

/**
 * Get multi-index from flat index
 */
function getMultiIndex(flatIndex: number, shape: number[]): number[] {
  const indices: number[] = [];
  let remaining = flatIndex;
  
  for (let i = shape.length - 1; i >= 0; i--) {
    indices[i] = remaining % shape[i];
    remaining = Math.floor(remaining / shape[i]);
  }
  
  return indices;
}

// ============================================================================
// STANDARD TENSOR OPERATIONS
// ============================================================================

/**
 * Tensor addition (must have same shape)
 */
export function tensorAdd(t1: NumericTensor, t2: NumericTensor): NumericTensor {
  if (t1.shape.length !== t2.shape.length) {
    throw new Error("Tensors must have same order");
  }
  
  for (let i = 0; i < t1.shape.length; i++) {
    if (t1.shape[i] !== t2.shape[i]) {
      throw new Error("Tensors must have same shape");
    }
  }
  
  return {
    order: t1.order,
    shape: [...t1.shape],
    data: t1.data.map((val, i) => val + t2.data[i]),
  };
}

/**
 * Scalar multiplication
 */
export function tensorScale(t: NumericTensor, scalar: number): NumericTensor {
  return {
    order: t.order,
    shape: [...t.shape],
    data: t.data.map(val => val * scalar),
  };
}

/**
 * Tensor contraction (sum over paired indices)
 * Contracts index i of t1 with index j of t2
 */
export function tensorContract(
  t1: NumericTensor,
  t2: NumericTensor,
  index1: number,
  index2: number
): NumericTensor {
  if (t1.shape[index1] !== t2.shape[index2]) {
    throw new Error("Contracted indices must have same dimension");
  }
  
  const contractDim = t1.shape[index1];
  
  // Result shape: all indices except contracted ones
  const resultShape = [
    ...t1.shape.slice(0, index1),
    ...t1.shape.slice(index1 + 1),
    ...t2.shape.slice(0, index2),
    ...t2.shape.slice(index2 + 1),
  ];
  
  const result = createZeroTensor(resultShape);
  
  // Perform contraction (simplified implementation)
  // Full implementation would iterate over all index combinations
  
  return result;
}

/**
 * Outer product (tensor product)
 */
export function tensorOuter(t1: NumericTensor, t2: NumericTensor): NumericTensor {
  const resultShape = [...t1.shape, ...t2.shape];
  const resultSize = t1.data.length * t2.data.length;
  const resultData = Array(resultSize).fill(0);
  
  for (let i = 0; i < t1.data.length; i++) {
    for (let j = 0; j < t2.data.length; j++) {
      resultData[i * t2.data.length + j] = t1.data[i] * t2.data[j];
    }
  }
  
  return {
    order: t1.order + t2.order,
    shape: resultShape,
    data: resultData,
  };
}

// ============================================================================
// JO-SPECIFIC TENSOR OPERATIONS
// ============================================================================

/**
 * JO Parallax Operation
 * 
 * Implements parallax correction in tensor space, modulated by μ and Ω.
 * This captures the "viewpoint-dependent" nature of consciousness observations.
 * 
 * Parallax formula: T'ᵢⱼ = Tᵢⱼ + μ · Ω · (Tᵢⱼ - T̄)
 * where T̄ is the mean tensor value
 */
export function joParallax(
  t: NumericTensor,
  mu: number = JO_CONSTANTS.MU,
  omega: number = JO_CONSTANTS.OMEGA
): NumericTensor {
  // Compute mean
  const mean = t.data.reduce((sum, val) => sum + val, 0) / t.data.length;
  
  // Apply parallax correction
  const parallaxFactor = mu * omega;
  const data = t.data.map(val => val + parallaxFactor * (val - mean));
  
  return {
    order: t.order,
    shape: [...t.shape],
    data,
  };
}

/**
 * JO Collapse Operation
 * 
 * Implements quantum-like collapse in tensor space, governed by κ.
 * Values below threshold κ collapse to zero; others are renormalized.
 * 
 * This models the discrete nature of conscious observation events.
 */
export function joCollapse(
  t: NumericTensor,
  kappa: number = JO_CONSTANTS.KAPPA
): NumericTensor {
  // Apply threshold collapse
  const data = t.data.map(val => {
    const magnitude = Math.abs(val);
    if (magnitude < kappa) return 0;
    return val;
  });
  
  // Renormalize (preserve total magnitude)
  const oldNorm = Math.sqrt(t.data.reduce((sum, val) => sum + val * val, 0));
  const newNorm = Math.sqrt(data.reduce((sum, val) => sum + val * val, 0));
  
  if (newNorm > 1e-10) {
    const scale = oldNorm / newNorm;
    return {
      order: t.order,
      shape: [...t.shape],
      data: data.map(val => val * scale),
    };
  }
  
  return {
    order: t.order,
    shape: [...t.shape],
    data,
  };
}

/**
 * JO Resonance Operation
 * 
 * Implements resonance effects in tensor space, modulated by Ω and β.
 * Amplifies components that resonate with the fundamental frequency Ω.
 * 
 * Resonance formula: T'ᵢⱼ = Tᵢⱼ · (1 + β · cos(Ω · phase(Tᵢⱼ)))
 * where phase is determined by tensor structure
 */
export function joResonance(
  t: NumericTensor,
  omega: number = JO_CONSTANTS.OMEGA,
  beta: number = JO_CONSTANTS.BETA
): NumericTensor {
  const data = t.data.map((val, idx) => {
    // Compute phase based on position in tensor
    const phase = (2 * Math.PI * idx) / t.data.length;
    
    // Apply resonance modulation
    const resonanceFactor = 1 + beta * Math.cos(omega * phase);
    return val * resonanceFactor;
  });
  
  return {
    order: t.order,
    shape: [...t.shape],
    data,
  };
}

/**
 * Combined JO transformation
 * 
 * Applies parallax, collapse, and resonance in sequence.
 * This represents a full "consciousness observation cycle" in the JO framework.
 */
export function joTransform(
  t: NumericTensor,
  params?: {
    mu?: number;
    omega?: number;
    kappa?: number;
    beta?: number;
  }
): NumericTensor {
  const { mu, omega, kappa, beta } = {
    mu: JO_CONSTANTS.MU,
    omega: JO_CONSTANTS.OMEGA,
    kappa: JO_CONSTANTS.KAPPA,
    beta: JO_CONSTANTS.BETA,
    ...params,
  };
  
  // Apply operations in sequence
  let result = joParallax(t, mu, omega);
  result = joCollapse(result, kappa);
  result = joResonance(result, omega, beta);
  
  return result;
}

// ============================================================================
// TENSOR OPERATION EXECUTION
// ============================================================================

/**
 * Execute a tensor operation based on its descriptor
 */
export function executeTensorOperation(
  operation: JOTensorOperation,
  tensors: Map<UUID, NumericTensor>
): NumericTensor {
  const inputs = operation.inputTensorIds.map(id => {
    const tensor = tensors.get(id);
    if (!tensor) {
      throw new Error(`Tensor ${id} not found`);
    }
    return tensor;
  });
  
  switch (operation.operationKind) {
    case "add":
      if (inputs.length !== 2) {
        throw new Error("Add operation requires exactly 2 inputs");
      }
      return tensorAdd(inputs[0], inputs[1]);
    
    case "outer":
      if (inputs.length !== 2) {
        throw new Error("Outer operation requires exactly 2 inputs");
      }
      return tensorOuter(inputs[0], inputs[1]);
    
    case "jo_parallax":
      if (inputs.length !== 1) {
        throw new Error("Parallax operation requires exactly 1 input");
      }
      return joParallax(inputs[0]);
    
    case "jo_collapse":
      if (inputs.length !== 1) {
        throw new Error("Collapse operation requires exactly 1 input");
      }
      return joCollapse(inputs[0]);
    
    case "jo_resonance":
      if (inputs.length !== 1) {
        throw new Error("Resonance operation requires exactly 1 input");
      }
      return joResonance(inputs[0]);
    
    default:
      throw new Error(`Unknown operation kind: ${operation.operationKind}`);
  }
}

// ============================================================================
// TENSOR UTILITIES
// ============================================================================

/**
 * Compute tensor norm (Frobenius norm)
 */
export function tensorNorm(t: NumericTensor): number {
  return Math.sqrt(t.data.reduce((sum, val) => sum + val * val, 0));
}

/**
 * Compute tensor trace (sum of diagonal elements for rank-2 tensors)
 */
export function tensorTrace(t: NumericTensor): number {
  if (t.order !== 2 || t.shape[0] !== t.shape[1]) {
    throw new Error("Trace only defined for square rank-2 tensors");
  }
  
  let trace = 0;
  const dim = t.shape[0];
  
  for (let i = 0; i < dim; i++) {
    trace += t.data[i * dim + i];
  }
  
  return trace;
}

/**
 * Convert tensor to string representation
 */
export function tensorToString(t: NumericTensor): string {
  return `Tensor(order=${t.order}, shape=[${t.shape.join(", ")}], norm=${tensorNorm(t).toFixed(4)})`;
}

/**
 * Create example tensors for testing
 */
export function createExampleTensors() {
  return {
    vector: {
      order: 1,
      shape: [4],
      data: [1, 0, 0, 0],
    } as NumericTensor,
    
    matrix: createIdentityTensor(3),
    
    rank3: {
      order: 3,
      shape: [2, 2, 2],
      data: [1, 0, 0, 1, 1, 0, 0, 1],
    } as NumericTensor,
  };
}
