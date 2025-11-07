'use client';

/**
 * EducationalInfo Component
 * 
 * Educational panel with explanations of tri-logic concepts
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MobiusParams } from '../lib/math';

interface EducationalInfoProps {
  currentTransformation: MobiusParams | null;
}

export default function EducationalInfo({ currentTransformation }: EducationalInfoProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>('trilogic');
  
  const sections = [
    {
      id: 'trilogic',
      title: 'What is Tri-Logic?',
      content: (
        <div className="space-y-3 text-sm text-gray-300">
          <p>
            Tri-logic is the minimal complete logic system <span className="font-mono text-purple-400">{'{0, 1, ∅}'}</span> that allows superposition. 
            Unlike binary logic which only has true and false, tri-logic includes a third value: <span className="font-semibold text-amber-400">undefined (∅)</span>.
          </p>
          <p>
            This third value represents states that are neither true nor false—they exist in superposition, 
            similar to quantum states before measurement. When measured or collapsed, tri-logic reduces to 
            binary logic <span className="font-mono text-blue-400">{'{0, 1}'}</span>.
          </p>
          <p className="text-purple-400 font-semibold">
            Key insight: Binary logic is the collapsed measurement state of tri-logic.
          </p>
        </div>
      )
    },
    {
      id: 'riemann',
      title: 'The Riemann Sphere',
      content: (
        <div className="space-y-3 text-sm text-gray-300">
          <p>
            The <span className="font-semibold text-cyan-400">Riemann sphere</span> provides a natural geometric 
            representation of tri-logic by mapping truth values to points on a sphere:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li><span className="text-red-400 font-semibold">False (0)</span> → South pole (0, -1, 0)</li>
            <li><span className="text-green-400 font-semibold">True (1)</span> → North pole (0, 1, 0)</li>
            <li><span className="text-amber-400 font-semibold">Undefined (∅)</span> → Point at infinity</li>
          </ul>
          <p>
            This sphere is not just a visualization—it's the natural topological space where tri-logic lives. 
            The sphere compactifies the complex plane by adding a single point at infinity.
          </p>
        </div>
      )
    },
    {
      id: 'stereographic',
      title: 'Stereographic Projection',
      content: (
        <div className="space-y-3 text-sm text-gray-300">
          <p>
            <span className="font-semibold text-cyan-400">Stereographic projection</span> maps points on the 
            Riemann sphere to the complex plane:
          </p>
          <div className="bg-black/40 p-3 rounded font-mono text-xs text-purple-300 overflow-x-auto">
            π(X, Y, Z) = (X + iY)/(1 - Z)
          </div>
          <p>
            This projection has remarkable properties:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>It's <span className="font-semibold">conformal</span> (preserves angles)</li>
            <li>Maps circles on the sphere to circles in the plane</li>
            <li>The north pole maps to infinity</li>
            <li>It's invertible everywhere except at the north pole</li>
          </ul>
          <p className="text-xs text-gray-500">
            The projection lines you see connect the north pole to points on the sphere, 
            showing how they map to the complex plane below.
          </p>
        </div>
      )
    },
    {
      id: 'mobius',
      title: 'Möbius Transformations',
      content: (
        <div className="space-y-3 text-sm text-gray-300">
          <p>
            <span className="font-semibold text-cyan-400">Möbius transformations</span> are the symmetries 
            of the Riemann sphere:
          </p>
          <div className="bg-black/40 p-3 rounded font-mono text-xs text-purple-300 overflow-x-auto">
            M(z) = (az + b)/(cz + d) where ad - bc ≠ 0
          </div>
          <p>
            These transformations have profound properties:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>They preserve the <span className="font-semibold">cross-ratio</span> of four points</li>
            <li>They map circles to circles (including lines as circles through ∞)</li>
            <li>They're conformal (angle-preserving)</li>
            <li>They form a group under composition</li>
          </ul>
          <p>
            In tri-logic, Möbius transformations show how undefined (∅) can "rotate" between true and false, 
            demonstrating the fluid nature of superposition states.
          </p>
        </div>
      )
    },
    {
      id: 'crossratio',
      title: 'Cross-Ratio Preservation',
      content: (
        <div className="space-y-3 text-sm text-gray-300">
          <p>
            The <span className="font-semibold text-cyan-400">cross-ratio</span> is a fundamental invariant 
            preserved by all Möbius transformations:
          </p>
          <div className="bg-black/40 p-3 rounded font-mono text-xs text-purple-300 overflow-x-auto">
            (z₁, z₂; z₃, z₄) = [(z₁ - z₃)(z₂ - z₄)] / [(z₁ - z₄)(z₂ - z₃)]
          </div>
          <p>
            This means that while individual points move under transformation, their relative "configuration" 
            remains constant. This is analogous to how quantum entanglement preserves correlations even as 
            individual states evolve.
          </p>
          <p className="text-purple-400 font-semibold">
            Cross-ratio preservation is what makes Möbius transformations the "correct" symmetries of tri-logic.
          </p>
        </div>
      )
    },
    {
      id: 'kleene',
      title: 'K3 (Kleene) Logic',
      content: (
        <div className="space-y-3 text-sm text-gray-300">
          <p>
            <span className="font-semibold text-cyan-400">Kleene three-valued logic</span> (K3) defines 
            how logical operations work with undefined values:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li><span className="font-semibold">AND:</span> False dominates (0 ∧ ∅ = 0)</li>
            <li><span className="font-semibold">OR:</span> True dominates (1 ∨ ∅ = 1)</li>
            <li><span className="font-semibold">NOT:</span> Undefined stays undefined (¬∅ = ∅)</li>
          </ul>
          <p>
            The key principle: <span className="font-semibold text-amber-400">∅ propagates</span> through 
            operations unless a definite value (0 or 1) forces a result.
          </p>
          <p className="text-xs text-gray-500">
            This behavior mirrors quantum mechanics: superposition states propagate through operations 
            until a measurement collapses them to a definite value.
          </p>
        </div>
      )
    }
  ];
  
  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id);
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white mb-3">Learn About Tri-Logic</h3>
      
      {/* Current Transformation Display */}
      {currentTransformation && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/40 backdrop-blur-sm"
        >
          <h4 className="text-sm font-semibold text-white mb-2">Current Transformation</h4>
          <div className="font-mono text-xs text-purple-300">
            M(z) = (az + b)/(cz + d)
          </div>
          <div className="text-xs text-gray-400 mt-2">
            Transformation is active. Points on the sphere are being mapped according to the Möbius formula.
          </div>
        </motion.div>
      )}
      
      {/* Expandable Sections */}
      <div className="space-y-2">
        {sections.map((section) => (
          <div
            key={section.id}
            className="rounded-lg bg-black/30 border border-purple-500/20 backdrop-blur-sm overflow-hidden"
          >
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-purple-900/20 transition-colors"
            >
              <span className="font-semibold text-white">{section.title}</span>
              <motion.span
                animate={{ rotate: expandedSection === section.id ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="text-purple-400"
              >
                ▼
              </motion.span>
            </button>
            
            <AnimatePresence>
              {expandedSection === section.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4">
                    {section.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
      
      {/* Reference */}
      <div className="p-4 rounded-lg bg-black/20 border border-purple-500/10 backdrop-blur-sm">
        <p className="text-xs text-gray-500">
          Based on the <span className="font-semibold text-purple-400">Integrated Consciousness Framework v2.1</span> (Addendum E: 
          Tri-Logic and Quantum Semantics)
        </p>
      </div>
    </div>
  );
}

