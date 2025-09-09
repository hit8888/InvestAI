import { initSentry } from '@meaku/core/lib/sentry';
import { ENV } from '@meaku/shared/constants/env';
import { isProduction } from '@meaku/shared/constants/common';

const dsn = ENV.VITE_SENTRY_DSN;

if (isProduction && dsn) {
  const WEBSOCKET_URL = `${ENV.VITE_BASE_WS_URL}/ws/chat`;

  initSentry({
    dsn,
    tracePropagationTargets: [ENV.VITE_BASE_API_URL, WEBSOCKET_URL],
  });
}
