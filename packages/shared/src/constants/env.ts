import { z } from 'zod';

const envSchema = z.object({
  VITE_BASE_API_URL: z.string(),
  VITE_BASE_WS_URL: z.string(),
  VITE_SENTRY_DSN: z.string().optional(),
  VITE_APP_ENV: z.string(),
  VITE_WC_TAG_NAME: z.string(),
  VITE_BOOK_MEETING_WC_TAG_NAME: z.string(),
  VITE_VECTOR_PIXEL_ID: z.string(),
});

export const ENV = envSchema.parse(import.meta.env);
