import React, { createContext, useContext, ReactNode } from 'react';
import { useSidebarArtifact } from '../hooks/useSidebarArtifact';
import { ArtifactContextState, ArtifactContextActions } from '../types/artifact.types';

export interface SidebarArtifactContextType extends ArtifactContextState, ArtifactContextActions {}

const SidebarArtifactContext = createContext<SidebarArtifactContextType | undefined>(undefined);

interface SidebarArtifactProviderProps {
  children: ReactNode;
}

export const SidebarArtifactProvider = ({ children }: SidebarArtifactProviderProps) => {
  const sidebarArtifactHook = useSidebarArtifact();

  return <SidebarArtifactContext.Provider value={sidebarArtifactHook}>{children}</SidebarArtifactContext.Provider>;
};

export const useSidebarArtifactContext = () => {
  const context = useContext(SidebarArtifactContext);
  if (context === undefined) {
    throw new Error('useSidebarArtifactContext must be used within a SidebarArtifactProvider');
  }
  return context;
};
