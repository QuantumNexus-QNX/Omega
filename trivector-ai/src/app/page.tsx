import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#0f1420] to-[#1a1a2e] text-white">
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        {/* Logo/Icon */}
        <div className="mb-8 relative">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 opacity-20 blur-2xl absolute -inset-4" />
          <div className="w-24 h-24 rounded-full border-4 border-transparent bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 bg-clip-border relative flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-[#0a0e1a] flex items-center justify-center">
              <span className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
                Ω
              </span>
            </div>
          </div>
        </div>
        
        {/* Title */}
        <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Trivector.ai
        </h1>
        
        {/* Tagline */}
        <p className="text-gray-400 text-center max-w-2xl mb-12 text-lg">
          Quantum-native intelligence, engineered with wabi-sabi minimalism and an astrophysics lens.
          The quasar at our core powers sovereign, deterministic AI you can trust.
        </p>
        
        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-5xl w-full">
          <div className="bg-black/40 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-6 hover:border-cyan-500/50 transition-all">
            <h3 className="text-xl font-semibold mb-2 text-cyan-400">Quasar Core</h3>
            <p className="text-gray-400 text-sm">
              Energy-efficient inference with gradient-driven orchestration and vector observability.
            </p>
          </div>
          
          <div className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-lg p-6 hover:border-purple-500/50 transition-all">
            <h3 className="text-xl font-semibold mb-2 text-purple-400">Sovereign Memory</h3>
            <p className="text-gray-400 text-sm">
              Temporal embeddings across branches; embrace pāṇinā—keep the useful, let go of noise.
            </p>
          </div>
          
          <div className="bg-black/40 backdrop-blur-sm border border-pink-500/20 rounded-lg p-6 hover:border-pink-500/50 transition-all">
            <h3 className="text-xl font-semibold mb-2 text-pink-400">Post-Quantum Shield</h3>
            <p className="text-gray-400 text-sm">
              ML-KEM secure channels and integrity proofs for every response.
            </p>
          </div>
        </div>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/trilogic"
            className="px-8 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-medium hover:from-cyan-600 hover:to-purple-600 transition-all shadow-lg shadow-cyan-500/20"
          >
            Tri-Logic Visualizer
          </Link>
          
          <a
            href="https://github.com/QuantumNexus-QNX/Omega"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 rounded-lg border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 transition-all"
          >
            View on GitHub
          </a>
        </div>
        
        {/* Design Principles */}
        <div className="mt-16 max-w-2xl text-center">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Design Principles
          </h2>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
            <span>Minimal surfaces, maximal signal</span>
            <span>•</span>
            <span>Determinism over spectacle</span>
            <span>•</span>
            <span>Elegant failure, graceful recovery</span>
            <span>•</span>
            <span>Physics-inspired constraints</span>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="border-t border-gray-800 py-6 text-center text-sm text-gray-500">
        <p>© 2025 Trivector.ai • Crafted with restraint</p>
      </footer>
    </div>
  );
}

