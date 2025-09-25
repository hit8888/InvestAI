import * as Sentry from '@sentry/react';
import { ENV } from '@meaku/shared/constants/env';
import { isProduction } from '@meaku/shared/constants/common';
import { COMMON_DENY_URLS, COMMON_IGNORE_ERRORS } from '@meaku/core/lib/sentry';

const dsn = ENV.VITE_SENTRY_DSN;

if (isProduction && dsn) {
  const WEBSOCKET_URL = `${ENV.VITE_BASE_WS_URL}/ws/chat`;
  const targetBaseUrls = [ENV.VITE_BASE_API_URL, ENV.VITE_BASE_WS_URL];

  Sentry.init({
    dsn,
    // Override: Disable default integrations that capture global errors
    defaultIntegrations: false,
    integrations: [
      Sentry.httpContextIntegration(),
      Sentry.linkedErrorsIntegration(),
      Sentry.functionToStringIntegration(),
      Sentry.breadcrumbsIntegration(),
      Sentry.inboundFiltersIntegration({
        denyUrls: COMMON_DENY_URLS,
        ignoreErrors: COMMON_IGNORE_ERRORS,
      }),
      Sentry.replayIntegration(),
    ],
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 1.0,
    tracePropagationTargets: [ENV.VITE_BASE_API_URL, WEBSOCKET_URL],
    tracesSampleRate: 1.0,

    // Override: Only capture network breadcrumbs for our API calls
    beforeBreadcrumb(breadcrumb) {
      if (breadcrumb.category === 'fetch' || breadcrumb.category === 'xhr') {
        const url = breadcrumb.data?.url;

        if (typeof url === 'string' && targetBaseUrls.some((baseUrl) => url.startsWith(baseUrl))) {
          return breadcrumb;
        }

        return null;
      }

      // Allow navigation and console breadcrumbs (these will only come from our error boundary)
      if (breadcrumb.category === 'navigation' || breadcrumb.category === 'console') {
        return breadcrumb;
      }

      return null;
    },
  });
}
