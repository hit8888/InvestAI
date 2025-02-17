import { z } from "zod";
import { WebSocketMessageSchema } from "../webSocketData";
import { FeedbackRequestPayloadSchema } from "./feedback_request";
import { DataSourceSchema } from "../common";

export const CTAConfigSchema = z
  .object({
    text: z.string().nullish(),
    url: z.string().nullish(),
    message: z.string().nullish(),
  })
  .nullish();

export const BottomBarConfigSchema = z.object({
  primary_placeholder: z.string().or(z.array(z.string())),
  secondary_placeholder: z.string().or(z.array(z.string())),
});

export const ConfigurationBodySchema = z.object({
  default_error_message: z.string(),
  welcome_message: z.object({
    message: z.string(),
    suggested_questions: z.array(z.string()),
  }),
  chat_history: z.array(WebSocketMessageSchema),
  feedback: z.array(FeedbackRequestPayloadSchema).optional(),
  documents: z.array(DataSourceSchema).optional(),
  bottom_bar_config: BottomBarConfigSchema.optional(),
  disclaimer_message: z.string().optional(),
  show_cta: z.boolean().optional(),
  cta_config: CTAConfigSchema,
});

export const ConfigurationSchema = z.object({
  agent_id: z.number(),
  agent_name: z.string(),
  org_name: z.string(),
  logo: z.string().nullable(),
  header: z.object({
    title: z.string().nullable(),
    sub_title: z.string().nullable(),
  }),
  body: ConfigurationBodySchema,
  style_config: z.object({
    primary: z.string().optional(),
    primary_foreground: z.string().optional(),
    primary_text: z.string().optional(),
    secondary: z.string().optional(),
    secondary_foreground: z.string().optional(),
    card: z.string().optional(),
    card_foreground: z.string().optional(),
    show_banner: z.boolean().optional(),
  }),
  whitelisted_domains: z.array(z.string()),
});

export type CTAConfigType = z.infer<typeof CTAConfigSchema>;

export type BottomBarType = z.infer<typeof BottomBarConfigSchema>;

export type ConfigurationApiResponse = z.infer<typeof ConfigurationSchema>;

export type ConfigurationBodyApiResponse = z.infer<
  typeof ConfigurationBodySchema
>;
