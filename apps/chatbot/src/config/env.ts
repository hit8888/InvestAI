import { z } from 'zod';

const envSchema = z.object({
  VITE_BASE_API_URL: z.string(),
  VITE_WEBSOCKET_URL: z.string(),
  VITE_SENTRY_DSN: z.string(),
  VITE_SENTRY_AUTH_TOKEN: z.string(),
  VITE_AMPLITUDE_API_KEY: z.string(),
  VITE_LOGROCKET_APP_ID: z.string(),
  VITE_APP_ENV: z.string(),
});

export const ENV = envSchema.parse(import.meta.env);
