/// <reference types="vite/client" />
/// <reference types="vite/types/importMeta.d.ts" />

interface ImportMetaEnv extends import('vite/types/importMeta').ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_BASE_API_URL: string;
  readonly VITE_WEBSOCKET_URL: string;
  readonly VITE_SENTRY_DSN: string;
  readonly VITE_SENTRY_AUTH_TOKEN: string;
  readonly VITE_AMPLITUDE_API_KEY: string;
  readonly VITE_LOGROCKET_APP_ID: string;
  readonly VITE_APP_ENV: string;
}

interface ImportMeta extends import('vite/types/importMeta').ImportMeta {
  readonly env: ImportMetaEnv;
}
