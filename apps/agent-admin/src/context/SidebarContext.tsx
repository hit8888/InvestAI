import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

import { NavigationGroup, SIDE_NAV_VIEW_TO_ITEMS, SidebarNavItemsEnum, SideNavView } from '../utils/constants';
import usePageRouteState from '../hooks/usePageRouteState';
import { getDashboardBasicPathURL } from '../utils/common';
import { useAuth } from './AuthProvider';
import { OrganizationDetails } from '@meaku/core/types/admin/auth';

const EXPANDED_TABS_KEY = 'expanded_tabs';
const SIDEBAR_OPEN_KEY = 'sidebar_open';

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

const hasFeatureFlag = (organization: OrganizationDetails | undefined, featureFlag: string | undefined) => {
  if (!featureFlag) return true;

  return organization?.[featureFlag as keyof OrganizationDetails] === true;
};

const getInitialExpandedState = (): ExpandedTabsState => {
  const storedValue = localStorage.getItem(EXPANDED_TABS_KEY);
  return storedValue ? JSON.parse(storedValue) : {};
};

const getInitialSidebarState = (): boolean => {
  const storedValue = localStorage.getItem(SIDEBAR_OPEN_KEY);
  return storedValue ? JSON.parse(storedValue) : true;
};

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    isAgentDataSourcesPage,
    isAgentBrandingPage,
    isAgentEntrypointsPage,
    isAgentControlsPage,
    isTrainingPlaygroundPage,
    pathURL,
    isAgentPage,
    isTrainingPage,
  } = usePageRouteState();
  const { userInfo } = useAuth();
  const orgList = userInfo?.organizations;
  const navigate = useNavigate();
  const location = useLocation();

  const comingFromSettings = useMemo(() => {
    return location.state?.from === 'settings';
  }, [location.state]);

  const { tenantName } = useParams();
  const organization = orgList?.find((org) => org['tenant-name'] === tenantName);
  const [isSidebarOpen, setIsSidebarOpen] = useState(getInitialSidebarState);
  const [sideNavView, setSideNavView] = useState<SideNavView>(() => {
    if (pathURL.includes('settings')) {
      return SideNavView.SETTINGS;
    }
    return SideNavView.MAIN;
  });
  const [expandedTabs, setExpandedTabs] = useState<ExpandedTabsState>(getInitialExpandedState);

  const { AGENT_LABEL, TRAINING_LABEL } = SidebarNavItemsEnum;

  const isAgentTabActive =
    isAgentBrandingPage || isAgentEntrypointsPage || isAgentControlsPage || isAgentDataSourcesPage;

  const isTrainingTabActive = isTrainingPlaygroundPage;

  const getSideNavItems = useCallback(
    (view: SideNavView) => {
      const basicURL = getDashboardBasicPathURL(tenantName ?? '');
      const items = SIDE_NAV_VIEW_TO_ITEMS[view]
        .map((item) => ({
          ...item,
          navUrl: `${basicURL}${item.navUrl}`,
          ...(item.children && {
            children: item.children.map((child) => ({
              ...child,
              navUrl: `${basicURL}${child.navUrl}`,
            })),
          }),
        }))
        .filter((item) => hasFeatureFlag(organization, item.requiredFeatureFlag));

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
    },
    [organization, tenantName],
  );

  const { groupedItems, ungroupedItems } = useMemo(() => getSideNavItems(sideNavView), [sideNavView, getSideNavItems]);

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => {
      const newState = !prevState;
      localStorage.setItem(SIDEBAR_OPEN_KEY, JSON.stringify(newState));
      return newState;
    });
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
    const defaultRoute = getSideNavItems(SideNavView.MAIN).ungroupedItems[0].navUrl;
    setSideNavView(SideNavView.MAIN);
    if (comingFromSettings) {
      navigate(-1);
    } else {
      // direct landing on integration page
      navigate(defaultRoute);
    }
  };

  const navigateToSettingsView = () => {
    const defaultRoute = getSideNavItems(SideNavView.SETTINGS).groupedItems.get(NavigationGroup.WORKSPACE_SETTINGS)?.[0]
      .navUrl;

    setSideNavView(SideNavView.SETTINGS);
    navigate(defaultRoute!, {
      state: {
        from: 'settings',
      },
    });
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

  // Navigate to first child item if user lands on parent routes
  useEffect(() => {
    if (!tenantName) return;

    const findAndNavigateToFirstChild = (label: SidebarNavItemsEnum) => {
      const item = ungroupedItems.find((item) => item.navItem === label);

      if (item?.children && item.children.length > 0) {
        const firstChildUrl = item.children[0].navUrl;
        navigate(firstChildUrl, { replace: true });
      }
    };

    // Check if user is on a parent route that has children
    const handleParentRouteRedirect = () => {
      if (isAgentPage) {
        // Find agent navigation item
        findAndNavigateToFirstChild(SidebarNavItemsEnum.AGENT_LABEL);
      } else if (isTrainingPage) {
        // Find training navigation item
        findAndNavigateToFirstChild(SidebarNavItemsEnum.TRAINING_LABEL);
      }
    };

    handleParentRouteRedirect();
  }, [isAgentPage, isTrainingPage, tenantName, ungroupedItems, navigate]);

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
