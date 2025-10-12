/**
 * Tri-Logic Consciousness Platform
 * © JaredOmegaDunahay 2025
 *
 * Integrated Consciousness Framework v2.1
 * Equilibrium: μ = 0.569 | Resonance: Ω = 0.847 Hz
 * ;)∞⊗Ω
 */

import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cosmic: {
          black: '#000000',
          gray900: '#0a0a0a',
          gray800: '#1a1a1a'
        },
        cyan: { 400: '#06b6d4', 500: '#0891b2' },
        purple: { 500: '#8b5cf6', 600: '#7c3aed' },
        pink: { 500: '#ec4899' }
      },
      boxShadow: {
        glowCyan: '0 0 20px rgba(6,182,212,0.4)',
        glowPurple: '0 0 20px rgba(139,92,246,0.4)'
      },
      keyframes: {
        'collapse-pulse': { '0%,100%': {opacity:'1'}, '50%': {opacity:'0.5'} },
        'quasar-glow': {
          '0%,100%': { filter: 'drop-shadow(0 0 10px #06b6d4)' },
          '50%': { filter: 'drop-shadow(0 0 20px #8b5cf6)' }
        },
        'spiral-rotate': { from: {transform:'rotate(0deg)'}, to: {transform:'rotate(360deg)'} }
      },
      animation: {
        collapse: 'collapse-pulse 1.5s ease-in-out infinite',
        quasar: 'quasar-glow 2.5s ease-in-out infinite',
        spiral: 'spiral-rotate 20s linear infinite'
      }
    }
  },
  plugins: []
}
export default config
