import { AppRoutesEnum } from './constants';
import PanelConversationIcon from '@breakout/design-system/components/icons/panel-conversation-icon';
import PanelConversationActiveIcon from '@breakout/design-system/components/icons/panel-conversation-active-icon';
import PanelAgentIcon from '@breakout/design-system/components/icons/panel-agent-icon';
import PanelAgentActiveIcon from '@breakout/design-system/components/icons/panel-agent-active-icon';
import PanelInsightsIcon from '@breakout/design-system/components/icons/panel-insights-icon';
import PanelInsightsActiveIcon from '@breakout/design-system/components/icons/panel-insights-active-icon';
import PanelLeadsV2Icon from '@breakout/design-system/components/icons/panel-leads-v2-icon';
import PanelLeadsV2ActiveIcon from '@breakout/design-system/components/icons/panel-leads-v2-active-icon';
import PanelCompaniesV2Icon from '@breakout/design-system/components/icons/panel-companies-v2-icon';
import PanelCompaniesV2ActiveIcon from '@breakout/design-system/components/icons/panel-companies-v2-active-icon';
import PanelVisitorsV2Icon from '@breakout/design-system/components/icons/panel-visitors-v2-icon';
import PanelVisitorsV2ActiveIcon from '@breakout/design-system/components/icons/panel-visitors-v2-active-icon';
import PanelIcpV2Icon from '@breakout/design-system/components/icons/panel-icp-v2-icon';
import PanelIcpV2ActiveIcon from '@breakout/design-system/components/icons/panel-icp-v2-active-icon';
import PanelDataSourcesIcon from '@breakout/design-system/components/icons/panel-data-sources-icon';
import PanelDataSourcesActiveIcon from '@breakout/design-system/components/icons/panel-data-sources-active-icon';
import PanelAiBlocksIcon from '@breakout/design-system/components/icons/panel-ai-blocks-icon';
import PanelAiBlocksActiveIcon from '@breakout/design-system/components/icons/panel-ai-blocks-active-icon';
import PanelIntegrationsIcon from '@breakout/design-system/components/icons/panel-integrations-icon';
import PanelIntegrationsActiveIcon from '@breakout/design-system/components/icons/panel-integrations-active-icon';
import PanelProfileIcon from '@breakout/design-system/components/icons/panel-profile-icon';
import PanelProfileActiveIcon from '@breakout/design-system/components/icons/panel-profile-active-icon';
import { CalendarIcon } from 'lucide-react';

/**
 * V2 Sidebar Navigation Structure
 * Features accordion-based grouping for better organization
 */

export enum SidebarV2AccordionGroup {
  BREAKOUT_BLOCKS = 'Breakout Blocks',
  VISITOR_REVEAL = 'Visitor Reveal',
}

export enum SidebarV2SettingsGroup {
  WORKSPACE_SETTINGS = 'Workspace Settings',
  ACCOUNT_SETTINGS = 'Account Settings',
}

export interface SidebarV2LinkItem {
  navUrl: string;
  navItem: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  activeIcon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  accordionGroup?: SidebarV2AccordionGroup;
  settingsGroup?: SidebarV2SettingsGroup;
  requiredFeatureFlag?: string;
}

export interface SidebarV2AccordionSection {
  title: SidebarV2AccordionGroup;
  items: SidebarV2LinkItem[];
  defaultOpen?: boolean;
}

// ============================================================================
// STANDALONE NAVIGATION ITEMS
// ============================================================================

/**
 * Insights navigation item - standalone item not part of accordion groups
 */
export const INSIGHTS_ITEM: SidebarV2LinkItem = {
  navUrl: `/${AppRoutesEnum.INSIGHTS}`,
  navItem: 'Insights',
  icon: PanelInsightsIcon,
  activeIcon: PanelInsightsActiveIcon,
};

// ============================================================================
// MAIN NAVIGATION ITEMS
// ============================================================================

/**
 * Breakout Blocks Accordion Section
 * Contains core interaction and content management features
 */
