'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type VisualizationTab = 
  | 'sphere' 
  | 'propagation' 
  | 'wabisabi' 
  | 'spectral' 
  | 'triad' 
  | 'collapse' 
  | 'sheaf';

export interface SelectedPoint {
  id: string;
  position: [number, number, number]; // 3D coordinates
  label: string;
  color: string;
  sourceTab: VisualizationTab;
}

export interface DependencyLink {
  from: VisualizationTab;
  to: VisualizationTab;
  label: string;
  active: boolean;
}

interface VisualizationContextType {
  activeTab: VisualizationTab;
  setActiveTab: (tab: VisualizationTab) => void;
  selectedPoint: SelectedPoint | null;
  setSelectedPoint: (point: SelectedPoint | null) => void;
  highlightedTabs: Set<VisualizationTab>;
  addHighlight: (tab: VisualizationTab) => void;
  removeHighlight: (tab: VisualizationTab) => void;
  clearHighlights: () => void;
  dependencies: DependencyLink[];
  activateDependency: (from: VisualizationTab, to: VisualizationTab) => void;
  deactivateDependency: (from: VisualizationTab, to: VisualizationTab) => void;
}

const VisualizationContext = createContext<VisualizationContextType | undefined>(undefined);

// Define dependency relationships between visualizations
const DEPENDENCY_GRAPH: DependencyLink[] = [
  { from: 'sphere', to: 'triad', label: 'Point mapping', active: false },
  { from: 'sphere', to: 'spectral', label: 'Distance calc', active: false },
  { from: 'collapse', to: 'wabisabi', label: 'Space resize', active: false },
  { from: 'propagation', to: 'sphere', label: 'Infection zone', active: false },
  { from: 'wabisabi', to: 'spectral', label: 'β affects distance', active: false },
  { from: 'triad', to: 'collapse', label: 'Resonance cycle', active: false },
];

export function VisualizationProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<VisualizationTab>('sphere');
  const [selectedPoint, setSelectedPoint] = useState<SelectedPoint | null>(null);
  const [highlightedTabs, setHighlightedTabs] = useState<Set<VisualizationTab>>(new Set());
  const [dependencies, setDependencies] = useState<DependencyLink[]>(DEPENDENCY_GRAPH);

  const addHighlight = useCallback((tab: VisualizationTab) => {
    setHighlightedTabs(prev => new Set(prev).add(tab));
  }, []);

  const removeHighlight = useCallback((tab: VisualizationTab) => {
    setHighlightedTabs(prev => {
      const next = new Set(prev);
      next.delete(tab);
      return next;
    });
  }, []);

  const clearHighlights = useCallback(() => {
    setHighlightedTabs(new Set());
  }, []);

  const activateDependency = useCallback((from: VisualizationTab, to: VisualizationTab) => {
    setDependencies(prev =>
      prev.map(dep =>
        dep.from === from && dep.to === to
          ? { ...dep, active: true }
          : dep
      )
    );
    addHighlight(to);
  }, [addHighlight]);

  const deactivateDependency = useCallback((from: VisualizationTab, to: VisualizationTab) => {
    setDependencies(prev =>
      prev.map(dep =>
        dep.from === from && dep.to === to
          ? { ...dep, active: false }
          : dep
      )
    );
    removeHighlight(to);
  }, [removeHighlight]);

  return (
    <VisualizationContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedPoint,
        setSelectedPoint,
        highlightedTabs,
        addHighlight,
        removeHighlight,
        clearHighlights,
        dependencies,
        activateDependency,
        deactivateDependency,
      }}
    >
      {children}
    </VisualizationContext.Provider>
  );
}

export function useVisualization() {
  const context = useContext(VisualizationContext);
  if (!context) {
    throw new Error('useVisualization must be used within a VisualizationProvider');
  }
  return context;
}
