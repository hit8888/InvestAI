import { AppRoutesEnum } from './constants';
import PanelAiBlocksIcon from '@breakout/design-system/components/icons/panel-ai-blocks-icon';
import PanelAiBlocksActiveIcon from '@breakout/design-system/components/icons/panel-ai-blocks-active-icon';
import PanelPlaygroundV2Icon from '@breakout/design-system/components/icons/panel-playground-v2-icon';
import PanelPlaygroundV2ActiveIcon from '@breakout/design-system/components/icons/panel-playground-v2-active-icon';
import {
  CalendarIcon,
  MessageSquareText,
  IdCard,
  Database,
  Award,
  Milestone,
  LayoutTemplate,
  Users,
  ToyBrick,
  CircleUser,
  Brain,
  MessagesSquare,
} from 'lucide-react';

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
  badge?: string; // Short text displayed in collapsed sidebar (e.g., 'BB', 'VR')
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
  icon: Brain,
  activeIcon: Brain,
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
    icon: MessagesSquare,
    activeIcon: MessagesSquare,
    accordionGroup: SidebarV2AccordionGroup.BREAKOUT_BLOCKS,
    requiredFeatureFlag: 'active_conversations_enabled',
  },
  {
    navUrl: `/${AppRoutesEnum.CONVERSATIONS}`, // V1: Visitors page / All Visitors Tab
    navItem: 'All Chats',
    icon: MessageSquareText,
    activeIcon: MessageSquareText,
    accordionGroup: SidebarV2AccordionGroup.BREAKOUT_BLOCKS,
  },
  {
    navUrl: `/${AppRoutesEnum.ACTIVE_LEADS}`, // V1: Visitors page / Breakout Captured Leads tab
    navItem: 'Leads',
    icon: IdCard,
    activeIcon: IdCard,
    accordionGroup: SidebarV2AccordionGroup.BREAKOUT_BLOCKS,
  },
  {
    navUrl: `/${AppRoutesEnum.AGENT_DATA_SOURCES}`, // V1: Same as V1
    navItem: 'Data Sources',
    icon: Database,
    activeIcon: Database,
    accordionGroup: SidebarV2AccordionGroup.BREAKOUT_BLOCKS,
  },
  {
    navUrl: `/${AppRoutesEnum.AGENT_BRANDING}`, // V1: Agent > Branding
    navItem: 'Branding',
    icon: Award,
    activeIcon: Award,
    accordionGroup: SidebarV2AccordionGroup.BREAKOUT_BLOCKS,
  },
  {
    navUrl: `/${AppRoutesEnum.AGENT_ENTRYPOINTS}`, // V1: Agent > Entry Points
    navItem: 'Entry Points',
    icon: Milestone,
    activeIcon: Milestone,
    accordionGroup: SidebarV2AccordionGroup.BREAKOUT_BLOCKS,
  },
  {
    navUrl: `/${AppRoutesEnum.AGENT_CONTROLS}`, // Controls entry point
    navItem: 'Controls',
    icon: LayoutTemplate,
    activeIcon: LayoutTemplate,
    accordionGroup: SidebarV2AccordionGroup.BREAKOUT_BLOCKS,
  },
  {
    navUrl: `/${AppRoutesEnum.AI_BLOCKS}`,
    navItem: 'AI Blocks',
    icon: PanelAiBlocksIcon,
    activeIcon: PanelAiBlocksActiveIcon,
    accordionGroup: SidebarV2AccordionGroup.BREAKOUT_BLOCKS,
  },
  {
    navUrl: `/${AppRoutesEnum.TRAINING_PLAYGROUND}`, // Disabled - coming soon
    navItem: 'Playground',
    icon: PanelPlaygroundV2Icon,
    activeIcon: PanelPlaygroundV2ActiveIcon,
    accordionGroup: SidebarV2AccordionGroup.BREAKOUT_BLOCKS,
  },
];

/**
 * Visitor Reveal Accordion Section
 * Contains visitor intelligence and analytics features
 */
export const VISITOR_REVEAL_ITEMS: SidebarV2LinkItem[] = [
  {
    navUrl: '/visitors', // V2 feature - new page to be built at the end, blank for now
    navItem: 'Visitors',
    icon: Users,
    activeIcon: Users,
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
    badge: 'BB', // Badge text shown in collapsed sidebar
  },
  {
    title: SidebarV2AccordionGroup.VISITOR_REVEAL,
    items: VISITOR_REVEAL_ITEMS,
    defaultOpen: false, // Open by default
    badge: 'VR', // Badge text shown in collapsed sidebar
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
    icon: ToyBrick,
    activeIcon: ToyBrick,
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
    icon: CircleUser,
    activeIcon: CircleUser,
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
    icon: Award,
    activeIcon: Award,
  },
  {
    navUrl: `/${AppRoutesEnum.AGENT_CONTROLS}`,
    navItem: 'Controls',
    icon: LayoutTemplate,
    activeIcon: LayoutTemplate,
  },
];
