import {
  ArtifactEnumSchema,
  CalendarArtifactSchema,
  CtaEventDataSchema,
  FormArtifactMetadata,
  FormArtifactSchema,
  QualificationQuestionAnswerSchema,
  SlideArtifactSchema,
  SlideImageArtifactSchema,
  SuggestionArtifactSchema,
  VideoArtifactSchema,
} from '../utils/artifact';
import {
  ArtifactBaseSchema,
  ArtifactFormSchema,
  BrowsedUrlSchema,
  CalendarSubmitEventDataSchema,
  DataSourceSchema,
  DeviceTypeSchema,
  ErrorEventDataSchema,
  GeneratingArtifactEventDataSchema,
  MessageAnalyticsEventDataSchema,
  StreamMessageContentSchema,
  SummarizeMessageContentSchema,
} from '../utils/types';
import { z } from 'zod';

export type MessageRoleType = 'user' | 'ai' | 'admin';
export const MessageRole = {
  USER: 'user',
  AI: 'ai',
  ADMIN: 'admin',
} as const;

export const MessageEventType = {
  TEXT_REQUEST: 'TEXT_REQUEST',
  TEXT_RESPONSE: 'TEXT_RESPONSE',
  STREAM_RESPONSE: 'STREAM_RESPONSE',
  SUGGESTED_QUESTION_CLICKED: 'SUGGESTED_QUESTION_CLICKED',
  VIDEO_ARTIFACT: 'VIDEO_ARTIFACT',
  SLIDE_ARTIFACT: 'SLIDE_ARTIFACT',
  SLIDE_IMAGE_ARTIFACT: 'SLIDE_IMAGE_ARTIFACT',
  SUGGESTIONS_ARTIFACT: 'SUGGESTIONS_ARTIFACT',
  FORM_ARTIFACT: 'FORM_ARTIFACT',
  QUALIFICATION_FORM_ARTIFACT: 'QUALIFICATION_FORM_ARTIFACT',
  CALENDAR_ARTIFACT: 'CALENDAR_ARTIFACT',
  QUALIFICATION_FORM_FILLED: 'QUALIFICATION_FORM_FILLED',
  CALENDAR_SUBMIT: 'CALENDAR_SUBMIT',
  FORM_FILLED: 'FORM_FILLED',
  BOOK_MEETING: 'BOOK_MEETING',
  DISCOVERY_ANSWER: 'DISCOVERY_ANSWER',
  DEMO_OPTIONS: 'DEMO_OPTIONS',
  DISCOVERY_QUESTIONS: 'DISCOVERY_QUESTIONS',
  JOIN_SESSION: 'JOIN_SESSION',
  LEAVE_SESSION: 'LEAVE_SESSION',
  GENERATING_ARTIFACT: 'GENERATING_ARTIFACT',
  ADMIN_TYPING: 'ADMIN_TYPING',
  USER_TYPING: 'USER_TYPING',
  SUMMARIZE: 'SUMMARIZE',
  SUMMARY_STREAM: 'SUMMARY_STREAM',
  CTA_EVENT: 'CTA_EVENT',
  USER_LEFT: 'USER_LEFT',
  PRIMARY_GOAL_CTA_CLICKED: 'PRIMARY_GOAL_CTA_CLICKED',
} as const;

export type EventTypeType =
  | 'TEXT_REQUEST'
  | 'TEXT_RESPONSE'
  | 'STREAM_RESPONSE'
  | 'SUGGESTED_QUESTION_CLICKED'
  | 'VIDEO_ARTIFACT'
  | 'SLIDE_ARTIFACT'
  | 'SLIDE_IMAGE_ARTIFACT'
  | 'SUGGESTIONS_ARTIFACT'
  | 'FORM_ARTIFACT'
  | 'QUALIFICATION_FORM_ARTIFACT'
  | 'CALENDAR_ARTIFACT'
  | 'FORM_FILLED'
  | 'QUALIFICATION_FORM_FILLED'
  | 'CALENDAR_SUBMIT'
  | 'BOOK_MEETING'
  | 'DISCOVERY_ANSWER'
  | 'DEMO_OPTIONS'
  | 'DISCOVERY_QUESTION'
  | 'JOIN_SESSION'
  | 'LEAVE_SESSION'
  | 'GENERATING_ARTIFACT'
  | 'TYPING'
  | 'ADMIN_TYPING'
  | 'USER_TYPING'
  | 'SUMMARIZE'
  | 'SUMMARY_STREAM'
  | 'CTA_EVENT'
  | 'USER_LEFT'
  | 'PRIMARY_GOAL_CTA_CLICKED'
  | string; // future-proofing

// Individual event data structures
export interface StreamResponseEventData {
  content: string;
  is_complete?: boolean;
}

