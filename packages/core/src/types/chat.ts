import { z } from "zod";
import { Feedback } from "./session";
import { DataSourceSchema } from "./common";

export const MediaSchema = z.object({
  type: z.enum(["IMAGE", "VIDEO"]),
  url: z.string(),
});

export const MessageSchema = z.object({
  message_id: z.number(),
  response_id: z.string().nullable(),
  session_id: z.string(),
  role: z.enum(["user", "ai"]),
  message: z.string(),
  media: MediaSchema.nullable(),
  documents: z.array(DataSourceSchema),
  suggested_questions: z.array(z.string()),
});

export const AIResponseSchema = z.object({
  response_id: z.string(),
  message: z.string(),
  media: MediaSchema.nullable(),
  is_complete: z.boolean(),
  documents: z.array(DataSourceSchema),
  is_loading: z.boolean().optional(),
  suggested_questions: z.array(z.string()),
  showFeedbackOptions: z.boolean().optional(),
});

export type Message = {
  id: number | string;
  // response_id: string | null;
  // id: number | string | null; // temporary to accomodate backend changes
  message: string;
  media: z.infer<typeof MediaSchema> | null;
  documents: z.infer<typeof DataSourceSchema>[];
  role: z.infer<typeof MessageSchema>["role"];
  suggested_questions?: string[];
  isPartOfHistory?: boolean;
  is_loading?: boolean;
  is_complete?: boolean;
  feedback?: Feedback;
  showFeedbackOptions?: boolean;
};

export type AIResponse = z.infer<typeof AIResponseSchema>;
