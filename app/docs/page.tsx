'use client'


import { motion } from 'framer-motion'
import Link from 'next/link'
import { QuasarLogo } from '../../components/QuasarLogo'

export default function DocsPage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center">
      {/* Background */}
      <div className="absolute inset-0 cosmic-grid opacity-[0.035]" />
      
      {/* Content */}
      <div className="relative z-10 mx-auto max-w-2xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="flex flex-col items-center gap-8"
        >
          {/* Logo */}
          <div className="relative">
            <div className="absolute -inset-10 rounded-full bg-quasar-ring opacity-30 blur-2xl" />
            <QuasarLogo size={120} className="drop-shadow-[0_0_60px_rgba(6,182,212,0.25)]" />
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-brand via-brand-purple to-brand-pink bg-clip-text text-transparent">
            Documentation
          </h1>

          {/* Description */}
          <div className="cosmic-surface p-8 max-w-xl">
            <p className="text-lg text-gray-300 mb-4">
              Comprehensive documentation is being crafted with care.
            </p>
            <p className="text-sm text-gray-400">
              Our documentation will cover everything from quick-start guides to advanced 
              quantum-native architectures, tri-logic systems, and post-quantum security patterns.
            </p>
          </div>

          {/* Documentation Preview */}
          <div className="grid gap-4 w-full max-w-xl text-left">
            <div className="cosmic-surface p-4">
              <div className="flex items-start gap-3">
                <div className="text-brand text-xl">📚</div>
                <div>
                  <h3 className="font-semibold mb-1">Getting Started</h3>
                  <p className="text-xs text-gray-400">Quick-start guides, installation, and basic concepts</p>
                </div>
              </div>
            </div>
            <div className="cosmic-surface p-4">
              <div className="flex items-start gap-3">
                <div className="text-brand-purple text-xl">🔬</div>
                <div>
                  <h3 className="font-semibold mb-1">Core Concepts</h3>
                  <p className="text-xs text-gray-400">Tri-logic, Riemann sphere mapping, K3 logic systems</p>
                </div>
              </div>
            </div>
            <div className="cosmic-surface p-4">
              <div className="flex items-start gap-3">
                <div className="text-brand-pink text-xl">⚙️</div>
                <div>
                  <h3 className="font-semibold mb-1">API Reference</h3>
                  <p className="text-xs text-gray-400">Complete API documentation with examples</p>
                </div>
              </div>
            </div>
            <div className="cosmic-surface p-4">
              <div className="flex items-start gap-3">
                <div className="text-brand text-xl">🎓</div>
                <div>
                  <h3 className="font-semibold mb-1">Tutorials & Examples</h3>
                  <p className="text-xs text-gray-400">Step-by-step guides and real-world implementations</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <Link href="/" className="btn-primary">
              ← Back to Home
            </Link>
            <Link href="/trilogic" className="btn-ghost">
              Explore Tri-Logic Visualizer
            </Link>
          </div>

          {/* Interim Resources */}
          <div className="mt-8 cosmic-surface p-6 max-w-xl">
            <h3 className="font-semibold mb-3">Available Now</h3>
            <div className="text-sm text-gray-400 space-y-2">
              <p>
                <Link href="/trilogic" className="text-brand hover:underline">
                  → Tri-Logic Visualizer
                </Link>
                {' '}— Interactive exploration of K3 logic on the Riemann sphere
              </p>
              <p className="text-xs text-gray-500 mt-4">
                Based on the Integrated Consciousness Framework v2.1
              </p>
            </div>
          </div>

          {/* Status */}
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
            <div className="h-2 w-2 rounded-full bg-brand-purple animate-pulse" />
            <span>Documentation in Progress</span>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 w-full z-10 border-t border-white/5 py-6 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Trivector.ai • Crafted with restraint</p>
      </footer>
    </div>
  )
}
