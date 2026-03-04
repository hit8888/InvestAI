import z from 'zod';
import { FunnelStepSchema } from '@neuraltrade/core/types/admin/api';
import { ConversationChipLabelEnum } from './constants';

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

export enum ActiveConversationAttachmentOption {
  DOCUMENT = 'document',
  MY_CALENDAR = 'my-calendar',
  ALL_CALENDAR = 'all-calendar',
  NONE = '',
}

export interface DistributionItem {
  count: number;
  percentage: number;
  [key: string]: string | number; // Allow for different name fields like buyer_intent, country_name, product_name
}

export interface PieChartDataItem {
  name: string;
  value: number;
  percentage: number;
  groupedItems?: Array<{
    name: string;
    value: number;
    percentage: number;
  }>;
}
