import { AppRoutesEnum, SidebarNavItemsEnum } from '../../utils/constants';
import PanelLeadsIcon from '@breakout/design-system/components/icons/panel-leads-icon';
import PanelLeadsActiveIcon from '@breakout/design-system/components/icons/panel-leads-active-icon';
import PanelConversationIcon from '@breakout/design-system/components/icons/panel-conversation-icon';
import PanelConversationActiveIcon from '@breakout/design-system/components/icons/panel-conversation-active-icon';
import PanelAgentActiveIcon from '@breakout/design-system/components/icons/panel-agent-active-icon';
import PanelAgentIcon from '@breakout/design-system/components/icons/panel-agent-icon';
import PanelTrainingActiveIcon from '@breakout/design-system/components/icons/panel-training-active-icon';
import PanelTrainingIcon from '@breakout/design-system/components/icons/panel-training-icon';
import PanelInsightsIcon from '@breakout/design-system/components/icons/panel-insights-icon';
import PanelInsightsActiveIcon from '@breakout/design-system/components/icons/panel-insights-active-icon';
import PanelIntegrationsIcon from '@breakout/design-system/components/icons/panel-integrations-icon';
import PanelIntegrationsActiveIcon from '@breakout/design-system/components/icons/panel-integrations-active-icon';

export enum NavigationGroup {
  ACCOUNT_SETTINGS = 'Account Settings',
  WORKSPACE_SETTINGS = 'Workspace Settings',
}

type NavLinkItem = {
  navUrl: string;
  navItem: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  activeIcon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  children?: NavLinkItem[];
  group?: NavigationGroup;
};

export const MAIN_LINK_ITEMS: NavLinkItem[] = [
  {
    navUrl: `/${AppRoutesEnum.LEADS}`,
    navItem: SidebarNavItemsEnum.LEADS_LABEL,
    icon: PanelLeadsIcon,
    activeIcon: PanelLeadsActiveIcon,
  },
  {
    navUrl: `/${AppRoutesEnum.CONVERSATIONS}`,
    navItem: SidebarNavItemsEnum.CONVERSATIONS_LABEL,
    icon: PanelConversationIcon,
    activeIcon: PanelConversationActiveIcon,
  },
  {
    navUrl: `/${AppRoutesEnum.AGENT}`,
    navItem: SidebarNavItemsEnum.AGENT_LABEL,
    icon: PanelAgentIcon,
    activeIcon: PanelAgentActiveIcon,
    children: [
      {
        navUrl: `/${AppRoutesEnum.AGENT_DATA_SOURCES}`,
        navItem: SidebarNavItemsEnum.AGENT_DATA_SOURCES_LABEL,
      },
      {
        navUrl: `/${AppRoutesEnum.AGENT_BRANDING}`,
        navItem: SidebarNavItemsEnum.AGENT_BRANDING_LABEL,
      },
      {
        navUrl: `/${AppRoutesEnum.AGENT_ENTRYPOINTS}`,
        navItem: SidebarNavItemsEnum.AGENT_ENTRYPOINTS_LABEL,
      },
      {
        navUrl: `/${AppRoutesEnum.AGENT_AI_PROMPTS}`,
        navItem: SidebarNavItemsEnum.AGENT_AI_PROMPTS_LABEL,
      },
    ],
  },
  {
    navUrl: `/${AppRoutesEnum.TRAINING}`,
    navItem: SidebarNavItemsEnum.TRAINING_LABEL,
    icon: PanelTrainingIcon,
    activeIcon: PanelTrainingActiveIcon,
    children: [
      {
        navUrl: `/${AppRoutesEnum.TRAINING_PLAYGROUND}`,
        navItem: SidebarNavItemsEnum.TRAINING_PLAYGROUND_LABEL,
      },
    ],
  },
  {
    navUrl: `/${AppRoutesEnum.INSIGHTS}`,
    navItem: SidebarNavItemsEnum.INSIGHT_LABEL,
    icon: PanelInsightsIcon,
    activeIcon: PanelInsightsActiveIcon,
  },
];

export const SETTINGS_LINK_ITEMS: NavLinkItem[] = [
  {
    navUrl: `/settings/${AppRoutesEnum.INTEGRATIONS}`,
    navItem: SidebarNavItemsEnum.INTEGRATIONS_LABEL,
    icon: PanelIntegrationsIcon,
    activeIcon: PanelIntegrationsActiveIcon,
  },
];

export const SIDE_NAV_VIEW_TO_ITEMS = {
  MAIN: MAIN_LINK_ITEMS,
  SETTINGS: SETTINGS_LINK_ITEMS,
};
