import { z } from 'zod';

export const ArtifactEnumSchema = z.enum(['SLIDE', 'VIDEO', 'SLIDE_IMAGE', 'NONE', 'SUGGESTIONS', 'FORM']);

export enum ArtifactEnum {
  SLIDE = 'SLIDE',
  VIDEO = 'VIDEO',
  SLIDE_IMAGE = 'SLIDE_IMAGE',
  NONE = 'NONE',
  SUGGESTIONS = 'SUGGESTIONS',
  FORM = 'FORM',
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
]);

export const FormFieldSchema = z.object({
  label: z.string(),
  field_name: z.string(),
  data_type: FormFieldDataTypeEnumSchema,
  is_required: z.boolean(),
});

export const FormArtifactMetadata = z.object({
  is_filled: z.boolean().optional(),
  filled_data: z.record(z.string(), z.any()).optional(),
});

export const FormArtifactSchema = z.object({
  form_fields: z.array(FormFieldSchema),
});

export type SlideArtifactContent = z.infer<typeof SlideArtifactSchema>;

export type SlideImageArtifactContent = z.infer<typeof SlideImageArtifactSchema>;

export type VideoArtifactContent = z.infer<typeof VideoArtifactSchema>;

export type FormArtifactContent = z.infer<typeof FormArtifactSchema>;

export type SuggestionArtifactContent = z.infer<typeof SuggestionArtifactSchema>;

export type MediaArtifactContent = SlideImageArtifactContent | SlideArtifactContent | VideoArtifactContent;

export type ArtifactContent = MediaArtifactContent | FormArtifactContent | SuggestionArtifactContent;
