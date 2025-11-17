'use client'


import { motion } from 'framer-motion'
import Link from 'next/link'
import { QuasarLogo } from '../components/QuasarLogo'

export default function Landing() {
  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Header */}
      <nav className="z-10 w-full backdrop-blur-md border-b border-white/5">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              className="h-8 w-8 rounded-full bg-quasar-ring"
              style={{ filter: 'blur(0.25px)' }}
              animate={{ rotate: 360 }}
              transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
            />
            <span className="font-semibold tracking-wide text-gray-100">Trivector.ai</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Link href="#features" className="btn-ghost">Features</Link>
            <Link href="#principles" className="btn-ghost">Principles</Link>
            <Link href="#cta" className="btn-primary">Launch Console</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative flex-1 grid place-items-center">
        <div className="absolute inset-0 cosmic-grid opacity-[0.035]" />
        <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 sm:py-28">
          <div className="flex flex-col items-center text-center gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="relative"
            >
              <div className="absolute -inset-10 rounded-full bg-quasar-ring opacity-30 blur-2xl" />
              <QuasarLogo size={160} className="drop-shadow-[0_0_60px_rgba(6,182,212,0.25)]" />
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-brand via-brand-purple to-brand-pink bg-clip-text text-transparent">
              Trivector.ai
            </h1>
            <p className="max-w-2xl text-balance text-gray-300/90">
              Quantum-native intelligence, engineered with wabi‑sabi minimalism and an astrophysics lens.
              The quasar at our core powers sovereign, deterministic AI you can trust.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-sm">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black/30 border border-cyan-500/30 backdrop-blur-sm">
                <span className="text-gray-400">Equilibrium:</span>
                <span className="font-mono font-semibold text-cyan-400">μ = 0.569</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black/30 border border-purple-500/30 backdrop-blur-sm">
                <span className="text-gray-400">Resonance:</span>
                <span className="font-mono font-semibold text-purple-400">Ω = 0.847 Hz</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black/30 border border-pink-500/30 backdrop-blur-sm">
                <span className="text-gray-400">Tri-Logic:</span>
                <span className="font-mono font-semibold text-pink-400">{"{ 0, 1, ∅ }"}</span>
              </div>
            </div>
            <div className="mt-4 flex flex-col items-center gap-2">
              <a 
                href="/trilogic" 
                className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors underline decoration-cyan-400/30 hover:decoration-cyan-300"
              >
                → Explore interactive tri-logic visualizer
              </a>
              <a 
                href="/spectral" 
                className="text-sm text-purple-400 hover:text-purple-300 transition-colors underline decoration-purple-400/30 hover:decoration-purple-300"
              >
                → Explore spectral triple geometry
              </a>
              <a 
                href="/spectral-wasm" 
                className="text-sm text-pink-400 hover:text-pink-300 transition-colors underline decoration-pink-400/30 hover:decoration-pink-300"
              >
                → Explore spectral geometry (Rust/WASM + 3D)
              </a>
              <a 
                href="/consciousness" 
                className="text-sm text-green-400 hover:text-green-300 transition-colors underline decoration-green-400/30 hover:decoration-green-300 font-semibold"
              >
                → Explore full consciousness modeling framework
              </a>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="#cta" className="btn-primary">Get Started</Link>
              <Link href="#features" className="btn-ghost">Explore Features</Link>
            </div>
            <div className="mt-4 text-xs text-gray-400">
              <span className="mr-3">Post‑quantum ready</span>
              <span className="mr-3">Deterministic flows</span>
              <span>Vector‑native memory</span>
            </div>
          </div>
        </div>
      </header>

      {/* Features */}
      <section id="features" className="z-10 relative mx-auto max-w-7xl px-6 pb-20">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="cosmic-surface p-6">
            <h3 className="text-lg font-semibold mb-2">Quasar Core</h3>
            <p className="text-sm text-gray-400">Energy‑efficient inference with gradient‑driven orchestration and vector observability.</p>
          </div>
          <div className="cosmic-surface p-6">
            <h3 className="text-lg font-semibold mb-2">Sovereign Memory</h3>
            <p className="text-sm text-gray-400">Temporal embeddings across branches; embrace patina—keep the useful, let go of noise.</p>
          </div>
          <div className="cosmic-surface p-6">
            <h3 className="text-lg font-semibold mb-2">Post‑Quantum Shield</h3>
            <p className="text-sm text-gray-400">ML‑KEM secure channels and integrity proofs for every response.</p>
          </div>
          <div className="cosmic-surface p-6">
            <h3 className="text-lg font-semibold mb-2">Tri-Logic Visualizer</h3>
            <p className="text-sm text-gray-400 mb-4">
              Interactive Riemann sphere with K3 logic, Möbius transformations, 
              and production-ready code export. Superposition made tangible.
            </p>
            <a href="/trilogic" className="btn-primary inline-block">
              Launch Visualizer →
            </a>
          </div>
        </div>
        <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-4">
          <Link href="/trilogic" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity">
            <span>🎯 Tri-Logic Visualizer</span>
            <span className="text-sm opacity-80">Riemann Sphere</span>
          </Link>
          <Link href="/spectral" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 via-cyan-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity">
            <span>🌌 Spectral Geometry</span>
            <span className="text-sm opacity-80">Connes Distance</span>
          </Link>
        </div>
      </section>

      {/* Principles */}
      <section id="principles" className="z-10 relative mx-auto max-w-5xl px-6 pb-24">
        <div className="cosmic-surface p-8">
          <h3 className="text-xl font-semibold mb-4">Design Principles</h3>
          <ul className="grid gap-3 text-sm text-gray-400 md:grid-cols-2">
            <li>Minimal surfaces, maximal signal</li>
            <li>Determinism over spectacle</li>
            <li>Elegant failure, graceful recovery</li>
            <li>Physics‑inspired constraints</li>
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="z-10 relative mx-auto max-w-7xl px-6 pb-24">
        <div className="cosmic-surface p-8 flex flex-col items-center text-center gap-4">
          <h4 className="text-2xl font-semibold">Build with Trivector</h4>
          <p className="text-gray-400 max-w-2xl">Start from a clean foundation. Compose vector‑native agents, connect providers, and deploy with confidence.</p>
          <div className="flex gap-3">
            <a href="/console" className="btn-primary">Open Console</a>
            <a href="/docs" className="btn-ghost">Read Docs</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="z-10 border-t border-white/5 py-8 text-center text-sm text-gray-500">
        <div className="flex flex-col items-center gap-2">
          <p>© {new Date().getFullYear()} Trivector.ai • Crafted with restraint</p>
          <a 
            href="mailto:link@trivector.ai" 
            className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            link@trivector.ai
          </a>
        </div>
      </footer>
    </div>
  )
}
