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
import { DemoEvent } from "./webSocket";

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
  asset_type: z.enum(["IMAGE", "VIDEO"]).nullable(),
});

export type ScriptStepType = z.infer<typeof ScriptStepDTO>;

export const FeatureSelectionDTOSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
});

export type FeatureSelectionDTOType = z.infer<typeof FeatureSelectionDTOSchema>;

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
  features: z.array(FeatureSelectionDTOSchema).optional(),
  artifacts: z.array(MessageArtifactSchema),
  type: z.enum(["text", "event"]),
  is_complete: z.boolean().optional(),
  timestamp: z.string().optional(),
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
  features: z.array(FeatureSelectionDTOSchema).optional(),
  script_step: ScriptStepDTO.optional(),
  response_audio_url: z.string().optional(),
  event_type: z
    .enum([
      "DEMO_PREPARE",
      "DEMO_NEXT",
      "DEMO_END",
      "DEMO_QUESTION",
      "DEMO_OPTIONS",
    ])
    .optional(),
  timestamp: z.string().optional(),
});

export type SlideArtifactContent = z.infer<typeof SlideArtifactSchema>;
export type SlideImageArtifactContent = z.infer<
  typeof SlideImageArtifactSchema
>;

export type VideoArtifactContent = z.infer<typeof VideoArtifactSchema>;

export type SuggestionArtifactContent = z.infer<
  typeof SuggestionArtifactSchema
>;

export type FormArtifactContent = z.infer<typeof FormArtifactSchema>;

export type FormFieldType = z.infer<typeof FormFieldSchema>;

export type ArtifactContent =
  | SlideImageArtifactContent
  | SlideArtifactContent
  | VideoArtifactContent
  | FormArtifactContent
  | SuggestionArtifactContent;

export type FormArtifactMetadataType = z.infer<typeof FormArtifactMetadata>;

export type Message = {
  id: number | string;
  message: string;
  timestamp?: string;
  documents: z.infer<typeof DataSourceSchema>[];
  role: z.infer<typeof MessageSchema>["role"];
  suggested_questions?: string[];
  is_loading?: boolean;
  is_complete?: boolean;
  feedback?: Feedback;
  showFeedbackOptions?: boolean;
  isReadOnly?: boolean;
  analytics: AnalyticsType;
  artifact?: MessageArtifactType;
  chatArtifact?: MessageArtifactType;
  scriptStep?: z.infer<typeof ScriptStepDTO>;
  demoAvailable?: boolean;
  features: z.infer<typeof FeatureSelectionDTOSchema>[];
  response_audio_url?: string;
  event_type?: DemoEvent;
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

export type MessageArtifactType = z.infer<typeof MessageArtifactSchema>;

export type DataSourceType = z.infer<typeof DataSourceSchema>;

export const ActorSchema = z.enum(["SALES", "DEMO", "ARTIFACT", "ANALYTICS"]);
export const MessageTypeSchema = z.enum([
  "TEXT",
  "STREAM",
  "ARTIFACT",
  "EVENT",
]);

export const BaseMessageContentSchema = z.object({
  content: z.string(),
});

export const StreamMessageContentSchema = BaseMessageContentSchema.extend({
  is_complete: z.boolean(),
});

export const ArtifactMessageContentSchema = BaseMessageContentSchema.extend({
  artifact_type: ArtifactEnumSchema,
  artifact_data: z.object({
    artifact_id: z.string(),
    artifact_type: ArtifactEnumSchema,
    content: z.union([
      SlideArtifactSchema,
      VideoArtifactSchema,
      SlideImageArtifactSchema,
      SuggestionArtifactSchema,
      FormArtifactSchema,
    ]),
    metadata: FormArtifactMetadata,
    error: z.string().nullable(),
    error_code: z.string().nullable(),
  }),
});

export const MessageAnalyticsEventDataSchema = z.object({
  buyer_intent_score: z.number(),
});

export const GeneratingArtifactEventDataSchema = z.object({
  artifact_type: ArtifactEnumSchema,
});

export const DemoEventDataSchema = z.object({
  demo_available: z.boolean(),
  features: z.array(FeatureSelectionDTOSchema),
  script_step: ScriptStepDTO.nullable(),
  response: z.string().nullable(),
  response_audio_url: z.string().nullable(),
});

export const EventDataSchema = z.discriminatedUnion("event_type", [
  z.object({
    event_type: z.literal("MESSAGE_ANALYTICS"),
    event_data: MessageAnalyticsEventDataSchema,
  }),
  z.object({
    event_type: z.literal("GENERATING_ARTIFACT"),
    event_data: GeneratingArtifactEventDataSchema,
  }),
  z.object({
    event_type: z.literal("DEMO_AVAILABLE"),
    event_data: DemoEventDataSchema,
  }),
  z.object({
    event_type: z.literal("DEMO_OPTIONS"),
    event_data: DemoEventDataSchema,
  }),
  z.object({
    event_type: z.literal("DEMO_PREPARE"),
    event_data: DemoEventDataSchema,
  }),
  z.object({
    event_type: z.literal("DEMO_QUESTION"),
    event_data: DemoEventDataSchema,
  }),
  z.object({
    event_type: z.literal("DEMO_NEXT"),
    event_data: DemoEventDataSchema,
  }),
  z.object({
    event_type: z.literal("DEMO_END"),
    event_data: DemoEventDataSchema,
  }),
]);

export const EventMessageContentSchema = BaseMessageContentSchema.extend({
  event_type: z.enum([
    "MESSAGE_ANALYTICS",
    "GENERATING_ARTIFACT",
    "DEMO_AVAILABLE",
    "DEMO_OPTIONS",
    "DEMO_PREPARE",
    "DEMO_QUESTION",
    "DEMO_NEXT",
    "DEMO_END",
  ]),
  event_data: z.union([
    MessageAnalyticsEventDataSchema,
    GeneratingArtifactEventDataSchema,
    DemoEventDataSchema,
  ]),
});

export const WebSocketResponseSchema = z.object({
  session_id: z.string(),
  response_id: z.string(),
  role: z.enum(["user", "ai"]),
  actor: ActorSchema,
  message_type: MessageTypeSchema,
  message: z.union([
    BaseMessageContentSchema,
    StreamMessageContentSchema,
    ArtifactMessageContentSchema,
    EventMessageContentSchema,
  ]),
  documents: z.array(DataSourceSchema),
  timestamp: z.string(),
});
