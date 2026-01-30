import AccretionDiskVisualization from "@/components/accretion-disk-visualization"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="relative w-full h-screen overflow-hidden bg-black">
      {/* Visualization Background */}
      <div className="absolute inset-0">
        <AccretionDiskVisualization />
      </div>

      {/* Dark gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <header className="px-6 py-6 md:px-12 md:py-8">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">AEO Trivector</h1>
            <Button
              variant="outline"
              className="bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-sm"
            >
              Contact
            </Button>
          </div>
        </header>

        {/* Hero Content */}
        <div className="flex-1 flex items-center justify-center px-6 md:px-12">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight text-balance">
              AEO Trivector
            </h2>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10 leading-relaxed">
              Pioneering advanced computational physics and real-time gravitational lensing simulations with
              photorealistic accuracy
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="bg-white text-black hover:bg-white/90 text-base px-8 h-12">
                Get Started
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-sm text-base px-8 h-12"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="px-6 py-6 md:px-12 md:py-8">
          <div className="max-w-7xl mx-auto text-center text-white/60 text-sm">
            <p>© 2025 AEO Trivector LLC. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </main>
  )
}
