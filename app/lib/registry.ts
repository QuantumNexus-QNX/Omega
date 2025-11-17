/**
 * Mathematical Object Registry
 * 
 * Provides centralized management for all mathematical objects
 * in the ENCHC + JO framework, including:
 * - Higher categories and topoi
 * - Noncommutative objects
 * - Spectral triples
 * - Tensors and tensor operations
 * 
 * Supports serialization, querying, and cross-referencing.
 */

import {
  type ENCHCKernelState,
  type CohesiveTopos,
  type HigherCategory,
  type ENCHCNoncommutativeObject,
  type RepresentationHigherCategory,
  type ENCHCSpace,
  type JOTensor,
  type JOTensorOperation,
  type UUID,
  createEmptyKernelState,
  KernelMutators,
  serializeKernel,
  deserializeKernel,
} from './enchcKernel';

// ============================================================================
// REGISTRY CLASS
// ============================================================================

/**
 * Central registry for mathematical objects
 */
export class MathRegistry {
  private state: ENCHCKernelState;
  
  constructor(initialState?: ENCHCKernelState) {
    this.state = initialState || createEmptyKernelState();
  }
  
  // --------------------------------------------------------------------------
  // State Management
  // --------------------------------------------------------------------------
  
  getState(): ENCHCKernelState {
    return this.state;
  }
  
  setState(state: ENCHCKernelState): void {
    this.state = state;
  }
  
  reset(): void {
    this.state = createEmptyKernelState();
  }
  
  // --------------------------------------------------------------------------
  // Topoi
  // --------------------------------------------------------------------------
  
  addTopos(topos: CohesiveTopos): void {
    KernelMutators.addTopos(this.state, topos);
  }
  
  getTopos(id: UUID): CohesiveTopos | undefined {
    return this.state.topoi[id];
  }
  
  getAllTopoi(): CohesiveTopos[] {
    return Object.values(this.state.topoi);
  }
  
  // --------------------------------------------------------------------------
  // Higher Categories
  // --------------------------------------------------------------------------
  
  addHigherCategory(category: HigherCategory): void {
    KernelMutators.addHigherCategory(this.state, category);
  }
  
  getHigherCategory(id: UUID): HigherCategory | undefined {
    return this.state.higherCategories[id];
  }
  
  getAllHigherCategories(): HigherCategory[] {
    return Object.values(this.state.higherCategories);
  }
  
  // --------------------------------------------------------------------------
  // Noncommutative Objects
  // --------------------------------------------------------------------------
  
  addNCObject(obj: ENCHCNoncommutativeObject): void {
    KernelMutators.addNCObject(this.state, obj);
  }
  
  getNCObject(id: UUID): ENCHCNoncommutativeObject | undefined {
    return this.state.ncObjects[id];
  }
  
  getAllNCObjects(): ENCHCNoncommutativeObject[] {
    return Object.values(this.state.ncObjects);
  }
  
  getNCObjectsByTopos(toposId: UUID): ENCHCNoncommutativeObject[] {
    return this.getAllNCObjects().filter(obj => obj.toposId === toposId);
  }
  
  // --------------------------------------------------------------------------
  // Representation Categories
  // --------------------------------------------------------------------------
  
  addRepCategory(rep: RepresentationHigherCategory): void {
    KernelMutators.addRepCategory(this.state, rep);
  }
  
  getRepCategory(id: UUID): RepresentationHigherCategory | undefined {
    return this.state.repCategories[id];
  }
  
  getAllRepCategories(): RepresentationHigherCategory[] {
    return Object.values(this.state.repCategories);
  }
  
  // --------------------------------------------------------------------------
  // ENCHC Spaces
  // --------------------------------------------------------------------------
  
  addSpace(space: ENCHCSpace): void {
    KernelMutators.addSpace(this.state, space);
  }
  
  getSpace(id: UUID): ENCHCSpace | undefined {
    return this.state.spaces[id];
  }
  
  getAllSpaces(): ENCHCSpace[] {
    return Object.values(this.state.spaces);
  }
  
  getSpacesByTopos(toposId: UUID): ENCHCSpace[] {
    return this.getAllSpaces().filter(space => space.toposId === toposId);
  }
  
  // --------------------------------------------------------------------------
  // Tensors
  // --------------------------------------------------------------------------
  
  addTensor(tensor: JOTensor): void {
    KernelMutators.addTensor(this.state, tensor);
  }
  
  getTensor(id: UUID): JOTensor | undefined {
    return this.state.tensors[id];
  }
  
  getAllTensors(): JOTensor[] {
    return Object.values(this.state.tensors);
  }
  
  getTensorsBySpace(spaceId: UUID): JOTensor[] {
    return this.getAllTensors().filter(
      tensor => tensor.dependence?.enchcSpaceId === spaceId
    );
  }
  
  // --------------------------------------------------------------------------
  // Tensor Operations
  // --------------------------------------------------------------------------
  
  addTensorOperation(op: JOTensorOperation): void {
    KernelMutators.addTensorOperation(this.state, op);
  }
  
  getTensorOperation(id: UUID): JOTensorOperation | undefined {
    return this.state.tensorOps[id];
  }
  
  getAllTensorOperations(): JOTensorOperation[] {
    return Object.values(this.state.tensorOps);
  }
  
  // --------------------------------------------------------------------------
  // Serialization
  // --------------------------------------------------------------------------
  
  serialize(): string {
    return serializeKernel(this.state);
  }
  
  static deserialize(json: string): MathRegistry {
    const state = deserializeKernel(json);
    return new MathRegistry(state);
  }
  
  // --------------------------------------------------------------------------
  // Statistics
  // --------------------------------------------------------------------------
  
  getStatistics() {
    return {
      topoi: Object.keys(this.state.topoi).length,
      higherCategories: Object.keys(this.state.higherCategories).length,
      ncObjects: Object.keys(this.state.ncObjects).length,
      repCategories: Object.keys(this.state.repCategories).length,
      spaces: Object.keys(this.state.spaces).length,
      tensors: Object.keys(this.state.tensors).length,
      tensorOps: Object.keys(this.state.tensorOps).length,
    };
  }
}

// ============================================================================
// GLOBAL REGISTRY INSTANCE
// ============================================================================

/**
 * Global singleton registry instance
 * Can be imported and used throughout the application
 */
export const globalRegistry = new MathRegistry();

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generate a simple UUID (for demo purposes)
 * In production, use a proper UUID library
 */
export function generateUUID(): UUID {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create a basic MathMeta object
 */
export function createMathMeta(
  name: string,
  description?: string,
  tags?: string[]
) {
  return {
    id: generateUUID(),
    name,
    description,
    tags,
    version: "1.0.0",
  };
}
