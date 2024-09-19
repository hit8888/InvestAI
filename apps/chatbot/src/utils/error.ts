import * as Sentry from "@sentry/react";
import { isProduction } from "./common";

type ErrorContext = {
  component: string;
  action: string;
  sessionId?: string;
  additionalData?: Record<string, unknown>;
};

export const trackError = (error: unknown, context: ErrorContext) => {
  let sentryError: Error;

  if (error instanceof Error) {
    sentryError = error;
  } else if (typeof error === "string") {
    sentryError = new Error(error);
  } else {
    sentryError = new Error("An unknown error occurred");
    sentryError.name = "UnknownError";
  }

  if (!(error instanceof Error) && Error.captureStackTrace) {
    Error.captureStackTrace(sentryError, trackError);
  }

  Sentry.withScope((scope) => {
    scope.setTag("component", context.component);
    scope.setTag("action", context.action);

    if (context.sessionId) {
      scope.setContext("session", { id: context.sessionId });
    }

    if (context.additionalData) {
      Object.entries(context.additionalData).forEach(([key, value]) => {
        scope.setExtra(key, value);
      });
    }

    scope.setExtra("environment", process.env.NODE_ENV);
    scope.setExtra("timestamp", new Date().toISOString());

    Sentry.captureException(sentryError);
  });

  if (!isProduction) {
    console.error(`Found an error`, sentryError, context);
  }
};
