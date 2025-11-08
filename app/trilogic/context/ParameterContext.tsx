'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// Framework constants
export interface FrameworkParameters {
  mu: number;      // Equilibrium constant (0.5-0.7)
  omega: number;   // Resonance frequency (0.5-1.5 Hz)
  kappa: number;   // Coupling constant (0.01-0.05)
  beta: number;    // Wabi-sabi constant (computed: 1 - mu - kappa*c)
}

// Canonical values
export const CANONICAL_PARAMS: FrameworkParameters = {
  mu: 0.569,
  omega: 0.847,
  kappa: 0.0207,
  beta: 0.207, // 1 - 0.569 - 0.0207*10.8
};

// Parameter ranges
export const PARAM_RANGES = {
  mu: { min: 0.5, max: 0.7, step: 0.001 },
  omega: { min: 0.5, max: 1.5, step: 0.01 },
  kappa: { min: 0.01, max: 0.05, step: 0.001 },
};

interface ParameterContextType {
  params: FrameworkParameters;
  setMu: (value: number) => void;
  setOmega: (value: number) => void;
  setKappa: (value: number) => void;
  resetToCanonical: () => void;
  isCanonical: boolean;
}

const ParameterContext = createContext<ParameterContextType | undefined>(undefined);

export function ParameterProvider({ children }: { children: ReactNode }) {
  const [params, setParams] = useState<FrameworkParameters>(CANONICAL_PARAMS);

  const setMu = useCallback((value: number) => {
    setParams(prev => {
      const newMu = Math.max(PARAM_RANGES.mu.min, Math.min(PARAM_RANGES.mu.max, value));
      const c = 10.8; // Speed of light constant
      const newBeta = 1 - newMu - prev.kappa * c;
      return { ...prev, mu: newMu, beta: newBeta };
    });
  }, []);

  const setOmega = useCallback((value: number) => {
    setParams(prev => ({
      ...prev,
      omega: Math.max(PARAM_RANGES.omega.min, Math.min(PARAM_RANGES.omega.max, value)),
    }));
  }, []);

  const setKappa = useCallback((value: number) => {
    setParams(prev => {
      const newKappa = Math.max(PARAM_RANGES.kappa.min, Math.min(PARAM_RANGES.kappa.max, value));
      const c = 10.8;
      const newBeta = 1 - prev.mu - newKappa * c;
      return { ...prev, kappa: newKappa, beta: newBeta };
    });
  }, []);

  const resetToCanonical = useCallback(() => {
    setParams(CANONICAL_PARAMS);
  }, []);

  const isCanonical = 
    Math.abs(params.mu - CANONICAL_PARAMS.mu) < 0.001 &&
    Math.abs(params.omega - CANONICAL_PARAMS.omega) < 0.01 &&
    Math.abs(params.kappa - CANONICAL_PARAMS.kappa) < 0.001;

  return (
    <ParameterContext.Provider value={{ params, setMu, setOmega, setKappa, resetToCanonical, isCanonical }}>
      {children}
    </ParameterContext.Provider>
  );
}

export function useParameters() {
  const context = useContext(ParameterContext);
  if (!context) {
    throw new Error('useParameters must be used within a ParameterProvider');
  }
  return context;
}
