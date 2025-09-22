import * as Sentry from '@sentry/react';
import type { BrowserOptions } from '@sentry/react';
import { useEffect } from 'react';
import { createRoutesFromChildren, matchRoutes, useLocation, useNavigationType } from 'react-router-dom';

export const COMMON_IGNORE_ERRORS = [
  'ResizeObserver loop limit exceeded',
  'Non-Error promise rejection captured',
  'AbortError',
  'WebKitBlobResource error',
  'Script error.',
  'Load failed',
  'SecurityError',
];

export const COMMON_DENY_URLS = [
  // Local development
  'localhost',
  '127.0.0.1',
  /^file:\/\//i,
  // Browser extensions
  /^chrome-extension:\/\//i,
  /^moz-extension:\/\//i,
  /^safari-extension:\/\//i,
  // Third-party tracking scripts
  /facebook\.net/i,
  /google-analytics/i,
  /googletagmanager/i,
  /gtag/i,
  /fbevents/i,
  // Common bot/crawler patterns
  /googlebot/i,
  /bingbot/i,
  /slurp/i,
  // Ad blockers and privacy tools
  /ublock/i,
  /adblock/i,
  /privacy/i,
];

export function initSentry(config: BrowserOptions) {
  Sentry.init({
    integrations: [
      Sentry.reactRouterV6BrowserTracingIntegration({
        useEffect,
        useLocation,
        useNavigationType,
        createRoutesFromChildren,
        matchRoutes,
      }),
      Sentry.replayIntegration(),
    ],
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,

    // Filter out development, extensions, and third-party script URLs
    denyUrls: [...COMMON_DENY_URLS],

    // Filter out common noisy error messages (regardless of source)
    ignoreErrors: [...COMMON_IGNORE_ERRORS],
    ...config,
  });
}
