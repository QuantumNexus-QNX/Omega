import EmailCTA from '@/components/EmailCTA'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cosmic-black to-cosmic-gray900">
      {/* Hero Section */}
      <main className="container mx-auto px-6 py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo/Title */}
          <h1 className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Trivector.AI
          </h1>

          {/* Tagline */}
          <p className="text-2xl md:text-3xl text-gray-300 mb-12 font-light">
            Data Visualization, 3D Graphics & Machine Learning
          </p>

          {/* Description */}
          <p className="text-lg md:text-xl text-gray-400 mb-16 max-w-2xl mx-auto leading-relaxed">
            Building interactive data experiences with modern web technologies.
            Powered by React, Next.js, D3.js, Three.js, and advanced ML capabilities.
          </p>

          {/* Contact CTA */}
          <div className="flex flex-col items-center gap-6">
            <p className="text-gray-400">Contact us:</p>
            <EmailCTA />
          </div>
        </div>
      </main>

      {/* Features Grid */}
      <section className="container mx-auto px-6 pb-32">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="bg-cosmic-gray900/40 border border-gray-800 rounded-lg p-6 text-center">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-white font-semibold mb-2">Data Viz</h3>
            <p className="text-gray-500 text-sm">D3.js visualizations</p>
          </div>

          {/* Feature 2 */}
          <div className="bg-cosmic-gray900/40 border border-gray-800 rounded-lg p-6 text-center">
            <div className="text-3xl mb-3">🎨</div>
            <h3 className="text-white font-semibold mb-2">3D Graphics</h3>
            <p className="text-gray-500 text-sm">Three.js & React</p>
          </div>

          {/* Feature 3 */}
          <div className="bg-cosmic-gray900/40 border border-gray-800 rounded-lg p-6 text-center">
            <div className="text-3xl mb-3">🤖</div>
            <h3 className="text-white font-semibold mb-2">Machine Learning</h3>
            <p className="text-gray-500 text-sm">ML matrix operations</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-6">
        <div className="container mx-auto px-6 text-center text-gray-600 text-sm">
          <p>&copy; {new Date().getFullYear()} Trivector.AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
