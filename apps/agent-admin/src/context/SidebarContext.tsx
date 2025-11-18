import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SideNavView } from '../utils/constants';
import {
  SIDEBAR_V2_MAIN_SECTIONS,
  SIDEBAR_V2_SETTINGS_ITEMS,
  SidebarV2SettingsGroup,
} from '../utils/sidebarV2Constants';
import { useSessionStore } from '../stores/useSessionStore';

type SidebarContextProps = {
  sideNavView: SideNavView;
  setSideNavView: (view: SideNavView) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  navigateToSettingsView: () => void;
  navigateToMainView: () => void;
  handleNavigation: (url: string) => void;

  // Backward compatibility
  isSidebarOpen: boolean;
};

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const tenantName = useSessionStore((state) => state.activeTenant?.['tenant-name']) ?? '';

  // Track collapsed/expanded state (fixed width in V2 - always expanded)
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  // Track which view we're in (MAIN or SETTINGS)
  const [sideNavView, setSideNavView] = useState<SideNavView>(() => {
    const pathURL = location.pathname;
    if (pathURL.includes('settings')) {
      return SideNavView.SETTINGS;
    }
    return SideNavView.MAIN;
  });

  const toggleSidebar = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  const navigateToSettingsView = useCallback(() => {
    const defaultRoute = SIDEBAR_V2_SETTINGS_ITEMS.find(
      (item) => item.settingsGroup === SidebarV2SettingsGroup.WORKSPACE_SETTINGS,
    )?.navUrl;

    setSideNavView(SideNavView.SETTINGS);
    if (defaultRoute) {
      const basePath = tenantName ? `/${tenantName}${defaultRoute}` : defaultRoute;
      navigate(basePath, { state: { from: 'settings' } });
    }
  }, [navigate, tenantName]);

  const navigateToMainView = useCallback(() => {
    const firstMainItem = SIDEBAR_V2_MAIN_SECTIONS[0]?.items[0];
    setSideNavView(SideNavView.MAIN);
    if (location.state?.from === 'settings') {
      navigate(-1);
    } else if (firstMainItem) {
      const basePath = tenantName ? `/${tenantName}${firstMainItem.navUrl}` : firstMainItem.navUrl;
      navigate(basePath);
    }
  }, [navigate, location.state, tenantName]);

  const handleNavigation = useCallback(
    (url: string) => {
      const basePath = tenantName ? `/${tenantName}${url}` : url;
      navigate(basePath);
    },
    [navigate, tenantName],
  );

  const contextValue = useMemo(
    () => ({
      sideNavView,
      setSideNavView,
      isCollapsed,
      setIsCollapsed,
      toggleSidebar,
      navigateToSettingsView,
      navigateToMainView,
      handleNavigation,

      // Backward compatibility
      isSidebarOpen: !isCollapsed,
    }),
    [sideNavView, isCollapsed, toggleSidebar, navigateToSettingsView, navigateToMainView, handleNavigation],
  );

  return <SidebarContext.Provider value={contextValue}>{children}</SidebarContext.Provider>;
};

export const useSidebar = (): SidebarContextProps => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};
