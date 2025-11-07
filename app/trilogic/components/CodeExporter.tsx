'use client';

/**
 * CodeExporter Component
 * 
 * Allows users to export K3 logic implementation code in Python or TypeScript
 */

import { useState } from 'react';
import copy from 'copy-to-clipboard';

const PYTHON_TEMPLATE = `"""
K3 Logic Implementation
Generated from Trivector.ai Tri-Logic Visualizer
Based on Kleene's three-valued logic
"""

from enum import Enum
from typing import Optional


class K3State(Enum):
    """Three-valued logic states"""
    TRUE = "T"
    FALSE = "F"
    UNKNOWN = "U"
    
    def __str__(self):
        return self.value


class K3Logic:
    """K3 (Kleene 3-valued) Logic Operations"""
    
    # NOT truth table
    NOT_TABLE = {
        K3State.TRUE: K3State.FALSE,
        K3State.FALSE: K3State.TRUE,
        K3State.UNKNOWN: K3State.UNKNOWN
    }
    
    # AND truth table
    AND_TABLE = {
        (K3State.TRUE, K3State.TRUE): K3State.TRUE,
        (K3State.TRUE, K3State.FALSE): K3State.FALSE,
        (K3State.TRUE, K3State.UNKNOWN): K3State.UNKNOWN,
        (K3State.FALSE, K3State.TRUE): K3State.FALSE,
        (K3State.FALSE, K3State.FALSE): K3State.FALSE,
        (K3State.FALSE, K3State.UNKNOWN): K3State.FALSE,
        (K3State.UNKNOWN, K3State.TRUE): K3State.UNKNOWN,
        (K3State.UNKNOWN, K3State.FALSE): K3State.FALSE,
        (K3State.UNKNOWN, K3State.UNKNOWN): K3State.UNKNOWN
    }
    
    # OR truth table
    OR_TABLE = {
        (K3State.TRUE, K3State.TRUE): K3State.TRUE,
        (K3State.TRUE, K3State.FALSE): K3State.TRUE,
        (K3State.TRUE, K3State.UNKNOWN): K3State.TRUE,
        (K3State.FALSE, K3State.TRUE): K3State.TRUE,
        (K3State.FALSE, K3State.FALSE): K3State.FALSE,
        (K3State.FALSE, K3State.UNKNOWN): K3State.UNKNOWN,
        (K3State.UNKNOWN, K3State.TRUE): K3State.TRUE,
        (K3State.UNKNOWN, K3State.FALSE): K3State.UNKNOWN,
        (K3State.UNKNOWN, K3State.UNKNOWN): K3State.UNKNOWN
    }
    
    @staticmethod
    def NOT(a: K3State) -> K3State:
        """K3 NOT operation"""
        return K3Logic.NOT_TABLE[a]
    
    @staticmethod
    def AND(a: K3State, b: K3State) -> K3State:
        """K3 AND operation"""
        return K3Logic.AND_TABLE[(a, b)]
    
    @staticmethod
    def OR(a: K3State, b: K3State) -> K3State:
        """K3 OR operation"""
        return K3Logic.OR_TABLE[(a, b)]
    
    @staticmethod
    def IMPLIES(a: K3State, b: K3State) -> K3State:
        """K3 IMPLIES operation: NOT(a) OR b"""
        return K3Logic.OR(K3Logic.NOT(a), b)
    
    @staticmethod
    def EQUIVALENT(a: K3State, b: K3State) -> K3State:
        """K3 EQUIVALENCE operation"""
        return K3Logic.AND(
            K3Logic.IMPLIES(a, b),
            K3Logic.IMPLIES(b, a)
        )


# Example usage
if __name__ == "__main__":
    print("K3 Logic Examples")
    print("=" * 40)
    
    # Test operations
    t, f, u = K3State.TRUE, K3State.FALSE, K3State.UNKNOWN
    
    print(f"NOT {t} = {K3Logic.NOT(t)}")
    print(f"{t} AND {u} = {K3Logic.AND(t, u)}")
    print(f"{f} OR {u} = {K3Logic.OR(f, u)}")
    print(f"{t} IMPLIES {u} = {K3Logic.IMPLIES(t, u)}")
`;

