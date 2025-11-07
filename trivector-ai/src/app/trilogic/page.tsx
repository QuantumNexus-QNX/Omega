import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues with Three.js
const RiemannSphere = dynamic(() => import('@/components/RiemannSphere'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0e1a] via-[#0f1420] to-[#1a1a2e]">
      <div className="text-center">
        <div className="inline-block w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-cyan-400 text-sm">Loading Riemann Sphere...</p>
      </div>
    </div>
  ),
});

export default function TriLogicPage() {
  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">
      {/* Header */}
      <header className="border-b border-cyan-500/20 bg-black/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Tri-Logic Visualizer
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                Riemann Sphere • Stereographic Projection • Möbius Transformations
              </p>
            </div>
            <a
              href="/"
              className="px-4 py-2 rounded-lg border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 transition-colors text-sm"
            >
              ← Back to Home
            </a>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="h-[calc(100vh-73px)]">
        <RiemannSphere />
      </main>
      
      {/* Info section */}
      <div className="fixed bottom-4 right-4 max-w-sm bg-black/80 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4 text-xs text-gray-300">
        <h3 className="font-semibold text-purple-400 mb-2">About Tri-Logic</h3>
        <p className="mb-2">
          A three-valued logic system mapping truth values to the Riemann sphere:
        </p>
        <ul className="space-y-1 ml-4">
          <li><span className="text-pink-400">•</span> <strong>0 (False)</strong> → South pole</li>
          <li><span className="text-cyan-400">•</span> <strong>1 (True)</strong> → North pole</li>
          <li><span className="text-purple-400">•</span> <strong>∅ (Undefined)</strong> → Equator</li>
        </ul>
        <p className="mt-2 text-gray-500">
          Möbius transformations preserve the sphere's structure while transforming truth values.
        </p>
      </div>
    </div>
  );
}

