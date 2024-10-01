import { z } from "zod";
import { MessageSchema } from "./chat";

export const FeedbackSchema = z.object({
  response_id: z.string(),
  positive_feedback: z.boolean(),
  category: z.string().nullable().optional(),
  remarks: z.string().nullable().optional(),
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
  body: z.object({
    default_error_message: z.string(),
    welcome_message: z.object({
      message: z.string(),
      suggested_questions: z.array(z.string()),
    }),
    chat_history: z.array(MessageSchema),
    feedback: z.array(FeedbackSchema).optional(),
  }),
  style_config: z.object({
    primary: z.string().optional(),
    primary_foreground: z.string().optional(),
    secondary: z.string().optional(),
    secondary_foreground: z.string().optional(),
    card: z.string().optional(),
    card_foreground: z.string().optional(),
  }),
  whitelisted_domains: z.array(z.string()),
});

export const SessionSchema = z.object({
  agent_id: z.number(),
  session_id: z.string(),
  prospect_id: z.string(),
  configuration: ConfigurationSchema,
});

export type Configuration = z.infer<typeof ConfigurationSchema>;

export type Session = z.infer<typeof SessionSchema>;

export type Feedback = Omit<z.infer<typeof FeedbackSchema>, "response_id">;
