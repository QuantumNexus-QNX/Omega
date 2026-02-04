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
        
        {/* Subtitle positioned at ~28% from top - just above the disk's upper glow */}
        <div className="absolute top-[22%] md:top-[24%] left-0 right-0 text-center">
          <p className="text-xs sm:text-sm md:text-base font-light tracking-[0.45em] uppercase text-sky-300/80 drop-shadow-[0_0_15px_rgba(125,211,252,0.5)]">
            The Event Horizon
          </p>
        </div>
        
        {/* Bottom section - Enter CTA positioned low in dark zone below disk */}
        <div className="absolute bottom-[8%] md:bottom-[10%] left-0 right-0 flex flex-col items-center gap-4">
          {/* Enter text link */}
          <Link 
            href="#enter"
            className="group relative text-sm md:text-base font-light tracking-[0.5em] uppercase text-sky-300/90 hover:text-sky-100 transition-all duration-500"
          >
            <span className="relative z-10">Enter</span>
            {/* Animated underline on hover */}
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-sky-300/60 group-hover:w-full transition-all duration-500" />
          </Link>
          
          {/* Down arrow indicator */}
          <svg 
            className="w-4 h-4 text-sky-300/50"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 14l-7 7m0 0l-7-7" />
          </svg>
        </div>
      </div>
    </main>
  )
}
