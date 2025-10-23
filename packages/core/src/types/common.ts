import { z } from 'zod';

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
  url: z.string(),
  timestamp: z.number(),
});

export type BrowsedUrl = z.infer<typeof BrowsedUrlSchema>;

export enum DemoPlayingStatus {
  PLAYING = 'PLAYING',
  STARTED = 'STARTED',
  PAUSED = 'PAUSED',
  INITIAL = 'INITIAL',
  GENRATING_DEMO = 'GENRATING_DEMO',
}

export enum BuyerIntent {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export enum MessageSenderRole {
  AI = 'ai',
  ADMIN = 'admin',
  USER = 'user',
  SYSTEM = 'system',
}

export enum ViewType {
  USER = 'USER',
  DASHBOARD = 'DASHBOARD',
  ADMIN = 'ADMIN',
}

export enum MessageViewType {
  ADMIN_MESSAGE_IN_ADMIN_VIEW = 'ADMIN_MESSAGE_IN_ADMIN_VIEW',
  ADMIN_MESSAGE_IN_USER_VIEW = 'ADMIN_MESSAGE_IN_USER_VIEW',
  ADMIN_MESSAGE_IN_DASHBOARD_VIEW = 'ADMIN_MESSAGE_IN_DASHBOARD_VIEW',
  USER_MESSAGE_IN_ADMIN_VIEW = 'USER_MESSAGE_IN_ADMIN_VIEW',
  USER_MESSAGE_IN_USER_VIEW = 'USER_MESSAGE_IN_USER_VIEW',
  USER_MESSAGE_IN_DASHBOARD_VIEW = 'USER_MESSAGE_IN_DASHBOARD_VIEW',
  AI_MESSAGE_IN_ADMIN_VIEW = 'AI_MESSAGE_IN_ADMIN_VIEW',
  AI_MESSAGE_IN_USER_VIEW = 'AI_MESSAGE_IN_USER_VIEW',
  AI_MESSAGE_IN_DASHBOARD_VIEW = 'AI_MESSAGE_IN_DASHBOARD_VIEW',
}

export enum AdminConversationJoinStatus {
  INIT = 'INIT',
  PENDING = 'PENDING',
  JOINED = 'JOINED',
  DENIED = 'DENIED',
  EXIT = 'EXIT',
}

export enum DeviceType {
  MOBILE = 'MOBILE',
  DESKTOP = 'DESKTOP',
}

export type FormFilledEventType = 'FORM_FILLED' | 'QUALIFICATION_FORM_FILLED' | 'CALENDAR_SUBMIT';

export enum PlaygroundView {
  USER_PREVIEW = 'USER_PREVIEW',
  ADMIN_VIEW = 'ADMIN_VIEW',
}

export enum AgentResponseWordCountEnum {
  BRIEF = 'BRIEF',
  STANDARD = 'STANDARD',
  DETAILED = 'DETAILED',
}

export const RecordSchema = z.record(z.string(), z.string());
export type StringRecord = z.infer<typeof RecordSchema>;

// Shared asset schema used across configuration and admin APIs
export const AssetSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  description: z.string().optional().nullable(),
  key: z.string(),
  public_url: z.string(),
  metadata: RecordSchema.optional().nullable(),
});
export type Asset = z.infer<typeof AssetSchema>;

export interface CommandBarSettings {
  tenant_id: string;
  agent_id: string;
  visible?: boolean;
  message?: string;
  start_time?: string;
  end_time?: string;
  parent_url?: string;
  session_id?: string;
  browsed_urls?: BrowsedUrl[];
  bc?: boolean;
  is_test?: boolean;
  is_admin?: boolean;
  query_params?: Record<string, string>;
  position?: string;
  root_zindex?: string;
  root_bottom_offset?: string;
  root_right_offset?: string;
  feedback_enabled?: boolean;
}
