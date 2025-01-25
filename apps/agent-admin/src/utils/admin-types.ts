import z from 'zod';
import { FunnelStepSchema } from '@meaku/core/types/admin/api';
import { ConversationChipLabelEnum } from './constants';
import { CONVERSATIONS_PAGE_TYPE, LEADS_PAGE_TYPE } from '@meaku/core/types/admin/admin';

// Desired data type for FunnelData
export type FunnelData = {
  funnelChipType: ConversationChipLabelEnum;
  funnelChipLabel: string;
  funnelNumericLabel: string; // Formatted number or 'N/A'
  funnelKey: ConversationChipLabelEnum;
};

export type PageTypeProps = {
  page: LEADS_PAGE_TYPE | CONVERSATIONS_PAGE_TYPE;
};

export type FunnelStep = z.infer<typeof FunnelStepSchema>;
