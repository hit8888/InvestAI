import { z } from "zod";
import {
  ArtifactEnumSchema,
  ArtifactSchema,
  DemoArtifactSchema,
  SlideArtifactSchema,
  VideoArtifactSchema,
} from "./artifact";
import { DataSourceSchema } from "./common";
import { Feedback } from "./session";

export const MediaSchema = z.object({
  type: z.enum(["IMAGE", "VIDEO"]),
  url: z.string(),
});

export const AnalyticsSchema = z.object({
  buyer_intent_score: z.number().optional().nullable(),
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
  analytics: AnalyticsSchema,
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
  analytics: AnalyticsSchema,
  artifact: z
    .object({
      artifact_type: ArtifactEnumSchema,
      artifact_id: z.string(),
    })
    .optional(),
});

export type SlideArtifactType = z.infer<typeof SlideArtifactSchema>;

export type DemoArtifactType = z.infer<typeof DemoArtifactSchema>;

export type VideoArtifactType = z.infer<typeof VideoArtifactSchema>;

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
  isReadOnly?: boolean;
  analytics: z.infer<typeof AnalyticsSchema>;
};

export type AIResponse = z.infer<typeof AIResponseSchema>;

export type Artifact = z.infer<typeof ArtifactSchema>;

export type ArtifactEnum = z.infer<typeof ArtifactEnumSchema>;
