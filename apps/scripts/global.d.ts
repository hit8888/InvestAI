/**
 * Global Type Declarations
 *
 * This file contains only global type augmentations and declarations
 * that need to be available throughout the application without imports.
 */

import type {
  PostMessageData,
  SentryConfig,
  SentryEvent,
  SentryOptions,
} from "./lib/types";

declare global {
  interface Window {
    Sentry: {
      init(config: SentryConfig): void;
      setTag(key: string, value: string | null): void;
      captureException(error: Error, options?: SentryOptions): void;
      captureEvent(event: SentryEvent): void;
    };
    postMessage(
      message: PostMessageData,
      targetOrigin: string,
      transfer?: Transferable[],
    ): void;
    __breakout__?: {
      tenantId?: string;
      prospectId?: string;
      apiBaseUrl?: string;
      domDetectionInitialized?: boolean;
    };
  }
}

// Make this file a module
export {};
