declare global {
  interface SentryConfig {
    dsn: string;
    tracesSampleRate: number;
    beforeSend: (event: unknown) => unknown;
  }

  interface SentryExtra {
    event: string | { type: string };
    url: string;
  }

  interface SentryTags {
    tenant_id: string | null;
    agent_id: string;
    error_type: string;
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
  }

  interface Constants {
    DEFAULT_WIDTH: string;
    DEFAULT_HEIGHT: string;
    COLLAPSED_SIZE_WIDTH: string;
    COLLAPSED_SIZE_HEIGHT_WITH_BUBBLE_PX: number;
    COLLAPSED_SIZE_HEIGHT_PX: number;
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

export {};
