/**
 * K3 (Kleene) Three-Valued Logic Operations
 * 
 * Implements the standard Kleene logic operations for tri-logic system {0, 1, ∅}
 * where ∅ represents "undefined" or "unknown"
 */

import { TruthValue } from './constants';

/**
 * Kleene AND operation
 * 
 * Truth table:
 * AND | 0 | 1 | ∅
 * ----|---|---|---
 *  0  | 0 | 0 | 0
 *  1  | 0 | 1 | ∅
 *  ∅  | 0 | ∅ | ∅
 * 
 * @param a - First operand
 * @param b - Second operand
 * @returns Result of a AND b
 */
export function kleeneAnd(a: TruthValue, b: TruthValue): TruthValue {
  // If either is false, result is false
  if (a === 0 || b === 0) return 0;
  
  // If both are true, result is true
  if (a === 1 && b === 1) return 1;
  
  // Otherwise, result is undefined
  return null;
}

/**
 * Kleene OR operation
 * 
 * Truth table:
 * OR  | 0 | 1 | ∅
 * ----|---|---|---
 *  0  | 0 | 1 | ∅
 *  1  | 1 | 1 | 1
 *  ∅  | ∅ | 1 | ∅
 * 
 * @param a - First operand
 * @param b - Second operand
 * @returns Result of a OR b
 */
export function kleeneOr(a: TruthValue, b: TruthValue): TruthValue {
  // If either is true, result is true
  if (a === 1 || b === 1) return 1;
  
  // If both are false, result is false
  if (a === 0 && b === 0) return 0;
  
  // Otherwise, result is undefined
  return null;
}

/**
 * Kleene NOT operation
 * 
 * Truth table:
 * NOT | Result
 * ----|-------
 *  0  |   1
 *  1  |   0
 *  ∅  |   ∅
 * 
 * @param a - Operand
 * @returns Result of NOT a
 */
export function kleeneNot(a: TruthValue): TruthValue {
  if (a === 0) return 1;
  if (a === 1) return 0;
  return null; // NOT ∅ = ∅
}

/**
 * Kleene IMPLIES operation
 * 
 * Truth table:
 * IMP | 0 | 1 | ∅
 * ----|---|---|---
 *  0  | 1 | 1 | 1
 *  1  | 0 | 1 | ∅
 *  ∅  | ∅ | 1 | ∅
 * 
 * @param a - Antecedent
 * @param b - Consequent
 * @returns Result of a IMPLIES b (equivalent to NOT a OR b)
 */
export function kleeneImplies(a: TruthValue, b: TruthValue): TruthValue {
  return kleeneOr(kleeneNot(a), b);
}

/**
 * Kleene EQUIVALENCE operation
 * 
 * Truth table:
 * EQV | 0 | 1 | ∅
 * ----|---|---|---
 *  0  | 1 | 0 | ∅
 *  1  | 0 | 1 | ∅
 *  ∅  | ∅ | ∅ | ∅
 * 
 * @param a - First operand
 * @param b - Second operand
 * @returns Result of a EQUIVALENT b
 */
export function kleeneEquivalent(a: TruthValue, b: TruthValue): TruthValue {
  // If both are the same and not undefined, result is true
  if (a === b && a !== null) return 1;
  
  // If they're different and neither is undefined, result is false
  if (a !== null && b !== null && a !== b) return 0;
  
  // Otherwise, result is undefined
  return null;
}

/**
 * Format truth value for display
 */
export function formatTruthValue(value: TruthValue): string {
  if (value === 0) return '0 (False)';
  if (value === 1) return '1 (True)';
  return '∅ (Undefined)';
}

/**
 * Get all truth values
 */
export function getAllTruthValues(): TruthValue[] {
  return [0, 1, null];
}

/**
 * Generate complete truth table for a binary operation
 */
export function generateBinaryTruthTable(
  operation: (a: TruthValue, b: TruthValue) => TruthValue
): Array<{ a: TruthValue; b: TruthValue; result: TruthValue }> {
  const values = getAllTruthValues();
  const table: Array<{ a: TruthValue; b: TruthValue; result: TruthValue }> = [];
  
  for (const a of values) {
    for (const b of values) {
      table.push({ a, b, result: operation(a, b) });
    }
  }
  
  return table;
}

/**
 * Generate complete truth table for a unary operation
 */
export function generateUnaryTruthTable(
  operation: (a: TruthValue) => TruthValue
): Array<{ a: TruthValue; result: TruthValue }> {
  const values = getAllTruthValues();
  return values.map(a => ({ a, result: operation(a) }));
}

