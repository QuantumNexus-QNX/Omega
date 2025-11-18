'use client';

/**
 * ENCHC (Extended Noncommutative Cohesive Higher Categories) Explorer
 * 
 * Interactive visualization and exploration of:
 * - Cohesive (∞,1)-topoi with adjoint quadruples Π ⊣ Disc ⊣ Γ ⊣ Codisc
 * - Noncommutative algebra objects with spectral triples
 * - Representation categories and higher morphisms
 * - JO tensors and coherence structures
 * - ENCHC spaces (topos, NC object, rep category triples)
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  createEmptyKernelState,
  seedQuantumTorusSpace,
  KernelMutators,
  KernelValidators,
  KernelExporters,
  type ENCHCKernelState,
  type ENCHCSpace,
  type CohesiveTopos,
  type NCAlgebraObject,
  type RepresentationCategory,
  type JOTensor,
  type HigherCategory,
  MU,
  OMEGA_HZ,
  KAPPA,
  BETA_RES,
} from '../math/enchcKernel';

export default function ENCHCPage() {
  const [kernelState, setKernelState] = useState<ENCHCKernelState>(() => seedQuantumTorusSpace());
  const [selectedTab, setSelectedTab] = useState<'spaces' | 'topoi' | 'objects' | 'tensors'>('spaces');
  const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>(null);

  const spaces = useMemo(() => Object.values(kernelState.spaces), [kernelState.spaces]);
  const topoi = useMemo(() => Object.values(kernelState.topoi), [kernelState.topoi]);
  const ncObjects = useMemo(() => Object.values(kernelState.ncObjects), [kernelState.ncObjects]);
  const tensors = useMemo(() => Object.values(kernelState.tensors), [kernelState.tensors]);

  const selectedSpace = selectedSpaceId ? kernelState.spaces[selectedSpaceId] : null;
  const validationErrors = selectedSpaceId 
    ? KernelValidators.validateSpace(kernelState, selectedSpaceId)
    : [];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-cyan-500/20 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Trivector.ai
              </Link>
              <p className="text-sm text-gray-400 mt-1">ENCHC Framework Explorer</p>
            </div>
            <Link 
              href="/consciousness"
              className="px-4 py-2 rounded-lg border border-cyan-500/30 hover:border-cyan-500/60 transition-colors text-sm"
            >
              ← Back to Framework
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* JO Constants Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-6 rounded-lg border border-purple-500/20 bg-purple-500/5"
        >
          <h2 className="text-lg font-semibold mb-4 text-purple-300">JO Framework Constants</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-gray-400">μ (Equilibrium)</div>
              <div className="text-2xl font-mono text-cyan-400">{MU.toFixed(3)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Ω (Resonance Hz)</div>
              <div className="text-2xl font-mono text-purple-400">{OMEGA_HZ.toFixed(3)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">κ (Collapse)</div>
              <div className="text-2xl font-mono text-pink-400">{KAPPA.toFixed(4)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">β (Scaling)</div>
              <div className="text-2xl font-mono text-green-400">{BETA_RES.toFixed(3)}</div>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 border-b border-gray-800">
          {(['spaces', 'topoi', 'objects', 'tensors'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-6 py-3 font-medium transition-colors capitalize ${
                selectedTab === tab
                  ? 'text-cyan-400 border-b-2 border-cyan-400'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - List */}
          <div className="lg:col-span-1">
            <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-4">
              <h3 className="text-lg font-semibold mb-4 text-cyan-300">
                {selectedTab === 'spaces' && `ENCHC Spaces (${spaces.length})`}
                {selectedTab === 'topoi' && `Cohesive Topoi (${topoi.length})`}
                {selectedTab === 'objects' && `NC Objects (${ncObjects.length})`}
                {selectedTab === 'tensors' && `JO Tensors (${tensors.length})`}
              </h3>

              <div className="space-y-2">
                {selectedTab === 'spaces' && spaces.map((space) => (
                  <motion.button
                    key={space.meta.id}
                    onClick={() => setSelectedSpaceId(space.meta.id)}
                    whileHover={{ scale: 1.02 }}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedSpaceId === space.meta.id
                        ? 'border-cyan-500 bg-cyan-500/10'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <div className="font-medium text-white">{space.meta.name}</div>
                    <div className="text-xs text-gray-400 mt-1">{space.meta.description}</div>
                  </motion.button>
                ))}

                {selectedTab === 'topoi' && topoi.map((topos) => (
                  <div
                    key={topos.meta.id}
                    className="p-3 rounded-lg border border-purple-500/20 bg-purple-500/5"
                  >
                    <div className="font-medium text-purple-300">{topos.meta.name}</div>
                    <div className="text-xs text-gray-400 mt-1">{topos.geometricInterpretation}</div>
                  </div>
                ))}

                {selectedTab === 'objects' && ncObjects.map((obj) => (
                  <div
                    key={obj.meta.id}
                    className="p-3 rounded-lg border border-pink-500/20 bg-pink-500/5"
                  >
                    <div className="font-medium text-pink-300">{obj.meta.name}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      Type: {obj.algebraType}
                    </div>
                    {obj.meta.tags && (
                      <div className="flex gap-1 mt-2">
                        {obj.meta.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-0.5 rounded bg-pink-500/20 text-pink-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {selectedTab === 'tensors' && tensors.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    No tensors in current state
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Details */}
          <div className="lg:col-span-2">
            {selectedTab === 'spaces' && selectedSpace && (
              <SpaceDetails
                space={selectedSpace}
                topos={kernelState.topoi[selectedSpace.toposId]}
                ncObject={kernelState.ncObjects[selectedSpace.ncObjectId]}
                repCategory={kernelState.repCategories[selectedSpace.repCategoryId]}
                validationErrors={validationErrors}
              />
            )}

            {selectedTab === 'spaces' && !selectedSpace && (
              <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-8 text-center text-gray-500">
                Select an ENCHC space to view details
              </div>
            )}

            {selectedTab === 'topoi' && topoi.length > 0 && (
              <ToposDetails topos={topoi[0]} />
            )}

            {selectedTab === 'objects' && ncObjects.length > 0 && (
              <NCObjectDetails object={ncObjects[0]} />
            )}

            {selectedTab === 'tensors' && (
              <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-8 text-center text-gray-500">
                Tensor visualization coming soon
              </div>
            )}
          </div>
        </div>

        {/* Navigation Footer */}
        <div className="mt-12 flex gap-4 justify-center">
          <Link
            href="/spectral"
            className="px-6 py-3 rounded-lg border border-cyan-500/30 hover:border-cyan-500/60 transition-colors"
          >
            Spectral Triple →
          </Link>
          <Link
            href="/trilogic"
            className="px-6 py-3 rounded-lg border border-purple-500/30 hover:border-purple-500/60 transition-colors"
          >
            Tri-Logic →
          </Link>
          <Link
            href="/console"
            className="px-6 py-3 rounded-lg border border-pink-500/30 hover:border-pink-500/60 transition-colors"
          >
            Parameter Console →
          </Link>
        </div>
      </main>
    </div>
  );
}

// Component: Space Details
function SpaceDetails({
  space,
  topos,
  ncObject,
  repCategory,
  validationErrors,
}: {
  space: ENCHCSpace;
  topos?: CohesiveTopos;
  ncObject?: NCAlgebraObject;
  repCategory?: RepresentationCategory;
  validationErrors: string[];
}) {
  return (
    <div className="space-y-6">
      {/* Validation Status */}
      {validationErrors.length > 0 ? (
        <div className="p-4 rounded-lg border border-red-500/50 bg-red-500/10">
          <div className="font-semibold text-red-400 mb-2">⚠ Validation Errors</div>
          <ul className="text-sm text-red-300 space-y-1">
            {validationErrors.map((err, i) => (
              <li key={i}>• {err}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="p-4 rounded-lg border border-green-500/50 bg-green-500/10">
          <div className="text-green-400">✓ Space is valid</div>
        </div>
      )}

      {/* Space Info */}
      <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-6">
        <h3 className="text-xl font-semibold mb-4 text-cyan-300">{space.meta.name}</h3>
        <p className="text-gray-300 mb-4">{space.meta.description}</p>

        {space.physicalInterpretation && (
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-400">Role:</span>{' '}
              <span className="text-white">{space.physicalInterpretation.role}</span>
            </div>
            <div>
              <span className="text-gray-400">Scale:</span>{' '}
              <span className="text-white">{space.physicalInterpretation.scale}</span>
            </div>
            {space.physicalInterpretation.observables && (
              <div>
                <span className="text-gray-400">Observables:</span>{' '}
                <span className="text-white">
                  {space.physicalInterpretation.observables.join(', ')}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Topos */}
      {topos && (
        <div className="rounded-lg border border-purple-500/20 bg-purple-500/5 p-6">
          <h4 className="text-lg font-semibold mb-3 text-purple-300">Cohesive Topos</h4>
          <div className="text-white font-medium mb-2">{topos.meta.name}</div>
          <div className="text-sm text-gray-300 mb-4">{topos.geometricInterpretation}</div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="p-2 rounded bg-purple-500/10">
              <div className="text-purple-400 font-medium">Π (Shape)</div>
              <div className="text-gray-400 text-xs">{topos.cohesionFunctors.Pi.meta.name}</div>
            </div>
            <div className="p-2 rounded bg-purple-500/10">
              <div className="text-purple-400 font-medium">Disc</div>
              <div className="text-gray-400 text-xs">{topos.cohesionFunctors.Disc.meta.name}</div>
            </div>
            <div className="p-2 rounded bg-purple-500/10">
              <div className="text-purple-400 font-medium">Γ (Sections)</div>
              <div className="text-gray-400 text-xs">{topos.cohesionFunctors.Gamma.meta.name}</div>
            </div>
            <div className="p-2 rounded bg-purple-500/10">
              <div className="text-purple-400 font-medium">Codisc</div>
              <div className="text-gray-400 text-xs">{topos.cohesionFunctors.Codisc.meta.name}</div>
            </div>
          </div>
        </div>
      )}

      {/* NC Object */}
      {ncObject && (
        <div className="rounded-lg border border-pink-500/20 bg-pink-500/5 p-6">
          <h4 className="text-lg font-semibold mb-3 text-pink-300">Noncommutative Object</h4>
          <div className="text-white font-medium mb-2">{ncObject.meta.name}</div>
          <div className="text-sm text-gray-300 mb-4">{ncObject.meta.description}</div>

          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-400">Algebra Type:</span>{' '}
              <span className="text-white">{ncObject.algebraType}</span>
            </div>
            {ncObject.parameters && (
              <div>
                <span className="text-gray-400">Parameters:</span>{' '}
                <span className="text-white font-mono">
                  {JSON.stringify(ncObject.parameters)}
                </span>
              </div>
            )}
            {ncObject.spectralTriple && (
              <div className="mt-3 p-3 rounded bg-pink-500/10">
                <div className="text-pink-400 font-medium mb-2">Spectral Triple</div>
                <div className="text-xs space-y-1">
                  <div>Hilbert Dim: {ncObject.spectralTriple.hilbertDim || 'symbolic'}</div>
                  {ncObject.spectralTriple.epsilon && (
                    <div>ε: {ncObject.spectralTriple.epsilon}</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Rep Category */}
      {repCategory && (
        <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-6">
          <h4 className="text-lg font-semibold mb-3 text-green-300">Representation Category</h4>
          <div className="text-white font-medium mb-2">{repCategory.meta.name}</div>
          <div className="text-sm text-gray-300">{repCategory.meta.description}</div>
          {repCategory.fiberDescription && (
            <div className="text-sm text-gray-400 mt-2">{repCategory.fiberDescription}</div>
          )}
        </div>
      )}
    </div>
  );
}

// Component: Topos Details
function ToposDetails({ topos }: { topos: CohesiveTopos }) {
  const errors = KernelValidators.validateCohesion(topos);

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-6">
        <h3 className="text-xl font-semibold mb-4 text-purple-300">{topos.meta.name}</h3>
        <p className="text-gray-300 mb-4">{topos.meta.description}</p>
        <div className="text-sm text-gray-400">{topos.geometricInterpretation}</div>
      </div>

      {/* Cohesion Diagram */}
      <div className="rounded-lg border border-purple-500/20 bg-purple-500/5 p-6">
        <h4 className="text-lg font-semibold mb-4 text-purple-300">Adjoint Quadruple</h4>
        <div className="flex items-center justify-center gap-4 text-sm">
          <div className="text-center">
            <div className="px-4 py-2 rounded bg-purple-500/20 text-purple-300 font-mono">Π</div>
            <div className="text-xs text-gray-400 mt-1">Shape</div>
          </div>
          <div className="text-purple-400">⊣</div>
          <div className="text-center">
            <div className="px-4 py-2 rounded bg-purple-500/20 text-purple-300 font-mono">Disc</div>
            <div className="text-xs text-gray-400 mt-1">Discrete</div>
          </div>
          <div className="text-purple-400">⊣</div>
          <div className="text-center">
            <div className="px-4 py-2 rounded bg-purple-500/20 text-purple-300 font-mono">Γ</div>
            <div className="text-xs text-gray-400 mt-1">Sections</div>
          </div>
          <div className="text-purple-400">⊣</div>
          <div className="text-center">
            <div className="px-4 py-2 rounded bg-purple-500/20 text-purple-300 font-mono">Codisc</div>
            <div className="text-xs text-gray-400 mt-1">Co-Discrete</div>
          </div>
        </div>
      </div>

      {/* Validation */}
      {errors.length > 0 ? (
        <div className="p-4 rounded-lg border border-red-500/50 bg-red-500/10">
          <div className="font-semibold text-red-400 mb-2">⚠ Cohesion Errors</div>
          <ul className="text-sm text-red-300 space-y-1">
            {errors.map((err, i) => (
              <li key={i}>• {err}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="p-4 rounded-lg border border-green-500/50 bg-green-500/10">
          <div className="text-green-400">✓ Cohesion axioms satisfied</div>
        </div>
      )}
    </div>
  );
}

// Component: NC Object Details
function NCObjectDetails({ object }: { object: NCAlgebraObject }) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-6">
        <h3 className="text-xl font-semibold mb-4 text-pink-300">{object.meta.name}</h3>
        <p className="text-gray-300 mb-4">{object.meta.description}</p>

        <div className="space-y-3 text-sm">
          <div>
            <span className="text-gray-400">Algebra Type:</span>{' '}
            <span className="text-white font-mono">{object.algebraType}</span>
          </div>

          {object.parameters && (
            <div>
              <span className="text-gray-400">Parameters:</span>
              <pre className="mt-2 p-3 rounded bg-black/50 text-pink-300 font-mono text-xs overflow-x-auto">
                {JSON.stringify(object.parameters, null, 2)}
              </pre>
            </div>
          )}

          {object.meta.tags && (
            <div>
              <span className="text-gray-400">Tags:</span>
              <div className="flex gap-2 mt-2">
                {object.meta.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 rounded bg-pink-500/20 text-pink-300 text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {object.meta.sourceRefs && (
            <div>
              <span className="text-gray-400">References:</span>
              <ul className="mt-2 space-y-1 text-xs text-gray-300">
                {object.meta.sourceRefs.map((ref, i) => (
                  <li key={i}>• {ref}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {object.spectralTriple && (
        <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-6">
          <h4 className="text-lg font-semibold mb-4 text-cyan-300">Spectral Triple (A, H, D)</h4>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-400">Hilbert Dimension:</span>{' '}
              <span className="text-white font-mono">
                {object.spectralTriple.hilbertDim || 'symbolic'}
              </span>
            </div>
            {object.spectralTriple.epsilon && (
              <div>
                <span className="text-gray-400">Regularization ε:</span>{' '}
                <span className="text-white font-mono">{object.spectralTriple.epsilon}</span>
              </div>
            )}
            {object.spectralTriple.lambdaMax && (
              <div>
                <span className="text-gray-400">λ_max:</span>{' '}
                <span className="text-white font-mono">{object.spectralTriple.lambdaMax}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
