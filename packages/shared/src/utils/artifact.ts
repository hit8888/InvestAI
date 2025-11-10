import { z } from 'zod';
import { CalendarSubmitEventData } from './types';
import { CalendarTypeEnum } from './enum';
import { Message } from '../types/message';

export const ArtifactEnumSchema = z.enum([
  'SLIDE',
  'VIDEO',
  'SLIDE_IMAGE',
  'NONE',
  'SUGGESTIONS',
  'FORM',
  'CALENDAR',
  'QUALIFICATION_FORM',
  'DEMO',
]);

export const SlideItemSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  icon: z.string().nullable(),
});

export const SlideArtifactSchema = z.object({
  title: z.string(),
  sub_title: z.string().optional().nullable(),
  items: z.array(SlideItemSchema),
});

export const VideoArtifactSchema = z.object({
  video_url: z.string(),
  description: z.string(),
  title: z.string(),
});

export const SlideImageArtifactSchema = z.object({
  id: z.number(),
  image_url: z.string(),
  description: z.string(),
  title: z.string(),
});

export const SuggestionArtifactSchema = z.object({
  suggested_questions: z.array(z.string()),
  suggested_questions_short_form: z.array(z.string()).optional(),
  suggested_questions_type: z.enum(['STAR', 'BUBBLE']),
});

export const FormFieldDataTypeEnumSchema = z.enum([
  'string',
  'int',
  'email',
  'business_email',
  'date',
  'datetime',
  'phone',
  'picklist',
  'google_place',
]);

export const FormFieldSchema = z.object({
  label: z.string(),
  field_name: z.string(),
  data_type: FormFieldDataTypeEnumSchema,
  is_required: z.boolean(),
  options: z.array(z.string()).optional().nullable(),
});

export type FormFieldSchemaType = z.infer<typeof FormFieldSchema>;

export const QualificationSelectOptionSchema = z.object({
  type: z.string(),
  value: z.string().optional(),
  placeholder: z.string().optional(),
});

export const QualificationQuestionSchema = z.object({
  id: z.string().optional(),
  answer_type: z.literal('DROP_DOWN'),
  question: z.string(),
  response_options: z.array(QualificationSelectOptionSchema),
  is_required: z.boolean(),
  default_answer_index: z.number().optional().nullable(),
});
export type QualificationQuestionType = z.infer<typeof QualificationQuestionSchema>;

export const FormArtifactMetadata = z.object({
  is_filled: z.boolean().optional(),
  filled_data: z.record(z.string(), z.any()).optional(),
  country_code: z.string().optional(),
  country: z.string().optional(),
});

export type FormArtifactMetadataType = z.infer<typeof FormArtifactMetadata>;

export const QualificationResponsesSchema = z.object({
  id: z.string().optional(),
  question: z.string(),
  answer: z.string(),
  answer_type: z.string(),
});

export type QualificationResponsesType = z.infer<typeof QualificationResponsesSchema>;

export const QualificationQuestionAnswerSchema = z.object({
  artifact_id: z.string(),
  qualification_responses: z.array(QualificationResponsesSchema),
});

export const CtaEventDataSchema = z.object({
  url: z.string().optional(),
  align: z.enum(['left', 'right', 'center']).optional(),
  label: z.string().optional(),
  message: z.string().optional(),
  title: z.string().optional(),
  auto_redirect: z.boolean().optional(),
});

export const QualificationQuestionMetadata = z.object({
  is_filled: z.boolean(),
  filled_data: z.array(QualificationResponsesSchema).optional(),
});

export type QualificationQuestionMetadataType = z.infer<typeof QualificationQuestionMetadata>;

export const FormArtifactSchema = z.object({
  default_message: z.string().nullable().optional(),
  form_fields: z.array(FormFieldSchema),
  qualification: z.boolean().optional(),
  qualification_questions: z.array(QualificationQuestionSchema).optional(),
  default_data: z.record(z.string(), z.string()).optional(),
});

export type SlideArtifactContent = z.infer<typeof SlideArtifactSchema>;

export type SlideImageArtifactContent = z.infer<typeof SlideImageArtifactSchema>;

export type VideoArtifactContent = z.infer<typeof VideoArtifactSchema>;

export type FormArtifactContent = z.infer<typeof FormArtifactSchema>;

export type SuggestionArtifactContent = z.infer<typeof SuggestionArtifactSchema>;

export const CalendarArtifactSchema = z.object({
  artifact_id: z.string().optional(),
  calendar_url: z.string(),
  calendar_type: z.nativeEnum(CalendarTypeEnum),
  prefill_data: z.record(z.string(), z.any()).optional(),
  event_type: z.string().optional(),
  cal_com_username: z.string().optional(),
});

export type CalendarArtifactContent = z.infer<typeof CalendarArtifactSchema>;

export const DemoArtifactSchema = z.object({
  id: z.number(),
  demo_url: z.string(),
  title: z.string(),
  description: z.string(),
  thumbnail_url: z.string().optional(),
});

export type DemoArtifactContent = z.infer<typeof DemoArtifactSchema>;

export type MediaArtifactContent =
  | SlideImageArtifactContent
  | SlideArtifactContent
  | VideoArtifactContent
  | CalendarArtifactContent
  | DemoArtifactContent;

export type ArtifactContent = MediaArtifactContent | FormArtifactContent | SuggestionArtifactContent;

export type ArtifactContentWithMetadataProps =
  | ({
      event_type: 'FORM_ARTIFACT';
      artifact_id: string;
      metadata: {
        formMetadata: FormArtifactMetadataType;
        qualificationQuestionFormMetadata: QualificationQuestionMetadataType;
        calendarContent: CalendarSubmitEventData | null;
      };
      ctaEvent?: Message;
    } & FormArtifactContent)
  | ({
      event_type: 'CALENDAR_ARTIFACT';
      artifact_id: string;
      metadata: {
        formMetadata: FormArtifactMetadataType;
        qualificationQuestionFormMetadata: QualificationQuestionMetadataType;
        calendarContent: {
          event: { uri: string };
          invitee: { uri: string };
        } | null;
      };
      ctaEvent?: Message;
    } & CalendarArtifactContent)
  | ({
      artifact_type: 'SLIDE' | 'VIDEO' | 'SLIDE_IMAGE' | 'SUGGESTIONS';
      artifact_id: string;
      metadata: {
        formMetadata: FormArtifactMetadataType;
        qualificationQuestionFormMetadata: QualificationQuestionMetadataType;
        calendarContent: CalendarSubmitEventData | null;
      };
      ctaEvent?: Message;
    } & ArtifactContent)
  | null;

export type AdditionalCalendarArtifactContent = CalendarArtifactContent & {
  event_type: 'CALENDAR_ARTIFACT';
  metadata: {
    formMetadata: FormArtifactMetadataType;
    qualificationQuestionFormMetadata: QualificationQuestionMetadataType;
    calendarContent: {
      form_data: {
        event: { uri: string };
        invitee: { uri: string };
      };
    } | null;
  };
  ctaEvent?: Message;
};
