'use client';

/**
 * TruthTable Component
 * 
 * Interactive K3 (Kleene) logic truth tables
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  kleeneAnd,
  kleeneOr,
  kleeneNot,
  kleeneImplies,
  kleeneEquivalent,
  formatTruthValue,
  getAllTruthValues,
  generateBinaryTruthTable,
  generateUnaryTruthTable
} from '../lib/kleene';
import { TruthValue } from '../lib/constants';

type Operation = 'AND' | 'OR' | 'NOT' | 'IMPLIES' | 'EQUIVALENT';

export default function TruthTable() {
  const [selectedOperation, setSelectedOperation] = useState<Operation>('AND');
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);
  
  const operations = {
    AND: { fn: kleeneAnd, symbol: '∧', name: 'AND' },
    OR: { fn: kleeneOr, symbol: '∨', name: 'OR' },
    NOT: { fn: kleeneNot, symbol: '¬', name: 'NOT' },
    IMPLIES: { fn: kleeneImplies, symbol: '→', name: 'IMPLIES' },
    EQUIVALENT: { fn: kleeneEquivalent, symbol: '↔', name: 'EQUIVALENT' }
  };
  
  const truthValues = getAllTruthValues();
  
  const renderBinaryTable = (operation: (a: TruthValue, b: TruthValue) => TruthValue) => {
    const table = generateBinaryTruthTable(operation);
    
    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-purple-500/30 bg-purple-900/20 px-4 py-2 text-white">
                {operations[selectedOperation].symbol}
              </th>
              {truthValues.map((val, idx) => (
                <th
                  key={idx}
                  className="border border-purple-500/30 bg-purple-900/20 px-4 py-2 text-white"
                >
                  {val === null ? '∅' : val}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {truthValues.map((rowVal, rowIdx) => (
              <tr key={rowIdx}>
                <th className="border border-purple-500/30 bg-purple-900/20 px-4 py-2 text-white">
                  {rowVal === null ? '∅' : rowVal}
                </th>
                {truthValues.map((colVal, colIdx) => {
                  const result = operation(rowVal, colVal);
                  const cellKey = `${rowIdx}-${colIdx}`;
                  const isHovered = hoveredCell === cellKey;
                  
                  return (
                    <td
                      key={colIdx}
                      className={`border border-purple-500/30 px-4 py-2 text-center transition-all cursor-pointer ${
                        isHovered
                          ? 'bg-purple-600/40 scale-105'
                          : 'bg-black/20 hover:bg-purple-600/20'
                      }`}
                      onMouseEnter={() => setHoveredCell(cellKey)}
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      <span
                        className={`font-semibold ${
                          result === 0
                            ? 'text-red-400'
                            : result === 1
                            ? 'text-green-400'
                            : 'text-amber-400'
                        }`}
                      >
                        {result === null ? '∅' : result}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  const renderUnaryTable = (operation: (a: TruthValue) => TruthValue) => {
    const table = generateUnaryTruthTable(operation);
    
    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse max-w-xs mx-auto">
          <thead>
            <tr>
              <th className="border border-purple-500/30 bg-purple-900/20 px-4 py-2 text-white">
                Input
              </th>
              <th className="border border-purple-500/30 bg-purple-900/20 px-4 py-2 text-white">
                {operations[selectedOperation].symbol}
              </th>
            </tr>
          </thead>
          <tbody>
            {table.map((row, idx) => {
              const cellKey = `unary-${idx}`;
              const isHovered = hoveredCell === cellKey;
              
              return (
                <tr key={idx}>
                  <td className="border border-purple-500/30 bg-black/20 px-4 py-2 text-center text-white">
                    {row.a === null ? '∅' : row.a}
                  </td>
                  <td
                    className={`border border-purple-500/30 px-4 py-2 text-center transition-all cursor-pointer ${
                      isHovered
                        ? 'bg-purple-600/40 scale-105'
                        : 'bg-black/20 hover:bg-purple-600/20'
                    }`}
                    onMouseEnter={() => setHoveredCell(cellKey)}
                    onMouseLeave={() => setHoveredCell(null)}
                  >
                    <span
                      className={`font-semibold ${
                        row.result === 0
                          ? 'text-red-400'
                          : row.result === 1
                          ? 'text-green-400'
                          : 'text-amber-400'
                      }`}
                    >
                      {row.result === null ? '∅' : row.result}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3 text-white">K3 Logic Truth Tables</h3>
        <p className="text-sm text-gray-400 mb-4">
          Kleene three-valued logic with truth values {'{0, 1, ∅}'} where ∅ represents undefined.
        </p>
      </div>
      
      {/* Operation Selector */}
      <div className="flex flex-wrap gap-2">
        {(Object.keys(operations) as Operation[]).map((op) => (
          <motion.button
            key={op}
            onClick={() => setSelectedOperation(op)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              selectedOperation === op
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                : 'bg-purple-900/20 text-gray-300 hover:bg-purple-900/40 border border-purple-500/30'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {operations[op].symbol} {operations[op].name}
          </motion.button>
        ))}
      </div>
      
      {/* Truth Table */}
      <div className="p-4 rounded-lg bg-black/30 border border-purple-500/20 backdrop-blur-sm">
        {selectedOperation === 'NOT'
          ? renderUnaryTable(operations.NOT.fn as (a: TruthValue) => TruthValue)
          : renderBinaryTable(
              operations[selectedOperation].fn as (a: TruthValue, b: TruthValue) => TruthValue
            )}
      </div>
      
      {/* Legend */}
      <div className="p-4 rounded-lg bg-black/30 border border-purple-500/20 backdrop-blur-sm">
        <h4 className="text-sm font-semibold text-white mb-2">Legend</h4>
        <div className="space-y-1 text-sm">
          <div className="flex items-center space-x-2">
            <span className="text-red-400 font-semibold">0</span>
            <span className="text-gray-400">= False</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-green-400 font-semibold">1</span>
            <span className="text-gray-400">= True</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-amber-400 font-semibold">∅</span>
            <span className="text-gray-400">= Undefined (propagates through operations)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