export interface SuggestedQuestionClickedEventData {
  content: string;
  question: string;
  clicked_at: string;
  response?: string;
  processed_at?: string;
}

export const BaseMessageContentSchema = z.object({
  content: z.string(),
});

// More specific schema for artifact messages that enforces proper structure
export const ArtifactMessageContentSchema = z.object({
  artifact_type: ArtifactEnumSchema,
  artifact_data: ArtifactBaseSchema.extend({
    content: z
      .union([
        SlideArtifactSchema,
        VideoArtifactSchema,
        SlideImageArtifactSchema,
        SuggestionArtifactSchema,
        FormArtifactSchema,
        CalendarArtifactSchema,
      ])
      .nullable(),
    metadata: FormArtifactMetadata,
    error: z.string().nullable(),
    error_code: z.string().nullable(),
  }),
});

export type ArtifactMessageContent = z.infer<typeof ArtifactMessageContentSchema>;

// Artifact data types
export interface SuggestionsArtifactContent {
  suggested_questions: string[];
  suggested_questions_short_form: string[];
  suggested_questions_type: string;
}

export interface VideoArtifactContent {
  id: number;
  video_url: string;
  title: string;
  description: string;
}

export interface SlideImageArtifactContent {
  id: number;
  image_url: string;
  title: string;
  description: string;
}

export interface SuggestionsArtifactData {
  artifact_id: string;
  content: SuggestionsArtifactContent;
  artifact_type: string;
  metadata: Record<string, unknown>;
  error: string | null;
  error_code: string | null;
}

export interface VideoArtifactData {
  artifact_id: string;
  content: VideoArtifactContent;
  artifact_type: string;
  metadata: Record<string, unknown>;
  error: string | null;
  error_code: string | null;
}

export interface SlideImageArtifactData {
  artifact_id: string;
  content: SlideImageArtifactContent;
  artifact_type: string;
  metadata: Record<string, unknown>;
  error: string | null;
  error_code: string | null;
}

export interface ArtifactEventData {
  artifact_type: string;
  artifact_data: SuggestionsArtifactData | VideoArtifactData | SlideImageArtifactData | Record<string, unknown>;
}

export const ActorSchema = z.enum(['SALES', 'DEMO', 'ARTIFACT', 'ANALYTICS', 'DISCOVERY_QUESTIONS', 'EVENT']);
export type Actor = z.infer<typeof ActorSchema>;

