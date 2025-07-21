import { initSentry } from '@meaku/core/lib/sentry';
import { ENV } from '@meaku/core/types/env';
import { getWebsocketBaseUrl, isDev } from '../utils/common';

if (!isDev) {
  const WEBSOCKET_URL = `${getWebsocketBaseUrl()}/ws/chat`;

  initSentry({
    dsn: ENV.VITE_SENTRY_DSN,
    tracePropagationTargets: [ENV.VITE_BASE_API_URL, WEBSOCKET_URL],
  });
}
