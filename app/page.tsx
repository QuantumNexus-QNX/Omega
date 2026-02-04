import AccretionDiskVisualization from "@/components/accretion-disk-visualization"
import Link from "next/link"

export default function Home() {
  return (
    <main className="relative w-full h-screen overflow-hidden bg-black">
      {/* Visualization Background */}
      <div className="absolute inset-0">
        <AccretionDiskVisualization />
      </div>

      {/* Subtle vignette overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(0,0,0,0.5)_100%)]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Top section - Title positioned high in the dark zone above the disk */}
        <div className="pt-6 md:pt-8 lg:pt-10 text-center">
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-light text-amber-200/90 tracking-[0.2em] uppercase px-4">
            AEO Trivector
          </h1>
        </div>
        
        {/* Enter CTA positioned in center over black hole - around 58-62% from top */}
        <div className="absolute top-[58%] md:top-[60%] left-0 right-0 flex flex-col items-center gap-3">
          {/* Enter text link - larger, prominent */}
          <Link 
            href="#enter"
            className="group relative text-lg sm:text-xl md:text-2xl font-normal tracking-[0.5em] uppercase text-[#5DADE2] hover:text-[#85C1E9] transition-all duration-500"
          >
            Enter
          </Link>
          
          {/* Down arrow indicator - thin line */}
          <svg 
            className="w-3 h-6 md:w-4 md:h-8 text-[#5DADE2]/70 mt-1"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 48"
            strokeWidth={1}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 0v44m0 0l-6-6m6 6l6-6" />
          </svg>
        </div>
      </div>
    </main>
  )
}
