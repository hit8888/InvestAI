import { z } from "zod";

export const ArtifactEnumSchema = z.enum([
  "SLIDE",
  "VIDEO",
  "DEMO",
  "SLIDE_IMAGE",
  "NONE",
  "SUGGESTIONS",
  "FORM",
]);

// Derive these enums from Backend ArtifactEnumSchema
export const SplitScreenArtifactEnumSchema = z.enum([
  ArtifactEnumSchema.Enum.DEMO,
  ArtifactEnumSchema.Enum.VIDEO,
  ArtifactEnumSchema.Enum.SLIDE,
  ArtifactEnumSchema.Enum.SLIDE_IMAGE,
  ArtifactEnumSchema.Enum.NONE,
]);

export const ChatBoxArtifactEnumSchema = z.enum([
  ArtifactEnumSchema.Enum.FORM,
  ArtifactEnumSchema.Enum.SUGGESTIONS,
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

export const DemoFeatureFrameItemSchema = z.object({
  id: z.number(),
  frame_name: z.string(),
  frame_description: z.string(),
  frame_type: z.string(),
  frame_url: z.string(),
  frame_interval: z.number(),
  frame_audio_url: z.string(),
});

export const DemoFeatureItemSchema = z.object({
  id: z.number(),
  feature_name: z.string(),
  feature_description: z.string(),
  feature_type: z.string(),
  feature_audio_url: z.string(),
  frames: z.array(DemoFeatureFrameItemSchema),
});

export const DemoArtifactSchema = z.object({
  introduction: z.string(),
  features: z.array(DemoFeatureItemSchema),
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
  suggested_questions_type: z.enum(["STAR", "BUBBLE"]),
});

export const FormFieldDataTypeEnumSchema = z.enum([
  "string",
  "int",
  "email",
  "date",
  "datetime",
  "phone",
]);

export const FormFieldSchema = z.object({
  label: z.string(),
  field_name: z.string(),
  data_type: FormFieldDataTypeEnumSchema,
  is_required: z.boolean(),
});

export const FormArtifactMetadata = z.object({
  is_filled: z.boolean().optional(),
  filled_data: z.object({
    default: z.string(),
  }),
});

export const FormArtifactSchema = z.object({
  form_fields: z.array(FormFieldSchema),
});

export const ArtifactSchema = z.object({
  artifact_id: z.string(),
  content: SlideArtifactSchema.or(SlideImageArtifactSchema)
    .or(DemoArtifactSchema)
    .or(VideoArtifactSchema)
    .or(SuggestionArtifactSchema)
    .or(FormArtifactSchema),
  artifact_type: ArtifactEnumSchema,
  metadata: FormArtifactMetadata.or(z.any()),
});
