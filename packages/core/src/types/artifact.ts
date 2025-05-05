import { z } from 'zod';

export const ArtifactEnumSchema = z.enum(['SLIDE', 'VIDEO', 'SLIDE_IMAGE', 'NONE', 'SUGGESTIONS', 'FORM', 'CALENDAR']);

export enum ArtifactEnum {
  SLIDE = 'SLIDE',
  VIDEO = 'VIDEO',
  SLIDE_IMAGE = 'SLIDE_IMAGE',
  NONE = 'NONE',
  SUGGESTIONS = 'SUGGESTIONS',
  FORM = 'FORM',
  CALENDAR = 'CALENDAR',
}

export enum ArtifactPreviewEnum {
  SLIDE = 'SLIDE',
  SLIDE_IMAGE = 'SLIDE_IMAGE',
  VIDEO = 'VIDEO',
  DEMO = 'DEMO',
}

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
  image_url: z.string(),
  description: z.string(),
  title: z.string(),
});

export const SuggestionArtifactSchema = z.object({
  suggested_questions: z.array(z.string()),
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
});

export const FormArtifactMetadata = z.object({
  is_filled: z.boolean().optional(),
  filled_data: z.record(z.string(), z.any()).optional(),
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

export const QualificationQuestionMetadata = z.object({
  is_filled: z.boolean(),
  filled_data: z.array(QualificationResponsesSchema).optional(),
});

export type QualificationQuestionMetadataType = z.infer<typeof QualificationQuestionMetadata>;

export const FormArtifactSchema = z.object({
  form_fields: z.array(FormFieldSchema),
  qualification: z.boolean().optional(),
  qualification_questions: z.array(QualificationQuestionSchema).optional(),
});

export type SlideArtifactContent = z.infer<typeof SlideArtifactSchema>;

export type SlideImageArtifactContent = z.infer<typeof SlideImageArtifactSchema>;

export type VideoArtifactContent = z.infer<typeof VideoArtifactSchema>;

export type FormArtifactContent = z.infer<typeof FormArtifactSchema>;

export type SuggestionArtifactContent = z.infer<typeof SuggestionArtifactSchema>;

export enum CalendarTypeEnum {
  CALENDLY = 'CALENDLY',
  CAL_COM = 'CAL_COM',
}

export const CalendarArtifactSchema = z.object({
  calendar_url: z.string(),
  calendar_type: z.nativeEnum(CalendarTypeEnum),
  prefill_data: z.record(z.string(), z.any()).optional(),
});

export type CalendarArtifactContent = z.infer<typeof CalendarArtifactSchema>;

export type MediaArtifactContent =
  | SlideImageArtifactContent
  | SlideArtifactContent
  | VideoArtifactContent
  | CalendarArtifactContent;

export type ArtifactContent = MediaArtifactContent | FormArtifactContent | SuggestionArtifactContent;
