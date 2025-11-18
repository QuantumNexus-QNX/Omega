// app/math/enchcKernel.ts
// Jared Ω ENCHC + JO Tensor Kernel
// Grounded in:
// - ENCHC white paper (Extended Noncommutative Cohesive Higher Categories) §2–4
// - Tier 1 formalization of μ, ω, κ, JIE, and emergent simulation architecture
//   (Jared10125mathematicsformal.md “TIER 1 FORMALIZATION: BEGIN”, I1, I2, I3)

// =========================
// 0. GLOBAL CONSTANTS
// =========================

export const MU = 0.569;          // Equilibrium ratio <J>/<I> at critical point
export const OMEGA_HZ = 0.847;    // Resonance frequency in Hz
export const OMEGA_RAD = 2 * Math.PI * OMEGA_HZ;
export const KAPPA = (MU * MU) / 10; // κ = μ^2 / 10 ≈ 0.0323 (collapse threshold)
export const BETA_RES = Math.log(OMEGA_HZ) / Math.log(MU); // β_res from Tier-1

export const KERNEL_SCHEMA_VERSION = "2.1.0-ENCHC-JO";

// UUID alias (string is fine; you can replace with zod/ulid later)
export type UUID = string;

// =========================
// 1. SHARED METADATA
// =========================

export interface KernelMeta {
  id: UUID;
  name: string;
  description?: string;
  tags?: string[];
  // Reference back into your docs (“ENCHC §3.4 Def 2”, “Tier1 I3 Collapse Theorem”)
  sourceRefs?: string[];
}

// =========================
// 2. SPECTRAL TRIPLES (NCG)
// =========================
// (A, H, D) for finite Markov / matrix models, as in your basin separation bound. 

export interface SpectralTriple {
  meta: KernelMeta;

  // Algebra A: represented as n×n matrices acting on H
  hilbertDim: number;
  // Optional raw matrix data for WASM or CPU backends
  generatorMatrix?: number[][];   // L^sym or similar
  diracEigenvalues?: number[];    // d_i = 1/(ε + λ_i)
  epsilon?: number;               // regularization ε
  lambdaMax?: number;             // max eigenvalue of L^sym

  // Optional precomputed quantities for distance bounds
  interBasinGapDelta?: number;    // Δ
  basinLabels?: number[];         // partition S = B1 ∪ B2 via labels
}

// =========================
// 3. COHESIVE (∞,1)-TOPOS
// =========================
// Adjoint quadruple Π ⊣ Disc ⊣ Γ ⊣ Codisc.  [oai_citation:1‡Extended Noncommutative Cohesive Higher Categories (ENCHC) white paper with additional sources](https://docs.google.com/document/d/1ZGG_twNmDjELGskhmqC-HRTGnTxvlutvmyKML9SWBLc)

export type FunctorVariance = "covariant" | "contravariant";

export interface CohesiveFunctor {
  meta: KernelMeta;
  sourceCategoryId: UUID;
  targetCategoryId: UUID;
  // human-readable description, e.g. “shape”, “discrete”, “global sections”
  role: "Pi" | "Disc" | "Gamma" | "Codisc" | "Other";
  variance?: FunctorVariance;
  lawText?: string;      // short axiom snippet
}

export interface CohesiveTopos {
  meta: KernelMeta;
  // internal ID for the ambient (∞,1)-topos of “spaces”
  ambientCategoryId: UUID;

  cohesionFunctors: {
    Pi: CohesiveFunctor;
    Disc: CohesiveFunctor;
    Gamma: CohesiveFunctor;
    Codisc: CohesiveFunctor;
  };

  // e.g. “smooth ∞-groupoids”, “structured presheaves on NC spectra”
  geometricInterpretation?: string;
}

// =========================
// 4. NONCOMMUTATIVE OBJECTS
// =========================
// Objects of the ENCHC are NC algebras with attached spectral data.  [oai_citation:2‡Extended Noncommutative Cohesive Higher Categories (ENCHC) white paper with additional sources](https://docs.google.com/document/d/1ZGG_twNmDjELGskhmqC-HRTGnTxvlutvmyKML9SWBLc)

export type NCAlgebraType =
  | "matrix"
  | "quantum_torus"
  | "Cstar"
  | "von_Neumann"
  | "other";

export interface NCAlgebraObject {
  meta: KernelMeta;
  toposId: UUID;               // lives as an object internal to a cohesive topos
  algebraType: NCAlgebraType;

  // Minimal invariants / parameters
  parameters?: Record<string, number | string>;
  spectralTriple?: SpectralTriple;
}

