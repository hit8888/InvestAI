import z from 'zod';
import { FunnelStepSchema } from '@meaku/core/types/admin/api';
import { ConversationChipLabelEnum } from './constants';

// Desired data type for FunnelData
export type FunnelData = {
  funnelChipType: ConversationChipLabelEnum;
  funnelChipLabel: string;
  funnelNumericLabel: string; // Formatted number or 'N/A'
  funnelKey: ConversationChipLabelEnum;
};

export type FunnelStep = z.infer<typeof FunnelStepSchema>;

export type ProspectDetailsType = { name: string; email: string; location: string };

export type CompanyDetailsType = {
  name: string;
  logoUrl?: string;
  location: string;
  revenue: string;
  employees: string;
  domain: string;
  foundationDate: string;
};

export type ConversationRightSideDetailsType = {
  itemLabel: string;
  itemKey: string;
  ItemIcon: React.ElementType; // If it's a React component
};
