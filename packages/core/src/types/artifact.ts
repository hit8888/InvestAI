import { z } from "zod";

export const ArtifactEnumSchema = z.enum([
  "SLIDE",
  "VIDEO",
  "DEMO",
  "SLIDE_IMAGE",
  "NONE",
  "SUGGESTIONS",
]);

export const SlideItemSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  icon: z.string(),
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
});

export const DemoFeatureItemSchema = z.object({
  id: z.number(),
  feature_name: z.string(),
  feature_description: z.string(),
  feature_type: z.string(),
  frames: z.array(DemoFeatureFrameItemSchema),
});

export const DemoArtifactSchema = z.object({
  introduction: z.string(),
  features: z.array(DemoFeatureItemSchema),
});

export const VideoArtifactSchema = z.object({
  video_url: z.string(),
});

export const SlideImageArtifactSchema = z.object({
  image_url: z.string(),
});

export const SuggestionArtifactSchema = z.object({
  suggested_questions: z.array(z.string()),
  suggested_questions_type: z.enum(["STAR", "BUBBLE"]),
});

export const ArtifactSchema = z.object({
  artifact_id: z.string(),
  content: SlideArtifactSchema.or(SlideImageArtifactSchema)
    .or(DemoArtifactSchema)
    .or(VideoArtifactSchema)
    .or(SuggestionArtifactSchema),
  artifact_type: ArtifactEnumSchema,
});
