import { z } from "zod";
import {
  ArtifactEnumSchema,
  ArtifactSchema,
  ChatBoxArtifactEnumSchema,
  FormArtifactMetadata,
  FormArtifactSchema,
  FormFieldSchema,
  SlideArtifactSchema,
  SlideImageArtifactSchema,
  SplitScreenArtifactEnumSchema,
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

export const ScriptStepDTO = z.object({
  message: z.string(),
  asset_url: z.string().optional(),
  audio_url: z.string().optional(),
  is_end: z.boolean(),
});

export type ScriptStepType = z.infer<typeof ScriptStepDTO>;

export const MessageSchema = z.object({
  message_id: z.number(),
  response_id: z.string(),
  session_id: z.string(),
  role: z.enum(["user", "ai"]),
  message: z.string(),
  documents: z.array(DataSourceSchema),
  suggested_questions: z.array(z.string()),
  analytics: AnalyticsSchema,
  script_step: ScriptStepDTO.optional(),
  demo_available: z.boolean().optional(),
  artifacts: z.array(MessageArtifactSchema),
  type: z.enum(["text", "event"]),
  is_complete: z.boolean().optional(),
});

export const WebSocketArtifactsSchema = z.object({
  artifact_type: ArtifactEnumSchema,
  artifact_id: z.string(),
});

export const AIResponseSchema = z.object({
  response_id: z.string(),
  message: z.string(),
  role: z.enum(["user", "ai"]),
  is_complete: z.boolean().optional(),
  documents: z.array(DataSourceSchema),
  is_loading: z.boolean().optional(),
  suggested_questions: z.array(z.string()),
  showFeedbackOptions: z.boolean().optional(),
  analytics: AnalyticsSchema,
  artifacts: z.array(WebSocketArtifactsSchema),
  demo_available: z.boolean().optional(),
  script_step: ScriptStepDTO.optional(),
});

export type SlideArtifactType = z.infer<typeof SlideArtifactSchema>;
export type SlideImageArtifactType = z.infer<typeof SlideImageArtifactSchema>;

export type VideoArtifactType = z.infer<typeof VideoArtifactSchema>;

export type SuggestionArtifactType = z.infer<typeof SuggestionArtifactSchema>;

export type FormArtifactType = z.infer<typeof FormArtifactSchema>;

export type FormFieldType = z.infer<typeof FormFieldSchema>;

export type FormArtifactMetadataType = z.infer<typeof FormArtifactMetadata>;

export type Message = {
  id: number | string;
  message: string;
  documents: z.infer<typeof DataSourceSchema>[];
  role: z.infer<typeof MessageSchema>["role"];
  suggested_questions?: string[];
  is_loading?: boolean;
  is_complete?: boolean;
  feedback?: Feedback;
  showFeedbackOptions?: boolean;
  isReadOnly?: boolean;
  analytics: z.infer<typeof AnalyticsSchema>;
  artifact?: z.infer<typeof MessageArtifactSchema>;
  chatArtifact?: z.infer<typeof MessageArtifactSchema>;
  scriptStep?: z.infer<typeof ScriptStepDTO>;
  demoAvailable?: boolean;
  type?: z.infer<typeof MessageSchema>["type"];
};

export type AIResponse = z.infer<typeof AIResponseSchema>;

export type ArtifactResponse = z.infer<typeof ArtifactSchema>;

export type ArtifactEnum = z.infer<typeof ArtifactEnumSchema>;

export type SplitScreenArtifactType = z.infer<
  typeof SplitScreenArtifactEnumSchema
>;

export type ChatBoxArtifactType = z.infer<typeof ChatBoxArtifactEnumSchema>;

export type AnalyticsType = z.infer<typeof AnalyticsSchema>;

export type DataSourceType = z.infer<typeof DataSourceSchema>;
