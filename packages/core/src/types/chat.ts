import { z } from "zod";
import { FeedbackEnum } from "./feedback";

export const DocumentSchema = z.object({
  id: z.number(),
  data_source_id: z.number(),
  title: z.string(),
  url: z.string(),
  data_source_name: z.string(),
  data_source_type: z.string(),
});

export const MediaSchema = z.object({
  type: z.enum(["IMAGE", "VIDEO"]),
  url: z.string(),
});

export const MessageSchema = z.object({
  message_id: z.number(),
  session_id: z.string(),
  role: z.enum(["user", "ai"]),
  message: z.string(),
  media: MediaSchema.nullable(),
  documents: z.array(DocumentSchema),
  suggested_questions: z.array(z.string()),
});

export const AIResponseSchema = z.object({
  response_id: z.string(),
  message: z.string(),
  media: MediaSchema.nullable(),
  is_complete: z.boolean(),
  documents: z.array(DocumentSchema),
  is_loading: z.boolean().optional(),
  suggested_questions: z.array(z.string()),
  showFeedbackOptions: z.boolean().optional(),
});

export type Message = {
  id: number | string;
  // id: number | string | null; // temporary to accomodate backend changes
  message: string;
  media: z.infer<typeof MediaSchema> | null;
  documents: z.infer<typeof DocumentSchema>[];
  role: z.infer<typeof MessageSchema>["role"];
  suggested_questions?: string[];
  isPartOfHistory?: boolean;
  is_loading?: boolean;
  is_complete?: boolean;
  feedback_type?: FeedbackEnum;
  feedback?: string;
  showFeedbackOptions?: boolean;
};

export type AIResponse = z.infer<typeof AIResponseSchema>;
