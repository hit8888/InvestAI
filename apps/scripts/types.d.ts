declare global {
  interface SentryConfig {
    dsn: string;
    tracesSampleRate: number;
    beforeSend: (event: unknown) => unknown;
  }

  interface SentryExtra {
    event: string | { type: string };
    url: string;
    data?: object;
  }

  interface SentryTags {
    tenant_id: string | null;
    agent_id: string;
    error_type: string;
    component?: string;
  }

  interface SentryOptions {
    tags: SentryTags;
    extra: SentryExtra;
  }

  type SentryEvent = {
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

  interface ButtonClickMessage {
    type: "open-breakout-button";
    data: {
      buttonId: string;
      message: string;
    };
  }

  interface WidgetConfigMessage {
    utmParams: UtmParameters;
    http_referrer: string;
    url: string;
    hideBottomBar: boolean;
    isCollapsible: boolean;
  }

  interface ParentAppMessage {
    type: "PARENT_FORM_MESSAGE";
    data: {
      message: string;
    };
  }

  type PostMessageData =
    | ButtonClickMessage
    | WidgetConfigMessage
    | ParentAppMessage;

  interface PostMessageOptions extends WindowPostMessageOptions {
    targetOrigin: string;
  }

  interface MessageEventSource {
    postMessage(
      message: PostMessageData,
      targetOrigin: string | PostMessageOptions,
      transfer?: Transferable[],
    ): void;
  }

  interface Window {
    Sentry: {
      init(config: SentryConfig): void;
      setTag(key: string, value: string | null): void;
      captureException(error: Error, options?: SentryOptions): void;
      captureEvent(event: SentryEvent): void;
    };
    postMessage(
      message: PostMessageData,
      targetOrigin: string | PostMessageOptions,
      transfer?: Transferable[],
    ): void;
  }

  interface Config {
    tenantId: string | null;
    agentId: string;
    hideBottomBar: boolean;
    showBottomBar: boolean;
    height: string;
    allowExternalButtons: boolean;
    containerId: string | null;
    feedbackEnabled: boolean;
    userEmail: string;
    isStaging: boolean;
    initialMessage: string;
  }

  interface DefaultSizes {
    WIDTH: string;
    HEIGHT: string;
  }

  interface CollapsedSizes {
    SIDEWISE_WIDTH_INITIAL: string;
    SIDEWISE_WIDTH_MESSAGE_SENT: string;
    SIDEWISE_HEIGHT_WITH_BUBBLE: string;
    SIDEWISE_HEIGHT: string;
    SIDEWISE_HEIGHT_MESSAGE_SENT: string;
    CENTER_WIDTH_INITIAL: string;
    CENTER_WIDTH_MESSAGE_SENT: string;
    CENTER_HEIGHT_WITH_BUBBLE: string;
    CENTER_HEIGHT: string;
    CENTER_HEIGHT_MESSAGE_SENT: string;
  }

  // Define the enum as a regular object for runtime access
  const EntryPointAlignment = {
    LEFT: "left",
    RIGHT: "right",
    CENTER: "center",
  } as const;

  // Type for TypeScript
  type EntryPointAlignmentType =
    (typeof EntryPointAlignment)[keyof typeof EntryPointAlignment];

  interface Constants {
    RESPONSIVE_SIZES: {
      DESKTOP: {
        DEFAULT: DefaultSizes;
        COLLAPSED: CollapsedSizes;
      };
      TABLET: {
        DEFAULT: DefaultSizes;
        COLLAPSED: CollapsedSizes;
      };
    };
    SENTRY_DSN: string;
  }

  interface UtmParameters {
    utm_source: string | null;
    utm_medium: string | null;
    utm_campaign: string | null;
    utm_term: string | null;
    utm_content: string | null;
    isAgentOpen: string | null;
    source: string | null;
  }

  interface IframeMessage {
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
    entryPointAlignment?: EntryPointAlignmentType;
    hasFirstUserMessageBeenSent?: boolean;
    sessionId?: string;
    prospectId?: string;
    apiBaseUrl?: string;
    config: {
      tracking_config: TrackingConfigType;
    };
  }

  interface OverlayManager {
    overlay: HTMLDivElement;
    wrapper: HTMLDivElement;
    show: () => void;
    hide: () => void;
  }
}

export interface ExternalButtonManager {
  handleExternalButtons(): void;
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

export interface ProspectRequestData {
  email?: string;
  name?: string;
  external_id?: string;
  prospect_demographics: unknown;
  origin?: "WEB_FORM" | "LINK_CLICK";
}

declare global {
  interface Window {
    __breakout__?: {
      tenantId?: string;
      prospectId?: string;
      apiBaseUrl?: string;
      domDetectionInitialized?: boolean;
    };
  }
}

export {};
