import { z } from 'zod';

export const ConfigPayloadSchema = z.object({
  parent_url: z.string().optional(),
  session_id: z.string().optional(),
  prospect_id: z.string().optional(),
});

export const ProspectPayloadSchema = z.object({});

export const ProspectResponseSchema = z.object({
  prospect_id: z.string(),
});