export const MessageSchema = z
  .object({
    session_id: z.string(),
    response_id: z.string(),
    role: z.enum(['user', 'ai']),
    actor: ActorSchema.optional(),
    documents: z.array(DataSourceSchema).optional().nullable(),
    timestamp: z.string(),
    is_admin: z.boolean().optional(),
    device_type: DeviceTypeSchema.optional().nullable(),
  })
  .and(
    z.discriminatedUnion('event_type', [
      z.object({
        event_type: z.literal('TEXT_REQUEST'),
        event_data: BaseMessageContentSchema,
      }),
      z.object({
        event_type: z.literal('TEXT_RESPONSE'),
        event_data: BaseMessageContentSchema,
      }),
      z.object({
        event_type: z.literal('LOADING_TEXT'),
        event_data: BaseMessageContentSchema,
      }),
      z.object({
        event_type: z.literal('STREAM_RESPONSE'),
        event_data: StreamMessageContentSchema,
      }),
      z.object({
        event_type: z.literal('SUMMARY_STREAM'),
        event_data: StreamMessageContentSchema,
      }),
      z.object({
        event_type: z.literal('SUMMARIZE'),
        event_data: SummarizeMessageContentSchema,
      }),
      z.object({
        event_type: z.literal('DISCOVERY_QUESTIONS'),
        event_data: z.object({
          content: z.string().optional(),
          answer_type: z.enum(['SINGLE_SELECT', 'MULTI_SELECT', 'TEXT']),
          question: z.string(),
          response_options: z.array(
            z.union([
              z.object({
                type: z.literal('string'),
                value: z.string(),
              }),
              z.object({
                type: z.literal('text_box'),
                value: z.string().optional(),
                placeholder: z.string().optional(),
              }),
              z.object({}),
            ]),
          ),
        }),
      }),
      z.object({
        event_type: z.literal('DISCOVERY_ANSWER'),
        event_data: z.object({
          content: z.string(),
          question: z.string(),
          responses: z.array(
            z.object({
              type: z.string().optional(),
              value: z.string().optional(),
            }),
          ),
        }),
      }),
      z.object({
        event_type: z.literal('SUGGESTED_QUESTION_CLICKED'),
        event_data: BaseMessageContentSchema,
      }),
      z.object({
        event_type: z.literal('VIDEO_ARTIFACT'),
        event_data: ArtifactMessageContentSchema,
      }),
      z.object({
        event_type: z.literal('SLIDE_ARTIFACT'),
        event_data: ArtifactMessageContentSchema,
      }),
      z.object({
        event_type: z.literal('SLIDE_IMAGE_ARTIFACT'),
        event_data: ArtifactMessageContentSchema,
      }),
      z.object({
        event_type: z.literal('SUGGESTIONS_ARTIFACT'),
        event_data: ArtifactMessageContentSchema,
      }),
      z.object({
        event_type: z.literal('FORM_ARTIFACT'),
        event_data: ArtifactMessageContentSchema,
      }),
      z.object({
        event_type: z.literal('QUALIFICATION_FORM_ARTIFACT'),
        event_data: ArtifactMessageContentSchema,
      }),
      z.object({
        event_type: z.literal('CALENDAR_ARTIFACT'),
        event_data: ArtifactMessageContentSchema,
      }),
      z.object({
        event_type: z.literal('CALENDAR_SUBMIT'),
        event_data: CalendarSubmitEventDataSchema,
      }),
      z.object({
        event_type: z.literal('CTA_EVENT'),
        event_data: CtaEventDataSchema,
      }),
      z.object({
        content: z.string(),
        event_type: z.literal('MESSAGE_ANALYTICS'),
        event_data: MessageAnalyticsEventDataSchema.or(ErrorEventDataSchema),
      }),
      z.object({
        content: z.string(),
        event_type: z.literal('BOOK_MEETING'),
        event_data: z.object({}),
      }), //In case of message without url
      z.object({
        content: z.string(),
        event_type: z.literal('PRIMARY_GOAL_CTA_CLICKED'),
        event_data: z.object({
          url: z.string().optional(),
        }),
      }),
      z.object({
        content: z.string(),
        event_type: z.literal('GENERATING_ARTIFACT'),
        event_data: GeneratingArtifactEventDataSchema,
      }),
      z.object({
        content: z.string(),
        event_type: z.literal('FORM_FILLED'),
        event_data: ArtifactFormSchema,
      }),
      z.object({
        content: z.string(),
        event_type: z.literal('QUALIFICATION_FORM_FILLED'),
        event_data: QualificationQuestionAnswerSchema,
      }),
      z.object({
        content: z.string(),
        event_type: z.literal('ADMIN_TYPING'),
        event_data: z.object({}),
      }),
      z.object({
        content: z.string(),
        event_type: z.literal('USER_TYPING'),
        event_data: z.object({}),
      }),

      z.object({
        content: z.string(),
        event_type: z.literal('DEMO_OPTIONS'),
        event_data: z.object({
          demo_available: z.boolean().optional(),
        }),
      }),
      z.object({
        content: z.string(),
        event_type: z.literal('USER_INACTIVE'),
        event_data: z.object({}),
      }),
      z.object({
        content: z.string(),
        event_type: z.literal('HEARTBEAT'),
        event_data: z.object({}),
      }),
      z.object({
        content: z.string(),
        event_type: z.literal('HEARTBEAT_ACK'),
        event_data: z.object({}),
      }),
      z.object({
        content: z.string(),
        event_type: z.literal('USER_LEFT'),
        event_data: z.object({}),
      }),
      z.object({
        content: z.string(),
        event_type: z.literal('JOIN_SESSION'),
        event_data: z.object({
          first_name: z.string(),
          last_name: z.string(),
          profile_picture: z.string().nullable(),
          designation: z.string().nullable().optional(),
          department: z.string().nullable().optional(),
        }),
      }),
      z.object({
        content: z.string(),
        event_type: z.literal('ADMIN_RESPONSE'),
        event_data: z.object({
          type: z.string().optional(),
          url: z.string().optional(),
          calendar_id: z.number().optional(),
        }),
      }),
      z.object({
        content: z.string(),
        event_type: z.literal('RESPONSE_SUGGESTIONS'),
        event_data: z.object({
          query: z.string().optional(),
          suggestions: z.array(z.string()).optional(),
        }),
      }),
      z.object({
        content: z.string(),
        event_type: z.literal('LEAVE_SESSION'),
        event_data: z
          .object({
            first_name: z.string(),
            last_name: z.string(),
            profile_picture: z.string().nullable(),
            designation: z.string().nullable(),
            department: z.string().nullable(),
          })
          .or(z.object({})),
      }),
      z.object({
        content: z.string(),
        event_type: z.literal('URL_TRACKING'),
        event_data: z.object({
          recent_history: z.array(BrowsedUrlSchema),
        }),
      }),
    ]),
  );

export type Message = z.infer<typeof MessageSchema>;

export type SendUserMessageParams = {
  message: string;
  resetSuggestedQuestions?: boolean;
  overrides?: Partial<Message>;
};
