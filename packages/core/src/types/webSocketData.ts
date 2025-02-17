import { z } from 'zod';
import {
  ArtifactEnumSchema,
  FormArtifactMetadata,
  FormArtifactSchema,
  FormFieldSchema,
  SlideArtifactSchema,
  SlideImageArtifactSchema,
  SuggestionArtifactSchema,
  VideoArtifactSchema,
} from './artifact';
import { DataSourceSchema } from './common';

export const ScriptStepDTO = z.object({
  message: z.string(),
  asset_url: z.string().optional(),
  audio_url: z.string().optional(),
  is_end: z.boolean(),
  asset_type: z.enum(['IMAGE', 'VIDEO']).nullable(),
});

export type ScriptStepType = z.infer<typeof ScriptStepDTO>;

export const FeatureSelectionDTOSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
});

export type FeatureSelectionDTOType = z.infer<typeof FeatureSelectionDTOSchema>;

export const ArtifactBaseSchema = z.object({
  artifact_type: ArtifactEnumSchema,
  artifact_id: z.string(),
});

export const ArtifactFormSchema = z.object({
  artifact_id: z.string(),
  form_data: z.record(z.string(), z.any()),
});

export type ArtifactBaseType = z.infer<typeof ArtifactBaseSchema>;

export type ArtifactFormType = z.infer<typeof ArtifactFormSchema>;

export const ActorSchema = z.enum(['SALES', 'DEMO', 'ARTIFACT', 'ANALYTICS']);
export const MessageTypeSchema = z.enum(['TEXT', 'STREAM', 'ARTIFACT', 'EVENT']);

export const BaseMessageContentSchema = z.object({
  content: z.string(),
});

export const StreamMessageContentSchema = BaseMessageContentSchema.extend({
  is_complete: z.boolean(),
});

// More specific schema for artifact messages that enforces proper structure
export const ArtifactMessageContentSchema = BaseMessageContentSchema.extend({
  artifact_type: ArtifactEnumSchema,
  artifact_data: ArtifactBaseSchema.extend({
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

export type MessageAnalyticsEventData = z.infer<typeof MessageAnalyticsEventDataSchema>;

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

export const EventMessageContentSchema = z.discriminatedUnion('event_type', [
  z.object({
    content: z.string(),
    event_type: z.literal('MESSAGE_ANALYTICS'),
    event_data: MessageAnalyticsEventDataSchema,
  }),
  z.object({
    content: z.string(),
    event_type: z.literal('GENERATING_ARTIFACT'),
    event_data: GeneratingArtifactEventDataSchema,
  }),
  z.object({
    content: z.string(),
    event_type: z.literal('DEMO_AVAILABLE'),
    event_data: DemoEventDataSchema,
  }),
  z.object({
    content: z.string(),
    event_type: z.literal('DEMO_OPTIONS'),
    event_data: z.object({}),
  }),
  z.object({
    content: z.string(),
    event_type: z.literal('DEMO_PREPARE'),
    event_data: z.object({}),
  }),
  z.object({
    content: z.string(),
    event_type: z.literal('DEMO_QUESTION'),
    event_data: z.object({}),
  }),
  z.object({
    content: z.string(),
    event_type: z.literal('ARTIFACT_CONSUMED'),
    event_data: ArtifactBaseSchema,
  }),
  z.object({
    content: z.string(),
    event_type: z.literal('FORM_FILLED'),
    event_data: ArtifactFormSchema,
  }),
  z.object({
    content: z.string(),
    event_type: z.literal('DEMO_NEXT'),
    event_data: z.object({
      feature_ids: z.array(z.number()).optional(),
    }),
  }),
  z.object({
    content: z.string(),
    event_type: z.literal('DEMO_END'),
    event_data: z.object({}),
  }),
]);

export const WebSocketMessageSchema = z
  .object({
    session_id: z.string(),
    response_id: z.string(),
    role: z.enum(['user', 'ai']),
    actor: ActorSchema.optional(),
    documents: z.array(DataSourceSchema).optional().nullable(),
    timestamp: z.string(),
    is_admin: z.boolean().optional(),
  })
  .and(
    z.discriminatedUnion('message_type', [
      z.object({
        message_type: z.literal('TEXT'),
        message: BaseMessageContentSchema,
      }),
      z.object({
        message_type: z.literal('STREAM'),
        message: StreamMessageContentSchema,
      }),
      z.object({
        message_type: z.literal('ARTIFACT'),
        message: ArtifactMessageContentSchema,
      }),
      z.object({
        message_type: z.literal('EVENT'),
        message: EventMessageContentSchema,
      }),
    ]),
  );

export type ArtifactMessageContent = z.infer<typeof ArtifactMessageContentSchema>;

export type StreamMessageContent = z.infer<typeof StreamMessageContentSchema>;

export type BaseMessageContent = z.infer<typeof BaseMessageContentSchema>;

export type EventMessageContent = z.infer<typeof EventMessageContentSchema>;

export type WebSocketMessage = z.infer<typeof WebSocketMessageSchema>;

export type DemoEventData = z.infer<typeof DemoEventDataSchema>;

export type ChatHistory = WebSocketMessage[];

export type FormFieldType = z.infer<typeof FormFieldSchema>;

export type FormArtifactMetadataType = z.infer<typeof FormArtifactMetadata>;

export type DataSourceType = z.infer<typeof DataSourceSchema>;

export enum AgentEventType {
  MESSAGE_ANALYTICS = 'MESSAGE_ANALYTICS',
  GENERATING_ARTIFACT = 'GENERATING_ARTIFACT',
  DEMO_AVAILABLE = 'DEMO_AVAILABLE',
  DEMO_OPTIONS = 'DEMO_OPTIONS',
  DEMO_PREPARE = 'DEMO_PREPARE',
  DEMO_QUESTION = 'DEMO_QUESTION',
  DEMO_NEXT = 'DEMO_NEXT',
  DEMO_END = 'DEMO_END',
  ARTIFACT_CONSUMED = 'ARTIFACT_CONSUMED',
  FORM_FILLED = 'FORM_FILLED',
}