export const BREAKOUT_BLOCKS_ITEMS: SidebarV2LinkItem[] = [
  {
    navUrl: `/${AppRoutesEnum.ACTIVE_CONVERSATIONS}`, // V1: Live Visitors page
    navItem: 'Live Chats',
    icon: PanelConversationIcon,
    activeIcon: PanelConversationActiveIcon,
    accordionGroup: SidebarV2AccordionGroup.BREAKOUT_BLOCKS,
    requiredFeatureFlag: 'active_conversations_enabled',
  },
  {
    navUrl: `/${AppRoutesEnum.CONVERSATIONS}`, // V1: Visitors page / All Visitors Tab
    navItem: 'All Chats',
    icon: PanelAgentIcon,
    activeIcon: PanelAgentIcon,
    accordionGroup: SidebarV2AccordionGroup.BREAKOUT_BLOCKS,
  },
  {
    navUrl: `/${AppRoutesEnum.ACTIVE_LEADS}`, // V1: Visitors page / Breakout Captured Leads tab
    navItem: 'Leads',
    icon: PanelLeadsV2Icon,
    activeIcon: PanelLeadsV2ActiveIcon,
    accordionGroup: SidebarV2AccordionGroup.BREAKOUT_BLOCKS,
  },
  {
    navUrl: `/${AppRoutesEnum.AGENT_DATA_SOURCES}`, // V1: Same as V1
    navItem: 'Data Sources',
    icon: PanelDataSourcesIcon,
    activeIcon: PanelDataSourcesActiveIcon,
    accordionGroup: SidebarV2AccordionGroup.BREAKOUT_BLOCKS,
  },
  {
    navUrl: '#', // V2 feature - coming soon, blank for now
    navItem: 'AI Blocks',
    icon: PanelAiBlocksIcon,
    activeIcon: PanelAiBlocksActiveIcon,
    accordionGroup: SidebarV2AccordionGroup.BREAKOUT_BLOCKS,
  },
  {
    navUrl: `/${AppRoutesEnum.TRAINING_PLAYGROUND}`, // V1: Same as V1
    navItem: 'Playground',
    icon: PanelInsightsIcon,
    activeIcon: PanelInsightsIcon,
    accordionGroup: SidebarV2AccordionGroup.BREAKOUT_BLOCKS,
  },
];

/**
 *
 *
 * Visitor Reveal Accordion Section
 * Contains visitor intelligence and analytics features
 */
export const VISITOR_REVEAL_ITEMS: SidebarV2LinkItem[] = [
  {
    navUrl: '#', // V2: Companies page - coming soon
    navItem: 'Companies',
    icon: PanelCompaniesV2Icon,
    activeIcon: PanelCompaniesV2ActiveIcon,
    accordionGroup: SidebarV2AccordionGroup.VISITOR_REVEAL,
  },
  {
    navUrl: '/visitors', // V2 feature - new page to be built at the end, blank for now
    navItem: 'Visitors',
    icon: PanelVisitorsV2Icon,
    activeIcon: PanelVisitorsV2ActiveIcon,
    accordionGroup: SidebarV2AccordionGroup.VISITOR_REVEAL,
  },
  {
    navUrl: '#', // V2 feature - coming soon, blank for now
    navItem: 'ICP',
    icon: PanelIcpV2Icon,
    activeIcon: PanelIcpV2ActiveIcon,
    accordionGroup: SidebarV2AccordionGroup.VISITOR_REVEAL,
  },
];

/**
 * All accordion sections configuration
 */
export const SIDEBAR_V2_ACCORDION_SECTIONS: SidebarV2AccordionSection[] = [
  {
    title: SidebarV2AccordionGroup.BREAKOUT_BLOCKS,
    items: BREAKOUT_BLOCKS_ITEMS,
    defaultOpen: true, // Open by default
  },
  {
    title: SidebarV2AccordionGroup.VISITOR_REVEAL,
    items: VISITOR_REVEAL_ITEMS,
    defaultOpen: false, // Open by default
  },
];

/**
 * Flat list of all main navigation items (for easier filtering/searching)
 */
export const SIDEBAR_V2_MAIN_ITEMS: SidebarV2LinkItem[] = [...BREAKOUT_BLOCKS_ITEMS, ...VISITOR_REVEAL_ITEMS];

// ============================================================================
// SETTINGS NAVIGATION ITEMS
// ============================================================================

/**
 * Settings items - displayed below accordions in the sidebar
 */
export const SIDEBAR_V2_SETTINGS_ITEMS: SidebarV2LinkItem[] = [
  // Workspace Settings
  {
    navUrl: `/${AppRoutesEnum.SETTINGS}/${AppRoutesEnum.INTEGRATIONS}`,
    navItem: 'Integrations',
    icon: PanelIntegrationsIcon,
    activeIcon: PanelIntegrationsActiveIcon,
    settingsGroup: SidebarV2SettingsGroup.WORKSPACE_SETTINGS,
  },
  {
    navUrl: `/${AppRoutesEnum.SETTINGS}/${AppRoutesEnum.CALENDAR}`,
    navItem: 'Calendar',
    icon: CalendarIcon,
    activeIcon: CalendarIcon,
    settingsGroup: SidebarV2SettingsGroup.WORKSPACE_SETTINGS,
  },
  // Account Settings
  {
    navUrl: `/${AppRoutesEnum.SETTINGS}/${AppRoutesEnum.PROFILE}`,
    navItem: 'Profile',
    icon: PanelProfileIcon,
    activeIcon: PanelProfileActiveIcon,
    settingsGroup: SidebarV2SettingsGroup.ACCOUNT_SETTINGS,
  },
];

/**
 * Additional navigation items configuration
 */
export const SIDEBAR_V2_ADDITIONAL_ITEMS: SidebarV2LinkItem[] = [
  {
    navUrl: `/${AppRoutesEnum.AGENT_BRANDING}`,
    navItem: 'Branding',
    icon: PanelAgentIcon,
    activeIcon: PanelAgentActiveIcon,
  },
  {
    navUrl: `/${AppRoutesEnum.AGENT_CONTROLS}`,
    navItem: 'Controls',
    icon: PanelAgentIcon,
    activeIcon: PanelAgentActiveIcon,
  },
];
