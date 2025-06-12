import { STORAGE_KEYS } from "lib/constants";
import { initDomDetectors } from "../dom-detectors";
import type {
  Config,
  EntryPointAlignmentType,
  IframeMessage,
  UtmParameters,
} from "../lib/types";
import { EntryPointAlignment } from "../lib/types";

export interface MessageEventDependencies {
  urlManager: {
    getUtmParameters: () => UtmParameters;
    updateParentUrlParam: (key: string, value: string) => void;
  };
  configManager: {
    getConfig: () => Config;
  };
  styleManager: {
    adjustResponsiveStyles: (
      container: HTMLElement,
      isAgentOpen: boolean,
      hideBottomBar: boolean,
      showBanner: boolean,
      entryPointAlignment: EntryPointAlignmentType,
      hasFirstUserMessageBeenSent: boolean,
    ) => void;
    setupResizeListener: (
      container: HTMLElement,
      getState: () => {
        isAgentOpen: boolean;
        hideBottomBar: boolean;
        showBanner: boolean;
        entryPointAlignment: EntryPointAlignmentType;
        hasFirstUserMessageBeenSent: boolean;
      },
    ) => void;
  };
  overlayManager: {
    getWrapper: () => HTMLDivElement | null;
  };
  urlTrackingManager: {
    trackCurrentUrl: () => void;
    updateFirstInteractionTimestamp: (isAgentOpen: boolean) => void;
  };
  postMessage: (iframe: HTMLIFrameElement, message: object) => void;
}

export interface MessageEventState {
  iFrameSource: Window | MessagePort | ServiceWorker | null;
  isAgentOpen: boolean;
  showBanner: boolean;
  entryPointAlignment: EntryPointAlignmentType | null;
  hasFirstUserMessageBeenSent: boolean;
  initialMessageSent: boolean;
  currentContainer: HTMLElement | null;
  bottomContainer: HTMLElement | null;
  iframe: HTMLIFrameElement | null;
}

