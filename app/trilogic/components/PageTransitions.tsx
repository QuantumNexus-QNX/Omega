'use client';

import React, { useEffect, useState } from 'react';

interface PageTransitionsProps {
  children: React.ReactNode;
}

export default function PageTransitions({ children }: PageTransitionsProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger fade-in after component mounts
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`transition-all duration-700 ease-out ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {children}
    </div>
  );
}

// Tab transition wrapper
export function TabTransition({ 
  children, 
  isActive 
}: { 
  children: React.ReactNode; 
  isActive: boolean;
}) {
  return (
    <div
      className={`transition-all duration-500 ease-in-out ${
        isActive
          ? 'opacity-100 translate-x-0 scale-100'
          : 'opacity-0 translate-x-4 scale-95 absolute pointer-events-none'
      }`}
    >
      {children}
    </div>
  );
}
