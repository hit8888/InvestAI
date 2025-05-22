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
  PENDING = 'PENDING',
  JOINED = 'JOINED',
  DENIED = 'DENIED',
  EXIT = 'EXIT',
}
