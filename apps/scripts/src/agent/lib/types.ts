/**
 * Core Application Types
 *
 * This file contains all type definitions for the chat widget application.
 * Types are organized by domain and clearly separated from constants.
 */

// ============================================================================
// CONSTANTS TYPES
// ============================================================================

export interface ResponsiveSizes {
  readonly WIDTH: string;
  readonly HEIGHT: string;
}

export interface CollapsedSizes {
  readonly CENTER_WIDTH_INITIAL: string;
  readonly CENTER_WIDTH_MESSAGE_SENT: string;
  readonly CENTER_HEIGHT_WITH_BUBBLE: string;
  readonly CENTER_HEIGHT_MESSAGE_SENT: string;
  readonly CENTER_HEIGHT: string;
  readonly SIDEWISE_WIDTH_MESSAGE_SENT: string;
  readonly SIDEWISE_WIDTH_INITIAL: string;
  readonly SIDEWISE_WIDTH_INITIAL_CYCLE_COMPLETED: string;
  readonly SIDEWISE_HEIGHT_WITH_BUBBLE: string;
  readonly SIDEWISE_HEIGHT: string;
  readonly SIDEWISE_HEIGHT_MESSAGE_SENT: string;
}

export interface DeviceResponsiveSizes {
  readonly DEFAULT: ResponsiveSizes;
  readonly COLLAPSED: CollapsedSizes;
}

export interface AllResponsiveSizes {
  readonly DESKTOP: DeviceResponsiveSizes;
  readonly TABLET: DeviceResponsiveSizes;
}

// Entry point alignment
export const EntryPointAlignment = {
  LEFT: "left",
  RIGHT: "right",
  CENTER: "center",
} as const;

export type EntryPointAlignmentType =
  (typeof EntryPointAlignment)[keyof typeof EntryPointAlignment];

// ============================================================================
// APPLICATION CONFIGURATION
// ============================================================================

export interface Config {
  tenantId: string | null;
  agentId: string | null;
  startTime: string | null;
  endTime: string | null;
  allowedDays: string | null;
}

export interface Constants {
  RESPONSIVE_SIZES: AllResponsiveSizes;
  SENTRY_DSN: string;
}

// ============================================================================
// TRACKING & ANALYTICS
// ============================================================================

export type TrackingConfigType = {
  track_form_submissions: boolean;
  track_clicks: boolean;
  element_selectors: string[];
};

export type FormSubmissionConfigType = Pick<
  TrackingConfigType,
  "track_form_submissions"
>;

export type DomElementClickConfigType = Pick<
  TrackingConfigType,
  "track_clicks" | "element_selectors"
>;

export type UrlEntry = {
  url: string;
  timestamp: number;
};

export interface ProspectRequestData {
  email?: string;
  name?: string;
  external_id?: string;
  prospect_demographics?: unknown;
  origin?: "WEB_FORM" | "LINK_CLICK";
  browsed_urls?: UrlEntry[];
}

// ============================================================================
// MESSAGING & COMMUNICATION
// ============================================================================

export interface UtmParameters {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  isAgentOpen: string | null;
  source: string | null;
}

export interface ButtonClickMessage {
  type: "open-breakout-button";
  data: {
    buttonId: string;
    message: string;
  };
}

export interface WidgetConfigMessage {
  utmParams: UtmParameters;
  http_referrer: string;
  url: string;
  hideBottomBar: boolean;
  isCollapsible: boolean;
}

export interface ParentAppMessage {
  type: "PARENT_FORM_MESSAGE";
  data: {
    message: string;
  };
}

export interface InitMessage {
  type: "INIT";
  payload: {
    utmParams: UtmParameters;
    http_referrer: string;
    url: string;
    hideBottomBar: boolean;
    isCollapsible: boolean;
    prospectId: string | null;
  };
}

export type PostMessageData =
  | ButtonClickMessage
  | WidgetConfigMessage
  | ParentAppMessage
  | InitMessage;

export interface IframeMessage {
  type?: string;
  data?: {
    buttonId?: string;
    message?: string;
  };
  utmParams?: UtmParameters;
  http_referrer?: string;
  url?: string;
  hideBottomBar?: boolean;
  isCollapsible?: boolean;
  chatOpen?: boolean;
  showBanner?: boolean;
  cycleCompleted?: boolean;
  entryPointAlignment?: EntryPointAlignmentType;
  hasFirstUserMessageBeenSent?: boolean;
  sessionId?: string;
  prospectId?: string;
  apiBaseUrl?: string;
  isAgentEnabled?: boolean;
  config: {
    tracking_config: TrackingConfigType;
  };
}

// ============================================================================
// ERROR HANDLING & MONITORING
// ============================================================================

export interface SentryConfig {
  dsn: string;
  tracesSampleRate: number;
  beforeSend: (event: unknown) => unknown;
}

export interface SentryExtra {
  event: string | { type: string };
  url: string;
  data?: object;
}

export interface SentryTags {
  tenant_id: string | null;
  agent_id: string;
  error_type: string;
  component?: string;
}

export interface SentryOptions {
  tags: SentryTags;
  extra: SentryExtra;
}

export type SentryEvent = {
  message?: string;
  stacktrace?: {
    frames: Array<{
      filename: string;
      lineno: number;
      colno: number;
      function: string;
    }>;
  };
};

// ============================================================================
// MANAGER INTERFACES
// ============================================================================

export interface ExternalButtonManager {
  setupButtonEventListeners(): void;
  removeButtonEventListeners(): void;
}

export interface AgentIframeManager {
  create(container: HTMLElement, iframeSrc: string): HTMLIFrameElement;
  handleError(
    container: HTMLElement,
    iframeSrc: string,
    event: Event | string,
    retryCount?: number,
  ): void;
  checkIframeStatus(
    iframeLoaded: boolean,
    iframe: HTMLIFrameElement,
    container: HTMLElement,
    iframeSrc: string,
    retryCount?: number,
  ): void;
  retryLoading(
    container: HTMLElement,
    iframeSrc: string,
    retryCount: number,
  ): void;
  handleMaxRetriesReached(container: HTMLElement): void;
}

export interface BottomBarContainerManager {
  createContainer(): HTMLDivElement;
}

export interface OverlayInstance {
  overlay: HTMLDivElement;
  wrapper: HTMLDivElement;
  show: () => void;
  hide: () => void;
}