export function MessageEventManager(
  dependencies: MessageEventDependencies,
  state: MessageEventState,
  iframeSrc: string,
) {
  const {
    urlManager,
    configManager,
    styleManager,
    overlayManager,
    urlTrackingManager,
    postMessage,
  } = dependencies;

  // Origin validation
  const isValidOrigin = (eventOrigin: string): boolean => {
    try {
      const eventDomain = eventOrigin.split(".")?.[1];
      const iframeDomain = iframeSrc?.split(".")?.[1];
      return eventDomain === iframeDomain;
    } catch {
      return false;
    }
  };

  // Message type handlers
  const handleIframeReady = (event: MessageEvent<IframeMessage>): void => {
    console.log("Iframe is ready to receive messages");
    state.iFrameSource = event.source;

    if (state.iFrameSource && "postMessage" in state.iFrameSource) {
      const utmParams = urlManager.getUtmParameters();
      const http_referrer = document.referrer;
      const config = configManager.getConfig();

      state.iFrameSource.postMessage(
        {
          type: "INIT",
          payload: {
            utmParams,
            http_referrer,
            url: window.location.href,
            hideBottomBar: config.hideBottomBar,
            isCollapsible:
              state.currentContainer === overlayManager.getWrapper()
                ? true
                : !config.containerId,
            prospectId: localStorage.getItem("__breakout__prospectId"),
          },
        },
        { targetOrigin: "*" },
      );
    }
  };

  const handleEmbedReady = (event: MessageEvent<IframeMessage>): void => {
    state.iFrameSource = event.source;
    const config = configManager.getConfig();

    // Send initial message if configured
    if (
      state.iFrameSource &&
      "postMessage" in state.iFrameSource &&
      config.initialMessage &&
      !state.initialMessageSent &&
      !event.data.sessionId
    ) {
      state.iFrameSource.postMessage(
        {
          type: "PARENT_FORM_MESSAGE",
          data: {
            message: config.initialMessage,
          },
        },
        { targetOrigin: "*" },
      );
      state.initialMessageSent = true;
    }

    const { prospectId, apiBaseUrl, config: agentConfig } = event.data;

    if (window.__breakout__?.domDetectionInitialized) {
      return;
    }

    // Save prospectId for use in tracking dom elements
    window.__breakout__ = {
      tenantId: configManager.getConfig().tenantId as string,
      prospectId,
      apiBaseUrl,
      domDetectionInitialized: true,
    };

    const { tracking_config } = agentConfig;
    initDomDetectors(tracking_config);
    urlTrackingManager?.trackCurrentUrl?.();
  };

  const handleChatInit = (event: MessageEvent<IframeMessage>): void => {
    const prospectId = event.data.prospectId ?? "";
    localStorage.setItem(STORAGE_KEYS.PROSPECT_ID, prospectId);

    window.__breakout__ = {
      ...window.__breakout__,
      prospectId: event.data.prospectId,
    };
    urlTrackingManager?.updateFirstInteractionTimestamp?.(!!prospectId);
  };

  const handleChatStateChange = (event: MessageEvent<IframeMessage>): void => {
    if (event.data?.chatOpen === undefined) return;

    const config = configManager.getConfig();

    state.isAgentOpen = event.data.chatOpen;
    state.showBanner = event.data.showBanner ?? false;
    state.entryPointAlignment =
      event.data.entryPointAlignment ?? EntryPointAlignment.CENTER;
    state.hasFirstUserMessageBeenSent =
      event.data.hasFirstUserMessageBeenSent ?? false;

    urlManager.updateParentUrlParam(
      "isAgentOpen",
      state.isAgentOpen.toString(),
    );

    if (
      state.currentContainer === state.bottomContainer &&
      state.bottomContainer
    ) {
      styleManager.adjustResponsiveStyles(
        state.bottomContainer,
        state.isAgentOpen,
        config.hideBottomBar,
        state.showBanner,
        state.entryPointAlignment || EntryPointAlignment.CENTER,
        state.hasFirstUserMessageBeenSent,
      );

      // Setup resize listener for responsive styling
      styleManager.setupResizeListener(state.bottomContainer, () => ({
        isAgentOpen: state.isAgentOpen,
        hideBottomBar: config.hideBottomBar,
        showBanner: state.showBanner,
        entryPointAlignment:
          state.entryPointAlignment || EntryPointAlignment.CENTER,
        hasFirstUserMessageBeenSent: state.hasFirstUserMessageBeenSent,
      }));

      // Send updated state back to iframe
      if (state.iframe) {
        postMessage(state.iframe, {
          chatOpen: state.isAgentOpen,
          showBanner: state.showBanner,
          hasFirstUserMessageBeenSent: state.hasFirstUserMessageBeenSent,
          isCollapsible:
            state.currentContainer === overlayManager.getWrapper()
              ? true
              : !config.containerId,
        });
      }
    }
  };

  // Error handling with Sentry integration
  const handleError = (error: unknown, eventData?: IframeMessage): void => {
    console.error("Error handling message event:", error);

    if (error instanceof Error) {
      window.Sentry?.captureException(error, {
        tags: {
          tenant_id: configManager.getConfig().tenantId,
          agent_id: configManager.getConfig().agentId,
          error_type: "message_event_error",
        },
        extra: {
          event: "message_event",
          url: window.location.href,
          data: eventData,
        },
      });
    }
  };

  // Main message event handler
  const handleMessage = (event: MessageEvent<IframeMessage>): void => {
    try {
      if (!isValidOrigin(event.origin)) {
        return;
      }

      const messageType = event.data.type;

      switch (messageType) {
        case "IFRAME_READY":
          handleIframeReady(event);
          break;
        case "EMBED_READY":
          handleEmbedReady(event);
          break;
        case "CHAT_INIT":
          handleChatInit(event);
          break;
        default:
          break;
      }
      handleChatStateChange(event);
    } catch (error) {
      handleError(error, event.data);
    }
  };

  // Event listener management
  const setupEventListener = (): void => {
    window.addEventListener("message", handleMessage);
  };

  const removeEventListener = (): void => {
    window.removeEventListener("message", handleMessage);
  };

  // Public API
  return {
    setupEventListener,
    removeEventListener,
    handleMessage, // For testing purposes
    // Individual handlers for custom usage
    handlers: {
      handleIframeReady,
      handleEmbedReady,
      handleChatInit,
      handleChatStateChange,
    },
  };
}
