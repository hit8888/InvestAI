import * as Sentry from '@sentry/react';
import { useEffect } from 'react';
import { createRoutesFromChildren, matchRoutes, useLocation, useNavigationType } from 'react-router-dom';
import { ENV } from '@meaku/core/types/env';
import { isDev } from '../utils/common';

const WEBSOCKET_URL = `${ENV.VITE_CHAT_BASE_API_URL}/tenant/ws`;

Sentry.init({
  dsn: isDev ? '' : ENV.VITE_SENTRY_DSN,
  integrations: [
    Sentry.reactRouterV6BrowserTracingIntegration({
      useEffect,
      useLocation,
      useNavigationType,
      createRoutesFromChildren,
      matchRoutes,
    }),
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 1.0,
  tracePropagationTargets: [ENV.VITE_BASE_API_URL, WEBSOCKET_URL],
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
