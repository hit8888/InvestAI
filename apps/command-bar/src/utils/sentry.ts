import { initSentry } from '@meaku/core/lib/sentry';
import { ENV } from '@meaku/shared/constants/env';

const dsn = ENV.VITE_SENTRY_DSN;

if (dsn) {
  const WEBSOCKET_URL = `${ENV.VITE_BASE_WS_URL}/ws/chat`;
  const bundleName = `${ENV.VITE_WC_TAG_NAME}.js`;
  const targetBaseUrls = [ENV.VITE_BASE_API_URL, ENV.VITE_BASE_WS_URL];

  initSentry({
    dsn,
    tracePropagationTargets: [ENV.VITE_BASE_API_URL, WEBSOCKET_URL],

    beforeSend(event, hint) {
      const error = hint.originalException;

      if (error instanceof Error && error.stack?.includes(bundleName)) {
        return event;
      }

      return null;
    },

    beforeBreadcrumb(breadcrumb) {
      if (breadcrumb.category !== 'fetch' && breadcrumb.category !== 'xhr') {
        return null;
      }

      const url = breadcrumb.data?.url;

      if (typeof url === 'string' && targetBaseUrls.some((baseUrl) => url.startsWith(baseUrl))) {
        return breadcrumb;
      }

      return null;
    },
  });
}
