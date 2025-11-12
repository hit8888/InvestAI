import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SideNavView } from '../utils/constants';
import {
  SIDEBAR_V2_ACCORDION_SECTIONS,
  SIDEBAR_V2_SETTINGS_ITEMS,
  SidebarV2AccordionGroup,
  SidebarV2SettingsGroup,
} from '../utils/sidebarV2Constants';
import { useSessionStore } from '../stores/useSessionStore';

const SIDEBAR_COLLAPSED_KEY = 'sidebar_v2_collapsed';

type SidebarContextProps = {
  sideNavView: SideNavView;
  setSideNavView: (view: SideNavView) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  openAccordion: string;
  toggleAccordion: (title: string) => void;
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

  // Track collapsed/expanded state
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    const stored = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
    return stored ? JSON.parse(stored) : false;
  });

  // Track which view we're in (MAIN or SETTINGS)
  const [sideNavView, setSideNavView] = useState<SideNavView>(() => {
    const pathURL = location.pathname;
    if (pathURL.includes('settings')) {
      return SideNavView.SETTINGS;
    }
    return SideNavView.MAIN;
  });

  // Track which accordion section is open (single-mode - only one can be open)
  const [openAccordion, setOpenAccordion] = useState<string>(SidebarV2AccordionGroup.BREAKOUT_BLOCKS);

  // Persist collapsed state to localStorage
  useEffect(() => {
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  const toggleSidebar = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  const toggleAccordion = useCallback((title: string) => {
    setOpenAccordion((prev) => (prev === title ? '' : title));
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
    const firstMainItem = SIDEBAR_V2_ACCORDION_SECTIONS[0]?.items[0];
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
      openAccordion,
      toggleAccordion,
      navigateToSettingsView,
      navigateToMainView,
      handleNavigation,

      // Backward compatibility
      isSidebarOpen: !isCollapsed,
    }),
    [
      sideNavView,
      isCollapsed,
      toggleSidebar,
      openAccordion,
      toggleAccordion,
      navigateToSettingsView,
      navigateToMainView,
      handleNavigation,
    ],
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
