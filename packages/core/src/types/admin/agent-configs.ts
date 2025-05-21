import { z } from 'zod';

const WelcomeMessageSchema = z.object({
  message: z.string(),
  suggested_questions: z.array(z.string()).optional(),
  is_dynamic: z.boolean(),
  bounce_message: z.boolean(),
});

export const AgentSchema = z.object({
  id: z.number(),
  name: z.string(),
  metadata: z.object({
    logo: z.string(),
    welcome_message: WelcomeMessageSchema,
  }),
  configs: z.object({}),
});

const OrbConfigSchema = z.object({
  show_orb: z.boolean(),
  logo_url: z.string().nullable(),
});

const BannerConfigSchema = z.object({
  show_banner: z.boolean(),
  header: z.string().optional().nullish(),
  subheader: z.string().optional().nullish(),
});

// Base schema with common fields
const baseAgentConfigSchema = z.object({
  name: z.string(),
  metadata: z.object({
    logo: z.string(),
    welcome_message: WelcomeMessageSchema,
  }),
  configs: z.object({
    'agent_personalization:style': z.object({
      primary: z.string(),
      secondary: z.string(),
      orb_config: OrbConfigSchema,
      banner_config: BannerConfigSchema,
      entry_point_alignment: z.string(),
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
export type AgentType = z.infer<typeof AgentSchema>;