// =========================
// 5. REP CATEGORIES & HIGHER CATS
// =========================

export interface HigherMorph {
  id: UUID;
  sourceId: UUID;
  targetId: UUID;
  level: number; // 1 = 1-morphisms, 2 = 2-morphisms, etc.
  meta: KernelMeta;
}

export interface HigherObject {
  id: UUID;
  level: number; // 0 = objects, 1 = 1-cells-as-objects, etc.
  meta: KernelMeta;
}

export interface HigherCategory {
  meta: KernelMeta;
  objects: HigherObject[];
  morphisms: HigherMorph[];
  // Optional additional structure: enrichment, monoidal product, etc.
  structureFlags?: {
    monoidal?: boolean;
    symmetricMonoidal?: boolean;
    dagger?: boolean;
    cartesianClosed?: boolean;
  };
}

export interface RepresentationCategory {
  meta: KernelMeta;
  baseNCObjectId: UUID;     // A_nc being represented
  higherCatId: UUID;        // id of internal higher category of reps
  fiberDescription?: string;
}

// =========================
// 6. JO TENSORS & QCNL
// =========================
// These encode coherence / tri-logic dynamics on networks. 

export type JOTensorRole =
  | "coherence"
  | "transition"
  | "collapse"
  | "measurement"
  | "other";

export interface JOTensor {
  meta: KernelMeta;
  role: JOTensorRole;

  // Abstract index notation: e.g. C_{ijk}, T^i_{jk}, etc.
  indexSignature?: string;

  // Compact numerical representation (flattened) for small systems
  components?: number[];

  // Dimensionality for reshaping components
  shape?: number[]; // e.g. [n, n] or [n, n, n]

  // Additional JO-specific metadata (μ, κ, ω associations)
  joMetadata?: {
    mu?: number;
    kappa?: number;
    omega?: number;
    betaRes?: number;
  };
}

// =========================
// 7. ENCHC “SPACE” OBJECT
// =========================
// This is your Def. 3.4 style triple: (cohesive topos, NC object, rep category)
// plus possibly a relational topos for game interactions.  [oai_citation:3‡Extended Noncommutative Cohesive Higher Categories (ENCHC) white paper with additional sources](https://docs.google.com/document/d/1ZGG_twNmDjELGskhmqC-HRTGnTxvlutvmyKML9SWBLc)

export interface ENCHCSpace {
  meta: KernelMeta;

  toposId: UUID;
  ncObjectId: UUID;
  repCategoryId: UUID;

  // Optional link to a “relational topos of games” modeling strategy profiles
  relationalToposId?: UUID;

  // Optional physical interpretation layer (used by UI)
  physicalInterpretation?: {
    role?: string;           // e.g. “quantum spacetime patch”, “cognitive manifold”
    scale?: string;          // “Planck”, “neural”, “psychometric”, etc.
    observables?: string[];  // e.g. “J, I, E”, “tri-logic node states”
  };
}

// =========================
// 8. KERNEL STATE
// =========================

export interface ENCHCKernelState {
  schemaVersion: string;
  topoi: Record<UUID, CohesiveTopos>;
  ncObjects: Record<UUID, NCAlgebraObject>;
  repCategories: Record<UUID, RepresentationCategory>;
  higherCategories: Record<UUID, HigherCategory>;
  spaces: Record<UUID, ENCHCSpace>;
  tensors: Record<UUID, JOTensor>;
}

export const createEmptyKernelState = (): ENCHCKernelState => ({
  schemaVersion: KERNEL_SCHEMA_VERSION,
  topoi: {},
  ncObjects: {},
  repCategories: {},
  higherCategories: {},
  spaces: {},
  tensors: {},
});

// =========================
// 9. MUTATORS
// =========================

export const KernelMutators = {
  addTopos(
    state: ENCHCKernelState,
    topos: CohesiveTopos
  ): ENCHCKernelState {
    return {
      ...state,
      topoi: { ...state.topoi, [topos.meta.id]: topos },
    };
  },

  addNCObject(
    state: ENCHCKernelState,
    obj: NCAlgebraObject
  ): ENCHCKernelState {
    return {
      ...state,
      ncObjects: { ...state.ncObjects, [obj.meta.id]: obj },
    };
  },

  addRepCategory(
    state: ENCHCKernelState,
    rep: RepresentationCategory
  ): ENCHCKernelState {
    return {
      ...state,
      repCategories: { ...state.repCategories, [rep.meta.id]: rep },
    };
  },

  addHigherCategory(
    state: ENCHCKernelState,
    cat: HigherCategory
  ): ENCHCKernelState {
    return {
      ...state,
      higherCategories: { ...state.higherCategories, [cat.meta.id]: cat },
    };
  },

  addSpace(
    state: ENCHCKernelState,
    space: ENCHCSpace
  ): ENCHCKernelState {
    return {
      ...state,
      spaces: { ...state.spaces, [space.meta.id]: space },
    };
  },

  addTensor(
    state: ENCHCKernelState,
    tensor: JOTensor
  ): ENCHCKernelState {
    return {
      ...state,
      tensors: { ...state.tensors, [tensor.meta.id]: tensor },
    };
  },
};

