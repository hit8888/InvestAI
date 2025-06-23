import React, { createContext, useContext, useState } from 'react';

interface SidebarContextProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  sideNavView: SideNavView;
  setSideNavView: (view: SideNavView) => void;
}

export enum SideNavView {
  MAIN = 'MAIN',
  SETTINGS = 'SETTINGS',
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [sideNavView, setSideNavView] = useState<SideNavView>(SideNavView.MAIN);

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  return (
    <SidebarContext value={{ isSidebarOpen, toggleSidebar, sideNavView, setSideNavView }}>{children}</SidebarContext>
  );
};

export const useSidebar = (): SidebarContextProps => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};
