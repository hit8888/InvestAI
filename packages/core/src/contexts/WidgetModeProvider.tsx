import React, { createContext, useContext, useState } from 'react';

export enum WidgetMode {
  BOTTOM_BAR = 'BOTTOM_BAR',
  EMBEDDED_MODAL = 'EMBEDDED_MODAL',
  INLINE_EMBEDDED = 'INLINE_EMBEDDED',
}

interface WidgetModeContextType {
  mode: WidgetMode;
  setMode: (mode: WidgetMode) => void;
}

const determineInitialMode = (): WidgetMode => {
  const urlParams = new URLSearchParams(window.location.search);
  const containerId = urlParams.get('container_id');

  if (!containerId) {
    return WidgetMode.BOTTOM_BAR;
  }

  return WidgetMode.INLINE_EMBEDDED;
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
