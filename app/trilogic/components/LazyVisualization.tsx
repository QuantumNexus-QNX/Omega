'use client';

import React, { useEffect, useRef, useState, Suspense } from 'react';

interface LazyVisualizationProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
}

export default function LazyVisualization({
  children,
  fallback = <LoadingSpinner />,
  threshold = 0.1,
  rootMargin = '100px',
}: LazyVisualizationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasLoaded) {
            setIsVisible(true);
            setHasLoaded(true);
            // Once loaded, we can disconnect the observer
            observer.disconnect();
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, hasLoaded]);

  return (
    <div ref={containerRef} className="min-h-[400px]">
      {isVisible ? (
        <Suspense fallback={fallback}>{children}</Suspense>
      ) : (
        fallback
      )}
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="relative">
        {/* Outer rotating ring */}
        <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
        {/* Inner pulsing circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full animate-pulse"></div>
      </div>
      <p className="ml-4 text-gray-400 animate-pulse">Loading visualization...</p>
    </div>
  );
}
