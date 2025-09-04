import { z } from 'zod';
import { ArtifactEnumSchema } from './artifact';
import { CtaEventDataSchema, FormFieldSchema } from './artifact';
import { CalendarTypeEnum } from './enum';
import { Message } from '../types/message';

export const DataSourceSchema = z.object({
  id: z.number(),
  data_source_id: z.number(),
  data_source_name: z.string().optional().nullable(),
  data_source_type: z.string(),
  title: z.string().nullable(),
  url: z.string().nullable(),
  text: z.string().nullable(),
  similarity_score: z.number().optional().nullable(),
});

export const BrowsedUrlSchema = z.object({
  url: z.string().nullable(),
  timestamp: z.number().nullable(),
});

export type BrowsedUrl = z.infer<typeof BrowsedUrlSchema>;

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

export const MessageTypeSchema = z.enum(['TEXT', 'STREAM', 'ARTIFACT', 'EVENT']);
export const DeviceTypeSchema = z.enum(['MOBILE', 'DESKTOP']);

export type FormFilledEventType =
  | 'FORM_FILLED'
  | 'QUALIFICATION_FORM_FILLED'
  | 'CALENDAR_SUBMIT'
  | 'PRIMARY_GOAL_CTA_CLICKED';

export const BaseMessageContentSchema = z.object({
  content: z.string(),
});

export const StreamMessageContentSchema = BaseMessageContentSchema.extend({
  is_complete: z.boolean().optional(),
});

export const SummarizeMessageContentSchema = BaseMessageContentSchema.extend({
  url: z.string(),
});

export const MessageAnalyticsEventDataSchema = z.object({
  buyer_intent_score: z.number(),
});

export const ErrorEventDataSchema = z.object({
  error: z.string(),
});

export type ErrorEventData = z.infer<typeof ErrorEventDataSchema>;

export type MessageAnalyticsEventData = z.infer<typeof MessageAnalyticsEventDataSchema>;

export const GeneratingArtifactEventDataSchema = z.object({
  artifact_type: ArtifactEnumSchema,
});

export const CalendarSubmitEventDataSchema = z.object({
  calendar_type: z.nativeEnum(CalendarTypeEnum),
  calendar_url: z.string(),
  form_data: z.record(z.string(), z.any()),
  artifact_id: z.string(),
});

export type StreamMessageContent = z.infer<typeof StreamMessageContentSchema>;

export type BaseMessageContent = z.infer<typeof BaseMessageContentSchema>;

export type CtaEventDataContent = z.infer<typeof CtaEventDataSchema>;

export type ChatHistory = Message[];

export type FormFieldType = z.infer<typeof FormFieldSchema>;

export type DataSourceType = z.infer<typeof DataSourceSchema>;

export type CalendarSubmitEventData = z.infer<typeof CalendarSubmitEventDataSchema>;
