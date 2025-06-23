import { useEffect, useState } from 'react';
import { SidebarNavItemsEnum } from '../../utils/constants';

import usePageRouteState from '../usePageRouteState';
import { useParams } from 'react-router-dom';
import { getDashboardBasicPathURL } from '../../utils/common';
import { SIDE_NAV_VIEW_TO_ITEMS, NavigationGroup } from './navigationItems';
import { SideNavView } from '../../context/SidebarContext';

const EXPANDED_TABS_KEY = 'expanded_tabs';

type ExpandedTabsState = {
  [key: string]: boolean;
};

type UseSidebarNavigationItemsProps = {
  sideNavView: SideNavView;
};

const getInitialExpandedState = (): ExpandedTabsState => {
  const storedValue = localStorage.getItem(EXPANDED_TABS_KEY);
  return storedValue ? JSON.parse(storedValue) : {};
};

const useSidebarNavigationItems = ({ sideNavView }: UseSidebarNavigationItemsProps) => {
  const [expandedTabs, setExpandedTabs] = useState<ExpandedTabsState>(getInitialExpandedState);
  const { tenantName } = useParams();

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

  const {
    isAgentDataSourcesPage,
    isAgentBrandingPage,
    isAgentEntrypointsPage,
    isAgentAiPromptsPage,
    isTrainingPlaygroundPage,
  } = usePageRouteState();

  const { AGENT_LABEL, TRAINING_LABEL } = SidebarNavItemsEnum;

  const isAgentTabActive =
    isAgentBrandingPage || isAgentEntrypointsPage || isAgentAiPromptsPage || isAgentDataSourcesPage;

  const isTrainingTabActive = isTrainingPlaygroundPage;

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

  return {
    items,
    groupedItems,
    ungroupedItems,
    expandedTabs,
    handleTabExpansion,
  };
};

export default useSidebarNavigationItems;
