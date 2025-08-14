/**
 * Application Constants
 *
 * This file contains all constant values for the chat widget application.
 * Constants are organized by domain and properly typed.
 */

import type { AllResponsiveSizes } from "./types";
import { EntryPointAlignment } from "./types";

// Re-export the enum for convenience
export { EntryPointAlignment };
export type { EntryPointAlignmentType } from "./types";

// ============================================================================
// RESPONSIVE DESIGN
// ============================================================================

export const RESPONSIVE_SIZES: AllResponsiveSizes = {
  DESKTOP: {
    DEFAULT: {
      WIDTH: "max(420px, 100vw)",
      HEIGHT: "max(700px, 100vh)",
    },
    COLLAPSED: {
      CENTER_WIDTH_INITIAL: "max(420px, 100vw)",
      CENTER_WIDTH_MESSAGE_SENT: "max(440px, 25vw)",
      CENTER_HEIGHT_WITH_BUBBLE: "min(280px, 40vh)",
      CENTER_HEIGHT_MESSAGE_SENT: "max(100px, 10vh)",
      CENTER_HEIGHT: "max(100px, 10vh)",
      SIDEWISE_WIDTH_MESSAGE_SENT: "80px",
      SIDEWISE_WIDTH_INITIAL: "500px",
      SIDEWISE_HEIGHT_WITH_BUBBLE: "250px",
      SIDEWISE_HEIGHT: "120px",
      SIDEWISE_HEIGHT_MESSAGE_SENT: "80px",
    },
  },
  TABLET: {
    DEFAULT: {
      WIDTH: "max(380px, 100vw)",
      HEIGHT: "max(600px, 100dvh)",
    },
    COLLAPSED: {
      CENTER_WIDTH_INITIAL: "max(380px, 100vw)",
      CENTER_WIDTH_MESSAGE_SENT: "max(440px, 30vw)",
      CENTER_HEIGHT_WITH_BUBBLE: "max(280px, 30vh)",
      CENTER_HEIGHT_MESSAGE_SENT: "max(100px, 10vh)",
      CENTER_HEIGHT: "max(80px, 10vh)",
      SIDEWISE_WIDTH_MESSAGE_SENT: "80px",
      SIDEWISE_WIDTH_INITIAL: "500px",
      SIDEWISE_HEIGHT_WITH_BUBBLE: "min(280px, 40vh)",
      SIDEWISE_HEIGHT: "120px",
      SIDEWISE_HEIGHT_MESSAGE_SENT: "max(100px, 10vh)",
    },
  },
} as const;

// ============================================================================
// UI POSITIONING & STYLING
// ============================================================================

export const ENTRY_POINT_LEFT_MAP = {
  left: "0",
  right: "auto",
  center: "50%",
} as const;

export const ENTRY_POINT_RIGHT_MAP = {
  left: "auto",
  right: "0",
  center: "auto",
} as const;

export const ENTRY_POINT_TRANSFORM_MAP = {
  left: "none",
  right: "none",
  center: "translateX(-50%) scale(1)",
} as const;

export const Z_INDEX = {
  WIDGET_EMBEDDED: "1",
  WIDGET_BOTTOM: "1000000000",
  OVERLAY: "1000000001",
  OVERLAY_WRAPPER: "1000000002",
} as const;

// ============================================================================
// DOM SELECTORS & IDS
// ============================================================================

export const WIDGET_IDS = {
  CHAT_CONTAINER: "chat-widget-container",
  CHAT_EMBEDDED: "chat-widget-embedded",
  CHAT_OVERLAY: "chat-widget-overlay",
  BREAKOUT_AGENT: "breakout-agent",
} as const;

export const CSS_CLASSES = {
  NOTIFY_BREAKOUT_BUTTON: ".notify-breakout-button",
} as const;

// ============================================================================
// EXTERNAL SERVICES
// ============================================================================

export const SENTRY_DSN =
  "https://abd92d53cb1a15b17a6c41f3750a5324@o4507977649750016.ingest.us.sentry.io/4507977650733056";

// ============================================================================
// PERFORMANCE & BEHAVIOR
// ============================================================================

export const RETRY_CONFIG = {
  MAX_IFRAME_RETRIES: 5,
  IFRAME_CHECK_DELAY: 3000,
  BASE_RETRY_DELAY: 100,
} as const;

export const PERFORMANCE_CONFIG = {
  SENTRY_TRACES_SAMPLE_RATE: 0.1,
  IFRAME_LOAD_TIMEOUT: 3000,
  MESSAGE_HANDLER_TIMEOUT: 5000,
} as const;

export const STORAGE_KEYS = {
  PROSPECT_ID: "prospectId",
  URL_TRACKING: "urlTracker",
} as const;