const TYPESCRIPT_TEMPLATE = `/**
 * K3 Logic Implementation
 * Generated from Trivector.ai Tri-Logic Visualizer
 * Based on Kleene's three-valued logic
 */

export enum K3State {
  TRUE = "T",
  FALSE = "F",
  UNKNOWN = "U"
}

export class K3Logic {
  private static NOT_TABLE: Record<K3State, K3State> = {
    [K3State.TRUE]: K3State.FALSE,
    [K3State.FALSE]: K3State.TRUE,
    [K3State.UNKNOWN]: K3State.UNKNOWN
  };
  
  private static AND_TABLE: Record<string, K3State> = {
    "T,T": K3State.TRUE,
    "T,F": K3State.FALSE,
    "T,U": K3State.UNKNOWN,
    "F,T": K3State.FALSE,
    "F,F": K3State.FALSE,
    "F,U": K3State.FALSE,
    "U,T": K3State.UNKNOWN,
    "U,F": K3State.FALSE,
    "U,U": K3State.UNKNOWN
  };
  
  private static OR_TABLE: Record<string, K3State> = {
    "T,T": K3State.TRUE,
    "T,F": K3State.TRUE,
    "T,U": K3State.TRUE,
    "F,T": K3State.TRUE,
    "F,F": K3State.FALSE,
    "F,U": K3State.UNKNOWN,
    "U,T": K3State.TRUE,
    "U,F": K3State.UNKNOWN,
    "U,U": K3State.UNKNOWN
  };
  
  static NOT(a: K3State): K3State {
    return this.NOT_TABLE[a];
  }
  
  static AND(a: K3State, b: K3State): K3State {
    return this.AND_TABLE[\`\${a},\${b}\`];
  }
  
  static OR(a: K3State, b: K3State): K3State {
    return this.OR_TABLE[\`\${a},\${b}\`];
  }
  
  static IMPLIES(a: K3State, b: K3State): K3State {
    return this.OR(this.NOT(a), b);
  }
  
  static EQUIVALENT(a: K3State, b: K3State): K3State {
    return this.AND(
      this.IMPLIES(a, b),
      this.IMPLIES(b, a)
    );
  }
}

// Example usage
const { TRUE: T, FALSE: F, UNKNOWN: U } = K3State;

console.log("K3 Logic Examples");
console.log("NOT", T, "=", K3Logic.NOT(T));
console.log(T, "AND", U, "=", K3Logic.AND(T, U));
console.log(F, "OR", U, "=", K3Logic.OR(F, U));
console.log(T, "IMPLIES", U, "=", K3Logic.IMPLIES(T, U));
`;

export default function CodeExporter() {
  const [copied, setCopied] = useState<string | null>(null);

  const handleExport = (lang: 'python' | 'typescript') => {
    const code = lang === 'python' ? PYTHON_TEMPLATE : TYPESCRIPT_TEMPLATE;
    copy(code);
    setCopied(lang);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="rounded-lg border border-purple-500/30 bg-black/20 backdrop-blur-sm p-6">
      <h3 className="text-lg font-semibold mb-4 text-white">Export Code</h3>
      <p className="text-sm text-gray-400 mb-4">
        Download production-ready K3 logic implementation
      </p>
      <div className="flex gap-3">
        <button 
          onClick={() => handleExport('python')}
          className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-semibold transition-all duration-200 transform hover:scale-105"
        >
          {copied === 'python' ? '✓ Copied!' : '🐍 Python'}
        </button>
        <button 
          onClick={() => handleExport('typescript')}
          className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-semibold transition-all duration-200 transform hover:scale-105"
        >
          {copied === 'typescript' ? '✓ Copied!' : '📘 TypeScript'}
        </button>
      </div>
      {copied && (
        <div className="mt-3 text-center text-sm text-green-400 animate-pulse">
          Code copied to clipboard!
        </div>
      )}
    </div>
  );
}
