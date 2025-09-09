// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { z } from 'zod';

const envSchema = z.object({
  VITE_BASE_API_URL: z.string(),
  VITE_CHAT_BASE_API_URL: z.string().optional(),
  VITE_SENTRY_DSN: z.string().optional(),
  VITE_LOGROCKET_APP_ID: z.string(),
  VITE_APP_ENV: z.string(),
  VITE_GOOGLE_SSO_CLIENT_ID: z.string(),
});

export const ENV = envSchema.parse(import.meta.env);
