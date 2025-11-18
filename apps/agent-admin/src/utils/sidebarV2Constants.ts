import { AppRoutesEnum, SidebarNavItemsEnum } from './constants';
import {
  CalendarIcon,
  MessageSquareText,
  UserStar,
  ToyBrick,
  CircleUser,
  Brain,
  Dices,
  MessagesSquare,
  LogOut,
  UserRoundCog,
  Workflow,
  Database,
  LayoutTemplate,
  Globe,
  ContactRound,
  Settings2,
} from 'lucide-react';

/**
 * V2 Sidebar Navigation Structure
 * Features accordion-based grouping for better organization
 */

export enum SidebarV2AccordionGroup {
  BREAKOUT_BLOCKS = 'Blocks',
  VISITOR_REVEAL = 'Reveal',
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
  isActionItem?: boolean; // For logout and other action items
}

export interface SidebarV2AccordionSection {
  title: SidebarV2AccordionGroup;
  items: SidebarV2LinkItem[];
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

export const CONFIG_ITEM: SidebarV2LinkItem = {
  navUrl: `/${AppRoutesEnum.AGENT_CONTROLS}`,
  navItem: 'Config',
  icon: Settings2,
  activeIcon: Settings2,
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
    icon: UserStar,
    activeIcon: UserStar,
    accordionGroup: SidebarV2AccordionGroup.BREAKOUT_BLOCKS,
  },
  {
    navUrl: `/${AppRoutesEnum.AGENT_DATASETS}`, // V1: Same as V1
    navItem: 'Datasets',
    icon: Database,
    activeIcon: Database,
    accordionGroup: SidebarV2AccordionGroup.BREAKOUT_BLOCKS,
  },
  {
    navUrl: `/${AppRoutesEnum.BLOCKS}`,
    navItem: 'Blocks',
    icon: LayoutTemplate,
    activeIcon: LayoutTemplate,
    accordionGroup: SidebarV2AccordionGroup.BREAKOUT_BLOCKS,
  },
  {
    navUrl: `/${AppRoutesEnum.TRAINING_PLAYGROUND}`, // Disabled - coming soon
    navItem: 'Playground',
    icon: Dices,
    activeIcon: Dices,
    accordionGroup: SidebarV2AccordionGroup.BREAKOUT_BLOCKS,
  },
];

/**
 * Visitor Reveal Accordion Section
 * Contains visitor intelligence and analytics features
 */
export const VISITOR_REVEAL_ITEMS: SidebarV2LinkItem[] = [
  {
    navUrl: `/${AppRoutesEnum.COMPANIES}`,
    navItem: 'Accounts',
    icon: Globe,
    activeIcon: Globe,
    accordionGroup: SidebarV2AccordionGroup.VISITOR_REVEAL,
  },
  {
    navUrl: `/${AppRoutesEnum.VISITORS_V2}`,
    navItem: 'Contacts',
    icon: ContactRound,
    activeIcon: ContactRound,
    accordionGroup: SidebarV2AccordionGroup.VISITOR_REVEAL,
  },
];

/**
 * All accordion sections configuration
 */
export const SIDEBAR_V2_MAIN_SECTIONS: SidebarV2AccordionSection[] = [
  {
    title: SidebarV2AccordionGroup.BREAKOUT_BLOCKS,
    items: BREAKOUT_BLOCKS_ITEMS,
  },
  {
    title: SidebarV2AccordionGroup.VISITOR_REVEAL,
    items: VISITOR_REVEAL_ITEMS,
  },
];

/**
 * Flat list of all main navigation items (for easier filtering/searching)
 */
export const SIDEBAR_V2_MAIN_ITEMS: SidebarV2LinkItem[] = [
  ...BREAKOUT_BLOCKS_ITEMS,
  ...VISITOR_REVEAL_ITEMS,
  INSIGHTS_ITEM,
  CONFIG_ITEM,
];

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
    navItem: SidebarNavItemsEnum.INTEGRATIONS_LABEL,
    icon: ToyBrick,
    activeIcon: ToyBrick,
    settingsGroup: SidebarV2SettingsGroup.WORKSPACE_SETTINGS,
  },
  {
    navUrl: `/${AppRoutesEnum.SETTINGS}/${AppRoutesEnum.CALENDAR}`,
    navItem: SidebarNavItemsEnum.AGENT_CALENDAR_LABEL,
    icon: CalendarIcon,
    activeIcon: CalendarIcon,
    settingsGroup: SidebarV2SettingsGroup.WORKSPACE_SETTINGS,
  },
  {
    navUrl: `/${AppRoutesEnum.SETTINGS}/${AppRoutesEnum.EMBEDDING_SCRIPTS}`,
    navItem: SidebarNavItemsEnum.EMBEDDING_SCRIPTS_LABEL,
    icon: Workflow,
    activeIcon: Workflow,
    settingsGroup: SidebarV2SettingsGroup.WORKSPACE_SETTINGS,
  },
  // Account Settings
  {
    navUrl: `/${AppRoutesEnum.SETTINGS}/${AppRoutesEnum.SDR_SETTINGS}`,
    navItem: SidebarNavItemsEnum.SDR_SETTINGS_LABEL,
    icon: UserRoundCog,
    activeIcon: UserRoundCog,
    settingsGroup: SidebarV2SettingsGroup.ACCOUNT_SETTINGS,
  },
  {
    navUrl: `/${AppRoutesEnum.SETTINGS}/${AppRoutesEnum.PROFILE}`,
    navItem: SidebarNavItemsEnum.PROFILE_LABEL,
    icon: CircleUser,
    activeIcon: CircleUser,
    settingsGroup: SidebarV2SettingsGroup.ACCOUNT_SETTINGS,
  },
]; /**
 * Sign out item - displayed at the bottom of settings view
 */
export const SIDEBAR_V2_SIGN_OUT_ITEM: SidebarV2LinkItem = {
  navUrl: '#logout',
  navItem: 'Sign Out',
  icon: LogOut,
  activeIcon: LogOut,
  isActionItem: true,
};
