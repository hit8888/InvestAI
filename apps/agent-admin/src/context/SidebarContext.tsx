import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { NavigationGroup, SIDE_NAV_VIEW_TO_ITEMS, SidebarNavItemsEnum, SideNavView } from '../utils/constants';
import usePageRouteState from '../hooks/usePageRouteState';
import { getDashboardBasicPathURL } from '../utils/common';

const EXPANDED_TABS_KEY = 'expanded_tabs';

type SidebarContextProps = {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  sideNavView: SideNavView;
  setSideNavView: (view: SideNavView) => void;
  expandedTabs: ExpandedTabsState;
  handleTabExpansion: (tabKey: string) => void;
  groupedItems: Map<NavigationGroup, (typeof SIDE_NAV_VIEW_TO_ITEMS)[SideNavView]>;
  ungroupedItems: (typeof SIDE_NAV_VIEW_TO_ITEMS)[SideNavView];
  navigateToMainView: () => void;
  navigateToSettingsView: () => void;
};

type ExpandedTabsState = {
  [key: string]: boolean;
};

const getInitialExpandedState = (): ExpandedTabsState => {
  const storedValue = localStorage.getItem(EXPANDED_TABS_KEY);
  return storedValue ? JSON.parse(storedValue) : {};
};

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    isAgentDataSourcesPage,
    isAgentBrandingPage,
    isAgentEntrypointsPage,
    isAgentAiPromptsPage,
    isTrainingPlaygroundPage,
    pathURL,
  } = usePageRouteState();
  const navigate = useNavigate();
  const { tenantName } = useParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [sideNavView, setSideNavView] = useState<SideNavView>(() => {
    if (pathURL.includes('settings')) {
      return SideNavView.SETTINGS;
    }
    return SideNavView.MAIN;
  });
  const [expandedTabs, setExpandedTabs] = useState<ExpandedTabsState>(getInitialExpandedState);

  const { AGENT_LABEL, TRAINING_LABEL } = SidebarNavItemsEnum;

  const isAgentTabActive =
    isAgentBrandingPage || isAgentEntrypointsPage || isAgentAiPromptsPage || isAgentDataSourcesPage;

  const isTrainingTabActive = isTrainingPlaygroundPage;

  const { groupedItems, ungroupedItems } = useMemo(() => {
    const basicURL = getDashboardBasicPathURL(tenantName ?? '');
    const items = SIDE_NAV_VIEW_TO_ITEMS[sideNavView].map((item) => ({
      ...item,
      navUrl: `${basicURL}${item.navUrl}`,
    }));

    const groupedItems = new Map<NavigationGroup, typeof items>();
    const ungroupedItems: typeof items = [];

    items.forEach((item) => {
      if ('group' in item && item.group) {
        if (!groupedItems.has(item.group)) {
          groupedItems.set(item.group, []);
        }
        groupedItems.get(item.group)!.push(item);
      } else {
        ungroupedItems.push(item);
      }
    });

    return { groupedItems, ungroupedItems };
  }, [tenantName, sideNavView]);

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  const handleTabExpansion = (tabKey: string) => {
    setExpandedTabs((prev) => {
      const newState = {
        ...prev,
        [tabKey]: !prev[tabKey],
      };
      localStorage.setItem(EXPANDED_TABS_KEY, JSON.stringify(newState));
      return newState;
    });
  };

  const navigateToMainView = () => {
    setSideNavView(SideNavView.MAIN);
    navigate(SIDE_NAV_VIEW_TO_ITEMS[SideNavView.MAIN][0].navUrl);
  };

  const navigateToSettingsView = () => {
    setSideNavView(SideNavView.SETTINGS);
    navigate(SIDE_NAV_VIEW_TO_ITEMS[SideNavView.SETTINGS][0].navUrl);
  };

  useEffect(() => {
    setExpandedTabs((prev) => {
      const newState = { ...prev };
      let hasChanges = false;

      if (isAgentTabActive && !prev[AGENT_LABEL]) {
        newState[AGENT_LABEL] = true;
        hasChanges = true;
      }
      if (isTrainingTabActive && !prev[TRAINING_LABEL]) {
        newState[TRAINING_LABEL] = true;
        hasChanges = true;
      }

      if (hasChanges) {
        localStorage.setItem(EXPANDED_TABS_KEY, JSON.stringify(newState));
      }

      return hasChanges ? newState : prev;
    });
  }, [isAgentTabActive, isTrainingTabActive]);

  return (
    <SidebarContext
      value={{
        isSidebarOpen,
        toggleSidebar,
        sideNavView,
        setSideNavView,
        groupedItems,
        ungroupedItems,
        expandedTabs,
        handleTabExpansion,
        navigateToMainView,
        navigateToSettingsView,
      }}
    >
      {children}
    </SidebarContext>
  );
};

export const useSidebar = (): SidebarContextProps => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};
