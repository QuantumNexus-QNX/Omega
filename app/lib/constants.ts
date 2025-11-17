/**
 * Core empirical constants for the JO (Jared Omega) consciousness modeling framework
 * 
 * These constants are derived from empirical observations and theoretical modeling
 * of consciousness phenomena and are used throughout the spectral, tensor, and
 * tri-logic computations.
 */

/**
 * μ (mu) - Equilibrium constant
 * Represents the baseline equilibrium state in consciousness modeling
 */
export const MU = 0.569;

/**
 * Ω (omega) - Resonance frequency
 * Primary resonance parameter (Hz or unitless depending on context)
 */
export const OMEGA = 0.847;

/**
 * κ (kappa) - Collapse/threshold constant
 * Governs quantum collapse and threshold behavior in the model
 */
export const KAPPA = 0.0323;

/**
 * β (beta) - Secondary scaling factor
 * Modulates secondary effects and scaling relationships
 */
export const BETA = 0.207;

/**
 * All constants as a single object for convenient access
 */
export const JO_CONSTANTS = {
  MU,
  OMEGA,
  KAPPA,
  BETA,
} as const;

export type JOConstantKey = keyof typeof JO_CONSTANTS;