// =========================
// 10. VALIDATORS
// =========================

export const KernelValidators = {
  validateSpace(state: ENCHCKernelState, spaceId: UUID): string[] {
    const errors: string[] = [];
    const space = state.spaces[spaceId];
    if (!space) return ["Space not found"];

    if (!state.topoi[space.toposId]) {
      errors.push(`Topos ${space.toposId} not found`);
    }
    if (!state.ncObjects[space.ncObjectId]) {
      errors.push(`NC object ${space.ncObjectId} not found`);
    }
    if (!state.repCategories[space.repCategoryId]) {
      errors.push(`Rep category ${space.repCategoryId} not found`);
    }
    if (
      space.relationalToposId &&
      !state.topoi[space.relationalToposId]
    ) {
      errors.push(`Relational topos ${space.relationalToposId} not found`);
    }
    return errors;
  },

  validateCohesion(topos: CohesiveTopos): string[] {
    const errors: string[] = [];
    const { Pi, Disc, Gamma, Codisc } = topos.cohesionFunctors;

    // Very simple structural checks; you can add richer ones later
    if (Pi.targetCategoryId !== Disc.sourceCategoryId) {
      errors.push("Π ⊣ Disc adjacency mismatch (target(Π) ≠ source(Disc))");
    }
    if (Disc.targetCategoryId !== Gamma.sourceCategoryId) {
      errors.push("Disc ⊣ Γ adjacency mismatch");
    }
    if (Gamma.targetCategoryId !== Codisc.sourceCategoryId) {
      errors.push("Γ ⊣ Codisc adjacency mismatch");
    }
    return errors;
  },
};

// =========================
// 11. EXPORTERS FOR UI
// =========================

export const KernelExporters = {
  // D3-style graph from a higher category
  toD3Graph(cat: HigherCategory): { nodes: any[]; links: any[] } {
    return {
      nodes: cat.objects.map((obj) => ({
        id: obj.id,
        label: obj.meta.name,
        level: obj.level,
      })),
      links: cat.morphisms.map((m) => ({
        id: m.id,
        source: m.sourceId,
        target: m.targetId,
        label: m.meta.name,
        level: m.level,
      })),
    };
  },

  // Coherence matrix for QCNL-type networks (fallback analytic model)
  toCoherenceMatrix(tensor: JOTensor, network: HigherCategory): number[][] {
    const n = network.objects.length;
    const mat = Array.from({ length: n }, () =>
      Array.from({ length: n }, () => 0)
    );

    // If components are present and shape=[n,n], use them
    if (tensor.components && tensor.shape?.length === 2) {
      const [rows, cols] = tensor.shape;
      if (rows === n && cols === n) {
        for (let i = 0; i < n; i++) {
          for (let j = 0; j < n; j++) {
            mat[i][j] = tensor.components[i * n + j] ?? 0;
          }
        }
        return mat;
      }
    }

    // Otherwise: generic decaying coherence by “distance” in index
    for (let i = 0; i < n; i++) {
      mat[i][i] = 1.0;
      for (let j = i + 1; j < n; j++) {
        const distance = Math.abs(i - j);
        const coherence = Math.exp(-0.1 * distance);
        mat[i][j] = mat[j][i] = coherence;
      }
    }
    return mat;
  },
};

// =========================
// 12. SEED EXAMPLES
// =========================

// Simple deterministic id helper for now
const id = (suffix: string): UUID => `enchc::${suffix}`;

