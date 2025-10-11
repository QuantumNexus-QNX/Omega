import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#06b6d4',
          purple: '#8b5cf6',
          pink: '#ec4899',
          teal: '#2dd4bf',
        },
      },
      fontFamily: {
        sans: ['var(--font-plex)', 'system-ui', 'sans-serif'],
        display: ['var(--font-grotesk)', 'ui-sans-serif', 'system-ui'],
      },
      backgroundImage: {
        'cosmic': 'radial-gradient(1200px 600px at 10% 10%, rgba(14,165,233,0.10), transparent 60%), radial-gradient(1000px 600px at 90% 30%, rgba(168,85,247,0.10), transparent 60%), radial-gradient(800px 400px at 50% 80%, rgba(236,72,153,0.08), transparent 60%)',
        'quasar-ring': 'conic-gradient(from 0deg at 50% 50%, #06b6d4, #8b5cf6, #ec4899, #06b6d4)'
      },
      boxShadow: {
        glow: '0 0 40px rgba(6,182,212,0.25), 0 0 80px rgba(139,92,246,0.15)'
      },
      animation: {
        'slow-spin': 'spin 18s linear infinite',
        'pulse-soft': 'pulseSoft 6s ease-in-out infinite',
      },
      keyframes: {
        pulseSoft: {
          '0%, 100%': { opacity: '0.75' },
          '50%': { opacity: '1' }
        }
      }
    },
  },
  // Keep plugin list minimal to avoid extra deps unless installed
  plugins: [],
}
export default config
