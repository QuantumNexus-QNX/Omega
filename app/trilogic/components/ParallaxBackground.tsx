'use client';

import React, { useEffect, useState } from 'react';

export default function ParallaxBackground() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Subtle parallax effect at 0.1x scroll rate
  const parallaxOffset = scrollY * 0.1;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Radial gradient background */}
      <div
        className="absolute inset-0 bg-gradient-radial from-purple-900/20 via-gray-900 to-black"
        style={{
          transform: `translateY(${parallaxOffset}px)`,
        }}
      />

      {/* Animated gradient orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse"
        style={{
          transform: `translate(${parallaxOffset * 0.5}px, ${parallaxOffset * 0.3}px)`,
          animationDuration: '4s',
        }}
      />
      <div
        className="absolute top-1/2 right-1/4 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl animate-pulse"
        style={{
          transform: `translate(${-parallaxOffset * 0.5}px, ${parallaxOffset * 0.4}px)`,
          animationDuration: '5s',
          animationDelay: '1s',
        }}
      />
      <div
        className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl animate-pulse"
        style={{
          transform: `translate(${parallaxOffset * 0.3}px, ${-parallaxOffset * 0.2}px)`,
          animationDuration: '6s',
          animationDelay: '2s',
        }}
      />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(168, 85, 247, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(168, 85, 247, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          transform: `translateY(${parallaxOffset * 0.2}px)`,
        }}
      />
    </div>
  );
}
