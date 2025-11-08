'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useDisclosure } from '../context/DisclosureContext';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

export default function Tooltip({ 
  content, 
  children, 
  position = 'top',
  delay = 300 
}: TooltipProps) {
  const { tooltipsEnabled } = useDisclosure();
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const timeoutRef = useRef<NodeJS.Timeout>();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (!tooltipsEnabled) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setCoords({ x: rect.left + rect.width / 2, y: rect.top });
    }

    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'bottom-full left-1/2 -translate-x-1/2 mb-2';
      case 'bottom':
        return 'top-full left-1/2 -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 -translate-y-1/2 mr-2';
      case 'right':
        return 'left-full top-1/2 -translate-y-1/2 ml-2';
    }
  };

  const getArrowClasses = () => {
    switch (position) {
      case 'top':
        return 'top-full left-1/2 -translate-x-1/2 border-t-purple-900 border-l-transparent border-r-transparent border-b-transparent';
      case 'bottom':
        return 'bottom-full left-1/2 -translate-x-1/2 border-b-purple-900 border-l-transparent border-r-transparent border-t-transparent';
      case 'left':
        return 'left-full top-1/2 -translate-y-1/2 border-l-purple-900 border-t-transparent border-b-transparent border-r-transparent';
      case 'right':
        return 'right-full top-1/2 -translate-y-1/2 border-r-purple-900 border-t-transparent border-b-transparent border-l-transparent';
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isVisible && tooltipsEnabled && (
        <div
          className={`absolute z-50 ${getPositionClasses()} animate-fade-in`}
          style={{ pointerEvents: 'none' }}
        >
          <div className="bg-gradient-to-br from-purple-900 to-pink-900 border border-purple-500/50 rounded-lg px-3 py-2 shadow-2xl backdrop-blur-sm max-w-xs">
            <p className="text-sm text-gray-200 leading-relaxed">{content}</p>
          </div>
          <div
            className={`absolute w-0 h-0 border-4 ${getArrowClasses()}`}
            style={{ borderWidth: '6px' }}
          />
        </div>
      )}
    </div>
  );
}
