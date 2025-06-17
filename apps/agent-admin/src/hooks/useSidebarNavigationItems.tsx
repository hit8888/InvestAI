import { useEffect, useState } from 'react';
import { AppRoutesEnum, COMMON_SMALL_ICON_PROPS, SidebarNavItemsEnum } from './../utils/constants';
import PanelLeadsIcon from '@breakout/design-system/components/icons/panel-leads-icon';
import PanelLeadsActiveIcon from '@breakout/design-system/components/icons/panel-leads-active-icon';
import PanelConversationIcon from '@breakout/design-system/components/icons/panel-conversation-icon';
import PanelConversationActiveIcon from '@breakout/design-system/components/icons/panel-conversation-active-icon';
import PanelAgentActiveIcon from '@breakout/design-system/components/icons/panel-agent-active-icon';
import PanelAgentIcon from '@breakout/design-system/components/icons/panel-agent-icon';
import PanelTrainingActiveIcon from '@breakout/design-system/components/icons/panel-training-active-icon';
import PanelInsightsIcon from '@breakout/design-system/components/icons/panel-insights-icon';
import PanelInsightsActiveIcon from '@breakout/design-system/components/icons/panel-insights-active-icon';
import PanelTrainingIcon from '@breakout/design-system/components/icons/panel-training-icon';

import usePageRouteState from './usePageRouteState';
import { useParams } from 'react-router-dom';
import { getDashboardBasicPathURL } from '../utils/common';

const EXPANDED_TABS_KEY = 'expanded_tabs';

interface ExpandedTabsState {
  [key: string]: boolean;
}

const getInitialExpandedState = (): ExpandedTabsState => {
  const storedValue = localStorage.getItem(EXPANDED_TABS_KEY);
  return storedValue ? JSON.parse(storedValue) : {};
};

const useSidebarNavigationItems = () => {
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
    isLeadsPage,
    isConversationsPage,
    isAgentDataSourcesPage,
    isAgentBrandingPage,
    isAgentEntrypointsPage,
    isAgentAiPromptsPage,
    isTrainingPlaygroundPage,
    isInsightsPage,
  } = usePageRouteState();

  const {
    LEADS,
    CONVERSATIONS,
    AGENT,
    AGENT_BRANDING,
    AGENT_ENTRYPOINTS,
    AGENT_AI_PROMPTS,
    AGENT_DATA_SOURCES,
    TRAINING,
    TRAINING_PLAYGROUND,
    INSIGHTS,
  } = AppRoutesEnum;

  const {
    LEADS_LABEL,
    CONVERSATIONS_LABEL,
    AGENT_LABEL,
    AGENT_DATA_SOURCES_LABEL,
    AGENT_BRANDING_LABEL,
    AGENT_ENTRYPOINTS_LABEL,
    AGENT_AI_PROMPTS_LABEL,
    TRAINING_LABEL,
    TRAINING_PLAYGROUND_LABEL,
    INSIGHT_LABEL,
  } = SidebarNavItemsEnum;

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

  const NAV_LINK_ITEMS = [
    {
      navUrl: `${basicURL}/${LEADS}`,
      navItem: LEADS_LABEL,
      navImg: isLeadsPage ? (
        <PanelLeadsActiveIcon {...COMMON_SMALL_ICON_PROPS} />
      ) : (
        <PanelLeadsIcon {...COMMON_SMALL_ICON_PROPS} />
      ),
      isActive: isLeadsPage,
    },
    {
      navUrl: `${basicURL}/${CONVERSATIONS}`,
      navItem: CONVERSATIONS_LABEL,
      navImg: isConversationsPage ? (
        <PanelConversationActiveIcon {...COMMON_SMALL_ICON_PROPS} />
      ) : (
        <PanelConversationIcon {...COMMON_SMALL_ICON_PROPS} />
      ),
      isActive: isConversationsPage,
    },
    {
      navUrl: `${basicURL}/${AGENT}`,
      navItem: AGENT_LABEL,
      navImg: isAgentTabActive ? (
        <PanelAgentActiveIcon {...COMMON_SMALL_ICON_PROPS} />
      ) : (
        <PanelAgentIcon {...COMMON_SMALL_ICON_PROPS} />
      ),
      isActive: isAgentTabActive,
      hasChildren: true,
      children: [
        {
          navUrl: `${basicURL}/${AGENT_DATA_SOURCES}`,
          navItem: AGENT_DATA_SOURCES_LABEL,
          isActive: isAgentDataSourcesPage,
        },
        {
          navUrl: `${basicURL}/${AGENT_BRANDING}`,
          navItem: AGENT_BRANDING_LABEL,
          isActive: isAgentBrandingPage,
        },
        {
          navUrl: `${basicURL}/${AGENT_ENTRYPOINTS}`,
          navItem: AGENT_ENTRYPOINTS_LABEL,
          isActive: isAgentEntrypointsPage,
        },
        {
          navUrl: `${basicURL}/${AGENT_AI_PROMPTS}`,
          navItem: AGENT_AI_PROMPTS_LABEL,
          isActive: isAgentAiPromptsPage,
        },
      ],
    },
    {
      navUrl: `${basicURL}/${TRAINING}`,
      navItem: TRAINING_LABEL,
      navImg: isTrainingTabActive ? (
        <PanelTrainingActiveIcon {...COMMON_SMALL_ICON_PROPS} />
      ) : (
        <PanelTrainingIcon {...COMMON_SMALL_ICON_PROPS} />
      ),
      isActive: isTrainingTabActive,
      hasChildren: true,
      children: [
        {
          navUrl: `${basicURL}/${TRAINING_PLAYGROUND}`,
          navItem: TRAINING_PLAYGROUND_LABEL,
          isActive: isTrainingPlaygroundPage,
        },
      ],
    },
    {
      navUrl: `${basicURL}/${INSIGHTS}`,
      navItem: INSIGHT_LABEL,
      navImg: isInsightsPage ? (
        <PanelInsightsActiveIcon {...COMMON_SMALL_ICON_PROPS} />
      ) : (
        <PanelInsightsIcon {...COMMON_SMALL_ICON_PROPS} />
      ),
      isActive: isInsightsPage,
    },
  ];

  return {
    NAV_LINK_ITEMS,
    expandedTabs,
    handleTabExpansion,
  };
};

export default useSidebarNavigationItems;
