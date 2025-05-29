import { useEffect, useState } from 'react';
import { AppRoutesEnum, COMMON_SMALL_ICON_PROPS, SidebarNavItemsEnum } from './../utils/constants';
import PanelLeadsIcon from '@breakout/design-system/components/icons/panel-leads-icon';
import PanelLeadsActiveIcon from '@breakout/design-system/components/icons/panel-leads-active-icon';
import PanelConversationIcon from '@breakout/design-system/components/icons/panel-conversation-icon';
import PanelConversationActiveIcon from '@breakout/design-system/components/icons/panel-conversation-active-icon';
import PanelAgentActiveIcon from '@breakout/design-system/components/icons/panel-agent-active-icon';
import PanelAgentIcon from '@breakout/design-system/components/icons/panel-agent-icon';

import usePageRouteState from './usePageRouteState';
import { useParams } from 'react-router-dom';
import { getDashboardBasicPathURL } from '../utils/common';

const AGENT_TAB_EXPANDED_KEY = 'agent_tab_expanded';

const getInitialAgentTabExpandedState = () => {
  const storedValue = localStorage.getItem(AGENT_TAB_EXPANDED_KEY);
  return storedValue ? JSON.parse(storedValue) : false;
};

const useSidebarNavigationItems = () => {
  const [isAgentExpanded, setIsAgentExpanded] = useState(() => getInitialAgentTabExpandedState());
  const { tenantName } = useParams();

  const handleAgentTabExpansion = () => {
    const newValue = !isAgentExpanded;
    setIsAgentExpanded(newValue);
    localStorage.setItem(AGENT_TAB_EXPANDED_KEY, JSON.stringify(newValue));
  };

  const {
    isLeadsPage,
    isConversationsPage,
    isAgentPlaygroundPage,
    isAgentDataSourcesPage,
    // isAgentWorkflowPage,
    isAgentBrandingPage,
    isAgentEntrypointsPage,
    isAgentInstructionsPage,
  } = usePageRouteState();
  const {
    LEADS,
    CONVERSATIONS,
    AGENT,
    AGENT_PLAYGROUND,
    AGENT_BRANDING,
    AGENT_ENTRYPOINTS,
    AGENT_INSTRUCTIONS,
    AGENT_DATA_SOURCES,
  } = AppRoutesEnum;
  const {
    LEADS_LABEL,
    CONVERSATIONS_LABEL,
    AGENT_LABEL,
    AGENT_PLAYGROUND_LABEL,
    AGENT_DATA_SOURCES_LABEL,
    // AGENT_WORKFLOW_LABEL,
    AGENT_BRANDING_LABEL,
    AGENT_ENTRYPOINTS_LABEL,
    AGENT_INSTRUCTIONS_LABEL,
  } = SidebarNavItemsEnum;

  const isAgentTabActive =
    isAgentPlaygroundPage ||
    isAgentBrandingPage ||
    isAgentEntrypointsPage ||
    isAgentInstructionsPage ||
    isAgentDataSourcesPage;

  useEffect(() => {
    if (isAgentTabActive) {
      setIsAgentExpanded(true);
    }
  }, [isAgentTabActive]);

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
          navUrl: `${basicURL}/${AGENT_PLAYGROUND}`,
          navItem: AGENT_PLAYGROUND_LABEL,
          isActive: isAgentPlaygroundPage,
        },
        // TODO: It will be used Later
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
          navUrl: `${basicURL}/${AGENT_INSTRUCTIONS}`,
          navItem: AGENT_INSTRUCTIONS_LABEL,
          isActive: isAgentInstructionsPage,
        },
      ],
    },
  ];

  return { NAV_LINK_ITEMS, isAgentExpanded, handleAgentTabExpansion };
};

export default useSidebarNavigationItems;