export const seedQuantumTorusSpace = (): ENCHCKernelState => {
  let state = createEmptyKernelState();

  // 12.1 Cohesive topos: smooth ∞-groupoids
  const smoothToposId = id("topos.smoothInfGrpd");
  const smoothTopos: CohesiveTopos = {
    meta: {
      id: smoothToposId,
      name: "Smooth ∞-Groupoids",
      description:
        "Cohesive (∞,1)-topos of smooth ∞-groupoids modeling quantum geometric backgrounds.",
      sourceRefs: ["ENCHC §3.1–3.3"],
    },
    ambientCategoryId: smoothToposId, // self-reference is fine at this abstraction layer
    cohesionFunctors: {
      Pi: {
        meta: {
          id: id("functor.Pi"),
          name: "Π (Shape)",
        },
        sourceCategoryId: smoothToposId,
        targetCategoryId: smoothToposId,
        role: "Pi",
        variance: "covariant",
      },
      Disc: {
        meta: {
          id: id("functor.Disc"),
          name: "Disc (Discrete Embedding)",
        },
        sourceCategoryId: smoothToposId,
        targetCategoryId: smoothToposId,
        role: "Disc",
        variance: "covariant",
      },
      Gamma: {
        meta: {
          id: id("functor.Gamma"),
          name: "Γ (Global Sections)",
        },
        sourceCategoryId: smoothToposId,
        targetCategoryId: smoothToposId,
        role: "Gamma",
        variance: "covariant",
      },
      Codisc: {
        meta: {
          id: id("functor.Codisc"),
          name: "Codisc (Co-Discrete)",
        },
        sourceCategoryId: smoothToposId,
        targetCategoryId: smoothToposId,
        role: "Codisc",
        variance: "covariant",
      },
    },
    geometricInterpretation: "Smooth cohesive background for NC quantum spaces.",
  };

  state = KernelMutators.addTopos(state, smoothTopos);

  // 12.2 Quantum torus A_θ^∞ as NC algebra object
  const qtId = id("nc.quantumTorus");
  const qtSpectral: SpectralTriple = {
    meta: {
      id: id("spectral.quantumTorus"),
      name: "Spectral Triple for Smooth Quantum Torus",
      sourceRefs: ["ENCHC §3.4 (Quantum torus example)"],
    },
    hilbertDim: 0, // symbolic — your WASM backend fills concrete matrices
    epsilon: 0.01,
  };

  const qtObject: NCAlgebraObject = {
    meta: {
      id: qtId,
      name: "A_θ^∞ (Smooth Quantum Torus)",
      description:
        "Smooth noncommutative torus with dense *-subalgebra and spectral triple.",
      sourceRefs: ["ENCHC §3.4"],
      tags: ["quantum_torus", "NCG"],
    },
    toposId: smoothToposId,
    algebraType: "quantum_torus",
    parameters: {
      theta: "irrational", // symbolic; concrete θ can be plugged later
    },
    spectralTriple: qtSpectral,
  };

  state = KernelMutators.addNCObject(state, qtObject);

  // 12.3 Representation category skeleton
  const repCatId = id("rep.quantumTorus");
  const repCat: RepresentationCategory = {
    meta: {
      id: repCatId,
      name: "Rep(A_θ^∞)",
      description: "Higher category of *-representations of the smooth quantum torus.",
      sourceRefs: ["ENCHC §3.4"],
    },
    baseNCObjectId: qtId,
    higherCatId: id("higherCat.rep.quantumTorus"),
    fiberDescription: "∞-categorical bundle of Hilbert space representations.",
  };

  // Minimal higher category stub
  const repHigher: HigherCategory = {
    meta: {
      id: repCat.higherCatId,
      name: "Rep(A_θ^∞) Higher Category",
    },
    objects: [],
    morphisms: [],
    structureFlags: {
      monoidal: true,
      dagger: true,
    },
  };

  state = KernelMutators.addHigherCategory(state, repHigher);
  state = KernelMutators.addRepCategory(state, repCat);

  // 12.4 ENCHC space tying all of this together
  const spaceId = id("space.quantumTorus");
  const space: ENCHCSpace = {
    meta: {
      id: spaceId,
      name: "Quantum Torus ENCHC Space",
      description:
        "Prototype ENCHC object: NC quantum torus internal to a cohesive ∞-topos with attached representation theory.",
    },
    toposId: smoothToposId,
    ncObjectId: qtId,
    repCategoryId: repCatId,
    physicalInterpretation: {
      role: "Quantum geometric patch",
      scale: "Planck-ish (model)",
      observables: ["NC coordinates", "spectral distances"],
    },
  };

  state = KernelMutators.addSpace(state, space);

  return state;
};

// Example QCNL / JO-tensor seed could be a sibling function:
// export const seedQCNLNetwork = (): ENCHCKernelState => { ... }
// wired to the tri-logic network + collapse criterion from Tier-1.