import { z } from "zod";
import {
  ArtifactEnumSchema,
  ArtifactSchema, ChatBoxArtifactEnumSchema,
  DemoArtifactSchema,
  SlideArtifactSchema,
  SlideImageArtifactSchema, SplitScreenArtifactEnumSchema,
  SuggestionArtifactSchema,
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

export const MessageArtifactSchema = z.object({
  artifact_type: ArtifactEnumSchema,
  artifact_id: z.string(),
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
  artifacts: z.array(MessageArtifactSchema),
});


export const WebSocketArtifactsSchema = z.object({
  artifact_type: ArtifactEnumSchema,
  artifact_id: z.string(),
})


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
  artifacts: z.array(WebSocketArtifactsSchema),
});

export type SlideArtifactType = z.infer<typeof SlideArtifactSchema>;
export type SlideImageArtifactType = z.infer<typeof SlideImageArtifactSchema>;

export type DemoArtifactType = z.infer<typeof DemoArtifactSchema>;

export type VideoArtifactType = z.infer<typeof VideoArtifactSchema>;

export type SuggestionArtifactType = z.infer<typeof SuggestionArtifactSchema>;

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
  artifact?: z.infer<typeof MessageArtifactSchema>;
};

export type AIResponse = z.infer<typeof AIResponseSchema>;

export type Artifact = z.infer<typeof ArtifactSchema>;

export type ArtifactEnum = z.infer<typeof ArtifactEnumSchema>;

export type SplitScreenArtifactType = z.infer<typeof SplitScreenArtifactEnumSchema>;

export type ChatBoxArtifactType = z.infer<typeof ChatBoxArtifactEnumSchema>;
