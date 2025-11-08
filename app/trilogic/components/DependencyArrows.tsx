'use client';

import React from 'react';
import { useVisualization } from '../context/VisualizationContext';

export default function DependencyArrows() {
  const { dependencies, activeTab } = useVisualization();

  // Filter dependencies related to active tab
  const activeDependencies = dependencies.filter(
    dep => dep.active && (dep.from === activeTab || dep.to === activeTab)
  );

  if (activeDependencies.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <div className="bg-gradient-to-br from-purple-900/90 to-pink-900/90 border border-purple-500/50 rounded-lg p-4 backdrop-blur-md shadow-2xl">
        <h4 className="text-sm font-semibold text-purple-300 mb-3 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Active Connections
        </h4>
        <div className="space-y-2">
          {activeDependencies.map((dep, idx) => (
            <div
              key={`${dep.from}-${dep.to}-${idx}`}
              className="flex items-center gap-2 text-sm animate-fade-in"
            >
              <div className="flex-1 flex items-center gap-2">
                <span className="text-cyan-400 font-medium capitalize">
                  {dep.from === activeTab ? dep.from : dep.to}
                </span>
                <svg className="w-4 h-4 text-purple-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
                <span className="text-pink-400 font-medium capitalize">
                  {dep.from === activeTab ? dep.to : dep.from}
                </span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3 border-t border-purple-500/30 pt-2">
          Changes here affect highlighted tabs
        </p>
      </div>
    </div>
  );
}
