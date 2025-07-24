/// <reference types="vite/client" />
/// <reference types="vite/types/importMeta.d.ts" />

interface ImportMetaEnv extends import('vite/types/importMeta').ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_BASE_API_URL: string;
  readonly VITE_CHAT_BASE_API_URL: string;
  readonly VITE_SENTRY_DSN: string;
  readonly VITE_LOGROCKET_APP_ID: string;
  readonly VITE_APP_ENV: string;
  readonly VITE_AGENT_BASE_URL: string;
  readonly VITE_AGENT_STG_BASE_URL: string;
}

interface ImportMeta extends import('vite/types/importMeta').ImportMeta {
  readonly env: ImportMetaEnv;
}
