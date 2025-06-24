import z from 'zod';
import { FunnelStepSchema } from '@meaku/core/types/admin/api';
import { ConversationChipLabelEnum, NavigationGroup } from './constants';

// Desired data type for FunnelData
export type FunnelData = {
  funnelChipType: ConversationChipLabelEnum;
  funnelChipLabel: string;
  funnelNumericLabel: string; // Formatted number or 'N/A'
  funnelKey: ConversationChipLabelEnum;
};

export type FunnelStep = z.infer<typeof FunnelStepSchema>;

export type ConversationRightSideDetailsType = {
  itemLabel: string;
  itemKey: string;
  ItemIcon: React.ElementType; // If it's a React component
};

export interface NavLinkItemsType {
  navUrl: string;
  navItem: string;
  isActive: boolean;
  hasChildren?: boolean;
  children?: NavItemChildrenType[];
  navImg: React.ReactNode;
}

export interface NavItemChildrenType {
  navItem: string;
  navUrl: string;
  isActive: boolean;
}

export type NavLinkItem = {
  navUrl: string;
  navItem: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  activeIcon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  children?: NavLinkItem[];
  group?: NavigationGroup;
};
