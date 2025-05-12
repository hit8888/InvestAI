import { z } from 'zod';

// Base schema with common fields
const baseAgentConfigSchema = z.object({
  name: z.string(),
  metadata: z.object({
    logo: z.string(),
  }),
  configs: z.object({
    'agent_personalization:style': z.object({
      primary: z.string(),
      secondary: z.string(),
      orb_config: z.object({
        show_orb: z.boolean(),
        logo_url: z.string().nullable(),
      }),
    }),
  }),
});

// Response schema extends base schema with id
export const agentConfigSchema = baseAgentConfigSchema.extend({
  id: z.number(),
});

// Payload schema is the same as base schema
export const agentConfigPayloadSchema = baseAgentConfigSchema;

export type AgentConfigResponse = z.infer<typeof agentConfigSchema>;
export type AgentConfigPayload = z.infer<typeof agentConfigPayloadSchema>;
