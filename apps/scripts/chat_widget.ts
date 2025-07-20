import {
  AgentIframeManager,
  BottomBarContainerManager,
  ConfigManager,
  DeviceManager,
  EmbeddedContainerManager,
  ExternalButtonManager,
  IframeURLManager,
  MessageEventManager,
  MessageManager,
  OverlayManager,
  SentryManager,
  StyleManager,
  TimeManager,
  URLManager,
  UrlTrackingManager,
  HistoryManager,
} from "./managers";
import { type EntryPointAlignmentType } from "./lib/types";
import { STORAGE_KEYS } from "lib/constants";
import { TabNotificationManager } from "managers/TabNotificationManager";

(function () {
  // Initialize managers
  const iframeURLManager = IframeURLManager();
  const deviceManager = DeviceManager();
  const messageManager = MessageManager();
  const urlManager = URLManager();
  const timeManager = TimeManager();
  const configManager = ConfigManager(deviceManager.getDeviceType());
  const sentryManager = SentryManager(
    configManager.constants.SENTRY_DSN,
    configManager.getConfig(),
  );
  const styleManager = StyleManager(
    configManager.constants.RESPONSIVE_SIZES,
    deviceManager.getDeviceType,
  );
  const externalButtonManager = ExternalButtonManager(
    messageManager.sendMessage,
  );
  const agentIframeManager = AgentIframeManager();
  const bottomBarContainerManager = BottomBarContainerManager(
    configManager.constants.RESPONSIVE_SIZES,
    deviceManager.getDeviceType(),
    configManager.getConfig().containerId,
  );
  const embeddedContainerManager = EmbeddedContainerManager(
    agentIframeManager.create,
    messageManager.sendMessage,
  );
  const overlayManager = OverlayManager(
    messageManager.sendMessage,
    configManager.getConfig().containerId,
  );
  const urlTrackingManager = UrlTrackingManager();
  const tabNotificationManager = TabNotificationManager();
  HistoryManager(() => {
    const prospectId = localStorage.getItem(STORAGE_KEYS.PROSPECT_ID);

    if (!prospectId) {
      agentIframeManager.reload();
    }
    urlTrackingManager.trackCurrentUrl();
  });

  // Widget initialization function
  const initializeWidget = async (): Promise<void> => {
    const config = configManager.getConfig();
    const IFRAME_SRC = iframeURLManager.getIframeSrc(config);
    const postMessage = messageManager.sendMessage;

    const isAgentEnabled = false;
    const isAgentOpen = false;
    const iFrameSource: Window | MessagePort | ServiceWorker | null = null;
    const showBanner = false;
    const entryPointAlignment: EntryPointAlignmentType | null = null; // default value
    const hasFirstUserMessageBeenSent = false;
    let currentContainer: HTMLElement | null = null;
    let embeddedContainer: HTMLElement | null = null;
    let bottomContainer: HTMLElement | null = null;
    const initialMessageSent: boolean = false;
    const isMobile =
      deviceManager.isMobile() || deviceManager.getDeviceType() === "TABLET";

    try {
      let iframe: HTMLIFrameElement;

      // Create embedded container if containerId is provided
      if (config.containerId) {
        const { container, iframe: embeddedIframe } =
          embeddedContainerManager.createContainer(
            config.containerId,
            IFRAME_SRC,
            isMobile,
          );
        if (container) {
          embeddedContainer = container;
          currentContainer = container;
          if (embeddedIframe) {
            iframe = embeddedIframe;
          }
        }
      }

      // Create bottom container if no containerId or showBottomBar is true
      if (!config.containerId || config.showBottomBar) {
        bottomContainer = bottomBarContainerManager.createContainer();
        if (!currentContainer) {
          iframe = agentIframeManager.create(
            bottomContainer,
            IFRAME_SRC,
            isMobile,
          );
          currentContainer = bottomContainer;
        }
      }

      // Create overlay for form submissions
      overlayManager.initialize(embeddedContainer, bottomContainer);

      // Set iframe reference in overlay manager
      if (iframe! && currentContainer) {
        overlayManager.setIframe(iframe!, currentContainer);
      }

      urlTrackingManager.init({
        postMessage: messageManager.sendMessage.bind(null, iframe!),
      });

      tabNotificationManager.init({
        postMessage: messageManager.sendMessage.bind(null, iframe!),
      });

      // Initialize message event manager
      const messageEventState = {
        iFrameSource,
        isAgentEnabled,
        isAgentOpen,
        showBanner,
        entryPointAlignment,
        hasFirstUserMessageBeenSent,
        initialMessageSent,
        currentContainer,
        bottomContainer,
        iframe: iframe!,
      };

      const messageEventDependencies = {
        urlManager,
        configManager,
        styleManager,
        overlayManager,
        urlTrackingManager,
        postMessage,
      };

      const messageEventManager = MessageEventManager(
        messageEventDependencies,
        messageEventState,
        IFRAME_SRC,
      );

      // Setup message event listener
      messageEventManager.setupEventListener();
    } catch (err) {
      console.error("Error initializing widget:", err);
      if (err instanceof Error) {
        window.Sentry?.captureException(err);
      } else {
        window.Sentry?.captureException(new Error(String(err)));
      }
    }
  };

  // Main Application Module
  const App = {
    async init(): Promise<void> {
      const config = configManager.getConfig();
      const { tenantId, agentId, startTime, endTime } = config;

      if (!tenantId || !agentId) {
        return;
      }

      // Check if current time is within allowed range
      if (!timeManager.isWithinTimeRange(startTime, endTime)) {
        return;
      }

      // Initialize Sentry in the background without awaiting
      sentryManager.init();

      if (config.allowExternalButtons) {
        externalButtonManager.handleExternalButtons();
      }

      // Initialize widget immediately
      initializeWidget();
    },
  };

  // Start the application
  (() => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => App.init());
    } else {
      App.init();
    }
  })();
})();
