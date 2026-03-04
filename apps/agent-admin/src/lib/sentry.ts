import { initSentry } from '@neuraltrade/core/lib/sentry';
import { ENV } from '@neuraltrade/core/types/env';
import { isDev } from '../utils/common';
import { getWebsocketBaseUrl } from '../utils/apiCalls';

if (!isDev) {
  const WEBSOCKET_URL = `${getWebsocketBaseUrl()}/tenant/ws`;

  initSentry({
    dsn: ENV.VITE_SENTRY_DSN,
    tracePropagationTargets: [ENV.VITE_BASE_API_URL, WEBSOCKET_URL],
  });
}
