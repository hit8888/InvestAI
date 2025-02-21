import React, { createContext, useContext, useState } from 'react';

export type WidgetMode = 'embed' | 'overlay' | 'bottomBar';

interface WidgetModeContextType {
  mode: WidgetMode;
  setMode: (mode: WidgetMode) => void;
}

const determineInitialMode = (): WidgetMode => {
  const urlParams = new URLSearchParams(window.location.search);
  const containerId = urlParams.get('container_id');

  if (!containerId) {
    return 'bottomBar';
  }

  return 'embed';
};

const WidgetModeContext = createContext<WidgetModeContextType | undefined>(undefined);

export const WidgetModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<WidgetMode>(determineInitialMode());

  return <WidgetModeContext.Provider value={{ mode, setMode }}>{children}</WidgetModeContext.Provider>;
};

export const useWidgetMode = () => {
  const context = useContext(WidgetModeContext);
  if (!context) {
    throw new Error('useWidgetMode must be used within a WidgetModeProvider');
  }
  return context;
};
