import {
  ArtifactEnumSchema,
  CalendarArtifactSchema,
  CtaEventDataSchema,
  DemoArtifactSchema,
  FormArtifactMetadata,
  FormArtifactSchema,
  PDFArtifactSchema,
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

export enum MessageEventType {
  TEXT_REQUEST = 'TEXT_REQUEST',
  TEXT_RESPONSE = 'TEXT_RESPONSE',
  LOADING_TEXT = 'LOADING_TEXT',
  STREAM_RESPONSE = 'STREAM_RESPONSE',
  SUMMARY_STREAM = 'SUMMARY_STREAM',
  SUMMARIZE = 'SUMMARIZE',
  DISCOVERY_QUESTIONS = 'DISCOVERY_QUESTIONS',
  DISCOVERY_ANSWER = 'DISCOVERY_ANSWER',
  SUGGESTED_QUESTION_CLICKED = 'SUGGESTED_QUESTION_CLICKED',
  VIDEO_ARTIFACT = 'VIDEO_ARTIFACT',
  SLIDE_ARTIFACT = 'SLIDE_ARTIFACT',
  SLIDE_IMAGE_ARTIFACT = 'SLIDE_IMAGE_ARTIFACT',
  SUGGESTIONS_ARTIFACT = 'SUGGESTIONS_ARTIFACT',
  FORM_ARTIFACT = 'FORM_ARTIFACT',
  QUALIFICATION_FORM_ARTIFACT = 'QUALIFICATION_FORM_ARTIFACT',
  CALENDAR_ARTIFACT = 'CALENDAR_ARTIFACT',
  DEMO_ARTIFACT = 'DEMO_ARTIFACT',
  PDF_ARTIFACT = 'PDF_ARTIFACT',
  CALENDAR_SUBMIT = 'CALENDAR_SUBMIT',
  CTA_EVENT = 'CTA_EVENT',
  MESSAGE_ANALYTICS = 'MESSAGE_ANALYTICS',
  BOOK_MEETING = 'BOOK_MEETING',
  PRIMARY_GOAL_CTA_CLICKED = 'PRIMARY_GOAL_CTA_CLICKED',
  GENERATING_ARTIFACT = 'GENERATING_ARTIFACT',
  FORM_FILLED = 'FORM_FILLED',
  QUALIFICATION_FORM_FILLED = 'QUALIFICATION_FORM_FILLED',
  ADMIN_TYPING = 'ADMIN_TYPING',
  USER_TYPING = 'USER_TYPING',
  DEMO_OPTIONS = 'DEMO_OPTIONS',
  USER_INACTIVE = 'USER_INACTIVE',
  HEARTBEAT = 'HEARTBEAT',
  HEARTBEAT_ACK = 'HEARTBEAT_ACK',
  USER_LEFT = 'USER_LEFT',
  JOIN_SESSION = 'JOIN_SESSION',
  ADMIN_RESPONSE = 'ADMIN_RESPONSE',
  RESPONSE_SUGGESTIONS = 'RESPONSE_SUGGESTIONS',
  LEAVE_SESSION = 'LEAVE_SESSION',
  URL_TRACKING = 'URL_TRACKING',
  NUDGE_CTA_CLICKED = 'NUDGE_CTA_CLICKED',
}

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
        DemoArtifactSchema,
        PDFArtifactSchema,
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

export interface DemoArtifactData {
  artifact_id: string;
  content: {
    id: number;
    demo_url: string;
    title: string;
    description: string;
    thumbnail_url?: string;
  };
  artifact_type: string;
  metadata: Record<string, unknown>;
  error: string | null;
  error_code: string | null;
}

export interface PDFArtifactData {
  artifact_id: string;
  content: {
    id: number;
    pdf_url: string;
    title?: string;
    description?: string;
  };
  artifact_type: string;
  metadata: Record<string, unknown>;
  error: string | null;
  error_code: string | null;
}

export interface ArtifactEventData {
  artifact_type: string;
  artifact_data:
    | SuggestionsArtifactData
    | VideoArtifactData
    | SlideImageArtifactData
    | DemoArtifactData
    | PDFArtifactData
    | Record<string, unknown>;
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
    command_bar_module_id: z.number().optional(),
  })
  .and(
    z.discriminatedUnion('event_type', [
      z.object({
        event_type: z.literal(MessageEventType.TEXT_REQUEST),
        event_data: BaseMessageContentSchema,
      }),
      z.object({
        event_type: z.literal(MessageEventType.TEXT_RESPONSE),
        event_data: BaseMessageContentSchema,
      }),
      z.object({
        event_type: z.literal(MessageEventType.LOADING_TEXT),
        event_data: BaseMessageContentSchema,
      }),
      z.object({
        event_type: z.literal(MessageEventType.STREAM_RESPONSE),
        event_data: StreamMessageContentSchema,
      }),
      z.object({
        event_type: z.literal(MessageEventType.SUMMARY_STREAM),
        event_data: StreamMessageContentSchema,
      }),
      z.object({
        event_type: z.literal(MessageEventType.SUMMARIZE),
        event_data: SummarizeMessageContentSchema,
      }),
      z.object({
        event_type: z.literal(MessageEventType.DISCOVERY_QUESTIONS),
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
        event_type: z.literal(MessageEventType.DISCOVERY_ANSWER),
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
        event_type: z.literal(MessageEventType.SUGGESTED_QUESTION_CLICKED),
        event_data: BaseMessageContentSchema,
      }),
      z.object({
        event_type: z.literal(MessageEventType.VIDEO_ARTIFACT),
        event_data: ArtifactMessageContentSchema,
      }),
      z.object({
        event_type: z.literal(MessageEventType.SLIDE_ARTIFACT),
        event_data: ArtifactMessageContentSchema,
      }),
      z.object({
        event_type: z.literal(MessageEventType.SLIDE_IMAGE_ARTIFACT),
        event_data: ArtifactMessageContentSchema,
      }),
      z.object({
        event_type: z.literal(MessageEventType.SUGGESTIONS_ARTIFACT),
        event_data: ArtifactMessageContentSchema,
      }),
      z.object({
        event_type: z.literal(MessageEventType.FORM_ARTIFACT),
        event_data: ArtifactMessageContentSchema,
      }),
      z.object({
        event_type: z.literal(MessageEventType.QUALIFICATION_FORM_ARTIFACT),
        event_data: ArtifactMessageContentSchema,
      }),
      z.object({
        event_type: z.literal(MessageEventType.CALENDAR_ARTIFACT),
        event_data: ArtifactMessageContentSchema,
      }),
      z.object({
        event_type: z.literal(MessageEventType.DEMO_ARTIFACT),
        event_data: ArtifactMessageContentSchema,
      }),
      z.object({
        event_type: z.literal(MessageEventType.PDF_ARTIFACT),
        event_data: ArtifactMessageContentSchema,
      }),
      z.object({
        event_type: z.literal(MessageEventType.CALENDAR_SUBMIT),
        event_data: CalendarSubmitEventDataSchema,
      }),
      z.object({
        event_type: z.literal(MessageEventType.CTA_EVENT),
        event_data: CtaEventDataSchema,
      }),
      z.object({
        content: z.string(),
        event_type: z.literal(MessageEventType.MESSAGE_ANALYTICS),
        event_data: MessageAnalyticsEventDataSchema.or(ErrorEventDataSchema),
      }),
      z.object({
        content: z.string(),
        event_type: z.literal(MessageEventType.BOOK_MEETING),
        event_data: z.object({
          form_id: z.string().optional(),
        }),
      }), //In case of message without url
      z.object({
        content: z.string(),
        event_type: z.literal(MessageEventType.PRIMARY_GOAL_CTA_CLICKED),
        event_data: z.object({
          url: z.string().optional(),
        }),
      }),
      z.object({
        content: z.string(),
        event_type: z.literal(MessageEventType.GENERATING_ARTIFACT),
        event_data: GeneratingArtifactEventDataSchema,
      }),
      z.object({
        content: z.string(),
        event_type: z.literal(MessageEventType.FORM_FILLED),
        event_data: ArtifactFormSchema,
      }),
      z.object({
        content: z.string(),
        event_type: z.literal(MessageEventType.QUALIFICATION_FORM_FILLED),
        event_data: QualificationQuestionAnswerSchema,
      }),
      z.object({
        content: z.string(),
        event_type: z.literal(MessageEventType.ADMIN_TYPING),
        event_data: z.object({}),
      }),
      z.object({
        content: z.string(),
        event_type: z.literal(MessageEventType.USER_TYPING),
        event_data: z.object({}),
      }),

      z.object({
        content: z.string(),
        event_type: z.literal(MessageEventType.DEMO_OPTIONS),
        event_data: z.object({
          demo_available: z.boolean().optional(),
        }),
      }),
      z.object({
        content: z.string(),
        event_type: z.literal(MessageEventType.USER_INACTIVE),
        event_data: z.object({}),
      }),
      z.object({
        content: z.string(),
        event_type: z.literal(MessageEventType.HEARTBEAT),
        event_data: z.object({}),
      }),
      z.object({
        content: z.string(),
        event_type: z.literal(MessageEventType.HEARTBEAT_ACK),
        event_data: z.object({}),
      }),
      z.object({
        content: z.string(),
        event_type: z.literal(MessageEventType.USER_LEFT),
        event_data: z.object({}),
      }),
      z.object({
        content: z.string(),
        event_type: z.literal(MessageEventType.JOIN_SESSION),
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
        event_type: z.literal(MessageEventType.ADMIN_RESPONSE),
        event_data: z.object({
          type: z.string().optional(),
          url: z.string().optional(),
          calendar_id: z.number().optional(),
        }),
      }),
      z.object({
        content: z.string(),
        event_type: z.literal(MessageEventType.RESPONSE_SUGGESTIONS),
        event_data: z.object({
          query: z.string().optional(),
          suggestions: z.array(z.string()).optional(),
        }),
      }),
      z.object({
        content: z.string(),
        event_type: z.literal(MessageEventType.LEAVE_SESSION),
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
        event_type: z.literal(MessageEventType.URL_TRACKING),
        event_data: z.object({
          recent_history: z.array(BrowsedUrlSchema),
        }),
      }),
      z.object({
        content: z.string(),
        event_type: z.literal(MessageEventType.NUDGE_CTA_CLICKED),
        event_data: BaseMessageContentSchema,
      }),
    ]),
  );

export type Message = z.infer<typeof MessageSchema>;

export type SendUserMessageParams = {
  message: string;
  resetSuggestedQuestions?: boolean;
  overrides?: Partial<Message>;
};
