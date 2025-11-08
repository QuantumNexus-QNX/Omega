'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface DisclosureContextType {
  showMath: boolean;
  toggleShowMath: () => void;
  beginnerMode: boolean;
  toggleBeginnerMode: () => void;
  tooltipsEnabled: boolean;
  setTooltipsEnabled: (enabled: boolean) => void;
}

const DisclosureContext = createContext<DisclosureContextType | undefined>(undefined);

export function DisclosureProvider({ children }: { children: ReactNode }) {
  const [showMath, setShowMath] = useState(false);
  const [beginnerMode, setBeginnerMode] = useState(false);
  const [tooltipsEnabled, setTooltipsEnabled] = useState(true);

  const toggleShowMath = useCallback(() => {
    setShowMath(prev => !prev);
  }, []);

  const toggleBeginnerMode = useCallback(() => {
    setBeginnerMode(prev => !prev);
  }, []);

  return (
    <DisclosureContext.Provider
      value={{
        showMath,
        toggleShowMath,
        beginnerMode,
        toggleBeginnerMode,
        tooltipsEnabled,
        setTooltipsEnabled,
      }}
    >
      {children}
    </DisclosureContext.Provider>
  );
}

export function useDisclosure() {
  const context = useContext(DisclosureContext);
  if (!context) {
    throw new Error('useDisclosure must be used within a DisclosureProvider');
  }
  return context;
}
