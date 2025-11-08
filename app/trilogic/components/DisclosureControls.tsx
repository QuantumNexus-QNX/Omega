'use client';

import React from 'react';
import { useDisclosure } from '../context/DisclosureContext';

export default function DisclosureControls() {
  const { showMath, toggleShowMath, beginnerMode, toggleBeginnerMode } = useDisclosure();

  return (
    <div className="flex items-center gap-4 flex-wrap">
      {/* Show Math Toggle */}
      <label className="flex items-center gap-2 cursor-pointer group">
        <div className="relative">
          <input
            type="checkbox"
            checked={showMath}
            onChange={toggleShowMath}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-purple-600 peer-checked:to-pink-600"></div>
        </div>
        <span className="text-sm font-medium text-gray-300 group-hover:text-purple-400 transition-colors flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          Show Math
        </span>
      </label>

      {/* Beginner Mode Toggle */}
      <label className="flex items-center gap-2 cursor-pointer group">
        <div className="relative">
          <input
            type="checkbox"
            checked={beginnerMode}
            onChange={toggleBeginnerMode}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-cyan-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-cyan-600 peer-checked:to-blue-600"></div>
        </div>
        <span className="text-sm font-medium text-gray-300 group-hover:text-cyan-400 transition-colors flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          Beginner Mode
        </span>
      </label>

      {/* Info Text */}
      <div className="text-xs text-gray-500 flex items-center gap-1">
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        {showMath && beginnerMode && <span>Math overlay + simplified view</span>}
        {showMath && !beginnerMode && <span>Math overlay enabled</span>}
        {!showMath && beginnerMode && <span>Simplified view</span>}
        {!showMath && !beginnerMode && <span>Full technical view</span>}
      </div>
    </div>
  );
}
