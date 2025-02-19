import { z } from 'zod';
import { ConfigurationSchema } from './configuration_response';
import { FeedbackRequestPayloadSchema, WebSocketMessageSchema } from '../..';

export const SessionSchema = z.object({
  agent_id: z.number(),
  session_id: z.string(),
  prospect_id: z.string(),
  chat_history: z.array(WebSocketMessageSchema),
  feedback: z.array(FeedbackRequestPayloadSchema),
});

export type SessionApiResponse = z.infer<typeof SessionSchema>;

export type StyleConfig = z.infer<typeof ConfigurationSchema>['style_config'];
