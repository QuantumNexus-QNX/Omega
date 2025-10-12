/**
 * Tri-Logic Consciousness Platform
 * © JaredOmegaDunahay 2025
 *
 * Integrated Consciousness Framework v2.1
 * Equilibrium: μ = 0.569 | Resonance: Ω = 0.847 Hz
 * ;)∞⊗Ω
 */

import type { Config } from 'jest'
const config: Config = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/__tests__'],
  transform: { '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.json' }] },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss)$': 'identity-obj-proxy'
  },
  setupFilesAfterEnv: ['@testing-library/jest-dom']
}
export default config
