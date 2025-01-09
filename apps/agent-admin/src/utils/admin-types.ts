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
