import { AppRoutesEnum } from './constants';
import {
  CalendarIcon,
  MessageSquareText,
  IdCard,
  GraduationCap,
  Milestone,
  Users,
  Blocks,
  ToyBrick,
  CircleUser,
  Brain,
  Dices,
  MessagesSquare,
  LogOut,
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
  isActionItem?: boolean; // For logout and other action items
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
    navUrl: `/${AppRoutesEnum.AGENT_KNOWLEDGE_BASE}`, // V1: Same as V1
    navItem: 'Knowledge Base',
    icon: GraduationCap,
    activeIcon: GraduationCap,
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
    navUrl: `/${AppRoutesEnum.AI_BLOCKS}`,
    navItem: 'AI Blocks',
    icon: Blocks,
    activeIcon: Blocks,
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
