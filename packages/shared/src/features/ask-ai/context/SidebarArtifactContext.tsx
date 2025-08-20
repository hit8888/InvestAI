import React, { createContext, useContext, ReactNode } from 'react';
import { useSidebarArtifact } from '../hooks/useSidebarArtifact';

interface SidebarArtifactContextType {
  // State
  sideBarArtifact: {
    url: string;
    artifactType: 'VIDEO' | 'SLIDE_IMAGE';
    title: string;
  } | null;
  isSideDrawerOpen: boolean;
  calculatedWidth: number;
  currentVideo: {
    url: string;
    isPlaying: boolean;
  } | null;
  currentImage: {
    url: string;
    isExpanded: boolean;
  } | null;
  videoError: string | null;
  videoRef: React.RefObject<HTMLVideoElement | null>;

  // Actions
  openSidebar: (
    url: string,
    artifactType: 'VIDEO' | 'SLIDE_IMAGE',
    title: string,
    shouldPlay?: boolean,
  ) => Promise<void>;
  closeSidebar: () => void;
  toggleVideoPlayPause: () => void;
}

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
