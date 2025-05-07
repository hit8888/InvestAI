import { initDomDetectors } from "./dom-detectors";

(function () {
  // Config Module
  const ConfigManager = {
    scriptElement: document.currentScript as HTMLScriptElement | null,
    constants: {
      RESPONSIVE_SIZES: {
        DESKTOP: {
          DEFAULT: {
            WIDTH: "max(420px, 100vw)",
            HEIGHT: "max(700px, 90vh)",
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
            HEIGHT: "max(600px, 88vh)",
          },
          COLLAPSED: {
            CENTER_WIDTH_INITIAL: "max(380px, 100vw)",
            CENTER_WIDTH_MESSAGE_SENT: "max(440px, 30vw)",
            CENTER_HEIGHT_WITH_BUBBLE: "max(280px, 30vh)",
            CENTER_HEIGHT_MESSAGE_SENT: "max(100px, 10vh)",
            CENTER_HEIGHT: "max(140px, 10vh)",
            SIDEWISE_WIDTH_MESSAGE_SENT: "80px",
            SIDEWISE_WIDTH_INITIAL: "500px",
            SIDEWISE_HEIGHT_WITH_BUBBLE: "min(280px, 40vh)",
            SIDEWISE_HEIGHT: "120px",
            SIDEWISE_HEIGHT_MESSAGE_SENT: "max(100px, 10vh)",
          },
        },
      },
      SENTRY_DSN:
        "https://abd92d53cb1a15b17a6c41f3750a5324@o4507977649750016.ingest.us.sentry.io/4507977650733056",
    } as Constants,

    getConfig(): Config {
      return {
        tenantId: this.scriptElement?.getAttribute("tenant-id") ?? null,
        agentId: this.scriptElement?.getAttribute("agent-id") || "1",
        hideBottomBar:
          this.scriptElement?.getAttribute("hide-bottom-bar") === "true",
        showBottomBar:
          this.scriptElement?.getAttribute("show-bottom-bar") === "true",
        height:
          this.scriptElement?.getAttribute("max-height") ||
          this.constants.RESPONSIVE_SIZES[DeviceManager.getDeviceType()].DEFAULT
            .HEIGHT,
        allowExternalButtons:
          this.scriptElement?.getAttribute("allow-external-buttons") === "true",
        containerId: this.scriptElement?.getAttribute("container-id") ?? null,
        feedbackEnabled:
          this.scriptElement?.getAttribute("feedback-enabled") === "true",
        userEmail: this.scriptElement?.getAttribute("user-email") ?? "",
        isStaging: this.scriptElement?.getAttribute("is-staging") === "true", // TODO: Move to env based solution
        initialMessage:
          this.scriptElement?.getAttribute("initial-message") ?? "",
        startTime: this.scriptElement?.getAttribute("start-time") ?? null,
        endTime: this.scriptElement?.getAttribute("end-time") ?? null,
      };
    },
  };

  // Message Manager Module
  const MessageManager = {
    sendMessage(iframe: HTMLIFrameElement, message: object): void {
      if (iframe.contentWindow && "postMessage" in iframe.contentWindow) {
        iframe.contentWindow.postMessage({ ...message }, { targetOrigin: "*" });
      }
    },
  };

  // URL and Parameters Module
  const URLManager = {
    updateParentUrlParam(key: string, value: string | null): void {
      const url = new URL(window.parent.location.href);
      const currentValue = url.searchParams.get(key);

      if (key === "isAgentOpen" && currentValue === null) {
        return;
      }

      // Only update if the value is different
      if (value === null || value === "") {
        if (currentValue !== null) {
          url.searchParams.delete(key);
          window.parent.history.replaceState({}, "", url);
        }
      } else if (currentValue !== value) {
        url.searchParams.set(key, value);
        window.parent.history.replaceState({}, "", url);
      }
    },

    getQueryParameter(name: string): string | null {
      return new URLSearchParams(window.location.search).get(name);
    },

    getUtmParameters(): UtmParameters {
      const utmParams = [
        "utm_source",
        "utm_medium",
        "utm_campaign",
        "utm_term",
        "utm_content",
        "isAgentOpen",
        "source",
      ] as const;
      return utmParams.reduce((params: Partial<UtmParameters>, key) => {
        params[key as keyof UtmParameters] = this.getQueryParameter(key);
        return params;
      }, {}) as UtmParameters;
    },

    getCurrentUrl(): string {
      return window.location !== window.parent.location
        ? document.referrer
        : document.location.href;
    },
  };

  // Device Detection Module
  const DeviceManager = {
    isMobile(): boolean {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(
        navigator.userAgent,
      );
    },

    getDeviceType(): "DESKTOP" | "TABLET" {
      const width = window.innerWidth;
      return width >= 1024 ? "DESKTOP" : "TABLET";
    },
  };

  // Sentry Module
  const SentryManager = {
    async loadSDK(): Promise<void> {
      if ("Sentry" in window) return;

      const script = document.createElement("script");
      script.src = "https://browser.sentry-cdn.com/7.69.0/bundle.min.js";
      script.crossOrigin = "anonymous";

      return new Promise((resolve, reject) => {
        script.onload = () => resolve();
        script.onerror = () => {
          console.error("Failed to load Sentry SDK");
          reject();
        };
        document.head.appendChild(script);
      });
    },

    async init(): Promise<void> {
      try {
        await this.loadSDK();
        if ("Sentry" in window) {
          window.Sentry.init({
            dsn: ConfigManager.constants.SENTRY_DSN,
            tracesSampleRate: 0.1,
            beforeSend(event: unknown) {
              return event;
            },
          });

          const config = ConfigManager.getConfig();
          window.Sentry.setTag("tenant_id", config.tenantId);
          window.Sentry.setTag("agent_id", config.agentId);
        }
      } catch (error) {
        console.error("Failed to initialize Sentry:", error);
      }
    },
  };

  // Style Manager Module
  const StyleManager = {
    getResponsiveSize(
      deviceType: "DESKTOP" | "TABLET",
      isCollapsed: boolean,
    ): DefaultSizes | CollapsedSizes {
      const sizes = ConfigManager.constants.RESPONSIVE_SIZES[deviceType];
      return isCollapsed ? sizes.COLLAPSED : sizes.DEFAULT;
    },
    adjustResponsiveStyles(
      container: HTMLElement,
      isAgentOpen: boolean,
      hideBottomBar: boolean,
      showBanner: boolean,
      entryPointAlignment: EntryPointAlignmentType,
      hasFirstUserMessageBeenSent: boolean,
    ): void {
      const deviceType = DeviceManager.getDeviceType();
      const sizes = StyleManager.getResponsiveSize(deviceType, !isAgentOpen);

      let width: string, height: string;

      const isSidewiseEntryPoint = entryPointAlignment !== "center";
      if (!isAgentOpen) {
        if (hideBottomBar) {
          width = "0";
          height = "0";
        } else {
          width = hasFirstUserMessageBeenSent
            ? isSidewiseEntryPoint
              ? (sizes as CollapsedSizes).SIDEWISE_WIDTH_MESSAGE_SENT
              : (sizes as CollapsedSizes).CENTER_WIDTH_MESSAGE_SENT
            : isSidewiseEntryPoint
              ? (sizes as CollapsedSizes).SIDEWISE_WIDTH_INITIAL
              : (sizes as CollapsedSizes).CENTER_WIDTH_INITIAL;

          height = showBanner
            ? isSidewiseEntryPoint
              ? (sizes as CollapsedSizes).SIDEWISE_HEIGHT_WITH_BUBBLE
              : (sizes as CollapsedSizes).CENTER_HEIGHT_WITH_BUBBLE
            : hasFirstUserMessageBeenSent
              ? isSidewiseEntryPoint
                ? (sizes as CollapsedSizes).SIDEWISE_HEIGHT_MESSAGE_SENT
                : (sizes as CollapsedSizes).CENTER_HEIGHT_MESSAGE_SENT
              : isSidewiseEntryPoint
                ? (sizes as CollapsedSizes).SIDEWISE_HEIGHT
                : (sizes as CollapsedSizes).CENTER_HEIGHT;
        }
      } else {
        width = (sizes as DefaultSizes).WIDTH;
        height = (sizes as DefaultSizes).HEIGHT;
      }

      const styles: Partial<CSSStyleDeclaration> = {
        width,
        height,
        transition: "width 0.3s ease, height 0.3s ease",
        maxWidth: "100vw",
        maxHeight: "100vh",
      };

      Object.assign(styles, {
        bottom: "-10px",
        left: StyleManager.ENTRY_POINT_LEFT_MAP[entryPointAlignment] ?? "50%",
        right:
          StyleManager.ENTRY_POINT_RIGHT_MAP[entryPointAlignment] ?? "auto",
        transform:
          StyleManager.ENTRY_POINT_TRANSFORM_MAP[entryPointAlignment] ??
          "translateX(-50%)",
        borderRadius: "12px",
      });

      Object.assign(container.style, styles);
    },
    ENTRY_POINT_LEFT_MAP: {
      left: "0",
      right: "auto",
      center: "50%",
    } as const,
    ENTRY_POINT_RIGHT_MAP: {
      left: "auto",
      right: "0",
      center: "auto",
    } as const,
    ENTRY_POINT_TRANSFORM_MAP: {
      left: "none",
      right: "none",
      center: "translateX(-50%)",
    } as const,
  };

  // External Button Manager Module
  const ExternalButtonManager = {
    handleExternalButtons(): void {
      const buttons = document.querySelectorAll<HTMLElement>(
        ".notify-breakout-button",
      );
      if (buttons.length > 0) {
        this.waitForIframe();
      }
    },

    waitForIframe(retryCount = 0): void {
      const iframe = document.getElementById(
        "breakout-agent",
      ) as HTMLIFrameElement | null;
      if (iframe) {
        this.attachButtonListeners(
          document.querySelectorAll<HTMLElement>(".notify-breakout-button"),
          iframe,
        );
      } else if (retryCount < 5) {
        const delay = Math.pow(2, retryCount) * 100;
        setTimeout(() => this.waitForIframe(retryCount + 1), delay);
      } else {
        console.error("Breakout: Iframe not found after maximum retries.");
      }
    },

    attachButtonListeners(
      buttons: NodeListOf<HTMLElement>,
      iframe: HTMLIFrameElement,
    ): void {
      buttons.forEach((button) => {
        button.addEventListener("click", () => {
          MessageManager.sendMessage(iframe, {
            type: "open-breakout-button",
            data: {
              buttonId: button.id,
              message: `Button ${button.id} was clicked!`,
            },
          });
        });
      });
    },
  };

  // Overlay Manager Module
  const OverlayManager = {
    create(): OverlayManager {
      const overlay = document.createElement("div");
      overlay.id = "chat-widget-overlay";
      Object.assign(overlay.style, {
        position: "fixed",
        top: "0",
        left: "0",
        right: "0",
        bottom: "0",
        zIndex: "999999",
        display: "none",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        transition: "opacity 0.3s ease",
        pointerEvents: "auto",
      });

      const wrapper = document.createElement("div");
      Object.assign(wrapper.style, {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "90%",
        maxWidth: "1200px",
        height: "80vh",
        backgroundColor: "#fff",
        borderRadius: "24px",
        overflow: "hidden",
        pointerEvents: "auto",
        zIndex: "1000000",
      });

      overlay.appendChild(wrapper);
      document.body.appendChild(overlay);

      return {
        overlay,
        wrapper,
        show: () => {
          overlay.style.display = "block";
        },
        hide: () => {
          overlay.style.display = "none";
        },
      };
    },
  };

  // Agent Iframe Manager Module
  const AgentIframeManager = {
    create(container: HTMLElement, iframeSrc: string): HTMLIFrameElement {
      const iframe = document.createElement("iframe");
      Object.assign(iframe.style, {
        width: "100%",
        height: "100%",
        border: "none",
        borderRadius: "36px",
      });
      iframe.allow = "geolocation *; microphone *; camera *";
      iframe.id = "breakout-agent";
      iframe.src = iframeSrc;

      let iframeLoaded = false;

      iframe.onload = () => {
        iframeLoaded = true;
        console.log("Agent loaded successfully");
      };

      container.appendChild(iframe);
      setTimeout(() => this.checkIframeStatus(iframeLoaded, iframe), 3000);

      return iframe;
    },

    checkIframeStatus(iframeLoaded: boolean, iframe: HTMLIFrameElement): void {
      // TODO: Why returning false alarm for Satwik's system @KK
      if (!iframeLoaded && (!iframe.contentWindow || !iframe.contentDocument)) {
        console.warn("Breakout Agent is blocked by browser security settings");
      }
    },
  };

  // Bottom bar container Manager Module
  const BottomBarContainerManager = {
    createContainer(): HTMLDivElement {
      // Check if container already exists
      const existingContainer = document.getElementById(
        "chat-widget-container",
      );
      if (existingContainer) {
        return existingContainer as HTMLDivElement;
      }

      const container = document.createElement("div");
      container.id = "chat-widget-container";

      const deviceType = DeviceManager.getDeviceType();
      const sizes = StyleManager.getResponsiveSize(deviceType, true);

      Object.assign(container.style, {
        position: "fixed",
        bottom: "10px",
        transform: "translateX(-50%)",
        left: "50%",
        zIndex: ConfigManager.getConfig().containerId ? "1" : "99999",
        width: (sizes as CollapsedSizes).CENTER_WIDTH_MESSAGE_SENT,
        pointerEvents: "auto",
        display: ConfigManager.getConfig().containerId ? "none" : "block",
      });
      document.body.appendChild(container);
      return container;
    },
  };

  // Add new IframeURLManager module
  const IframeURLManager = {
    getIframeSrc(config: Config): string {
      // const AGENT_BASE_URL = "http://localhost:5173";
      const AGENT_BASE_URL = config.isStaging
        ? "https://agent-stg.getbreakout.ai"
        : "https://agent.getbreakout.ai";

      const params = new URLSearchParams();

      const baseUrl = config.feedbackEnabled
        ? `${AGENT_BASE_URL}/demo`
        : AGENT_BASE_URL;

      if (config.containerId) {
        params.append("container_id", config.containerId);
      }

      if (config.userEmail) {
        params.append("email", config.userEmail);
      }

      if (config.feedbackEnabled) {
        params.append("is_test", "true");
        params.append("test_type", "manual");
      }

      return `${baseUrl}/org/${config.tenantId}/agent/${config.agentId}?${params.toString()}`;
    },
  };

  // Add new EmbeddedContainerManager module
  const EmbeddedContainerManager = {
    createContainer(
      targetId: string,
      iframeSrc: string,
    ): {
      container: HTMLElement | null;
      iframe?: HTMLIFrameElement;
    } {
      const targetContainer = document.getElementById(targetId);
      if (!targetContainer) return { container: null };

      // Check if embedded container already exists
      const existingEmbedded = document.getElementById("chat-widget-embedded");
      if (existingEmbedded) {
        return { container: existingEmbedded };
      }

      const container = document.createElement("div");
      container.id = "chat-widget-embedded";
      Object.assign(container.style, {
        position: "relative",
        width: "100%",
        height: "100%",
        zIndex: "99999",
        pointerEvents: "auto",
        overflow: "hidden",
        contain: "strict",
        isolation: "isolate",
      });

      targetContainer.appendChild(container);
      const iframe = AgentIframeManager.create(container, iframeSrc);

      // Send initial config for embedded mode
      MessageManager.sendMessage(iframe, {
        isCollapsible: false, // Set false for embedded mode
      });

      return { container, iframe };
    },
  };

  // Time Manager Module - time-based visibility control for the chat widget
  const TimeManager = {
    isWithinTimeRange(
      startTime: string | null,
      endTime: string | null,
      timezone: string = "UTC",
    ): boolean {
      if (!startTime && !endTime) return true; // If times not set, always show

      // Use default values if only one time is specified
      const effectiveStartTime = startTime || "00:00";
      const effectiveEndTime = endTime || "24:00";

      // Get current time in the specified timezone
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: timezone,
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      };

      const currentTimeStr = now.toLocaleTimeString("en-US", options);
      const [currentHour, currentMinute] = currentTimeStr
        .split(":")
        .map(Number);

      // Parse start and end times
      const [startHour, startMinute] = effectiveStartTime
        .split(":")
        .map(Number);
      const [endHour, endMinute] = effectiveEndTime.split(":").map(Number);

      // Convert all times to minutes since midnight for easier comparison
      const currentMinutes = currentHour * 60 + currentMinute;
      const startMinutes = startHour * 60 + startMinute;
      const endMinutes = endHour * 60 + endMinute;

      let isWithinRange;
      if (endMinutes < startMinutes) {
        // Time range spans across midnight
        isWithinRange =
          currentMinutes >= startMinutes || currentMinutes <= endMinutes;
      } else {
        // Normal time range within same day
        isWithinRange =
          currentMinutes >= startMinutes && currentMinutes <= endMinutes;
      }

      // For testing purposes, log the times
      // console.log("Time Check:", {
      //   currentTime: currentTimeStr,
      //   startTime: `${startHour}:${startMinute}`,
      //   endTime: `${endHour}:${endMinute}`,
      //   isWithinRange,
      // });

      return isWithinRange;
    },
  };

  // Widget initialization function
  const initializeWidget = async (): Promise<void> => {
    const config = ConfigManager.getConfig();
    const IFRAME_SRC = IframeURLManager.getIframeSrc(config);
    const postMessage = MessageManager.sendMessage;

    let isAgentOpen = false;
    let iFrameSource: MessageEventSource | null = null;
    let showBanner = false;
    let entryPointAlignment: EntryPointAlignmentType | null = null; // default value
    let hasFirstUserMessageBeenSent = false;
    let currentContainer: HTMLElement | null = null;
    let embeddedContainer: HTMLElement | null = null;
    let bottomContainer: HTMLElement | null = null;
    let initialMessageSent: boolean = false;

    try {
      const url = URLManager.getCurrentUrl();
      let iframe: HTMLIFrameElement;
      let overlay: OverlayManager | null = null;

      // Create embedded container if containerId is provided
      if (config.containerId) {
        const { container, iframe: embeddedIframe } =
          EmbeddedContainerManager.createContainer(
            config.containerId,
            IFRAME_SRC,
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
        bottomContainer = BottomBarContainerManager.createContainer();
        if (!currentContainer) {
          iframe = AgentIframeManager.create(bottomContainer, IFRAME_SRC);
          currentContainer = bottomContainer;
        }
      }

      // Create overlay for form submissions
      overlay = OverlayManager.create();

      // Message event listener
      window.addEventListener(
        "message",
        (event: MessageEvent<IframeMessage>) => {
          try {
            if (event.origin.split(".")?.[1] !== IFRAME_SRC?.split(".")?.[1])
              return;

            // Add handler for IFRAME_READY
            if (event.data.type === "IFRAME_READY") {
              console.log("Iframe is ready to receive messages");
              // Store iframe source for later use
              iFrameSource = event.source;

              if (iFrameSource && "postMessage" in iFrameSource) {
                const utmParams = URLManager.getUtmParameters();
                const http_referrer = document.referrer;

                // Send initial config
                iFrameSource.postMessage(
                  {
                    type: "INIT",
                    payload: {
                      utmParams,
                      http_referrer,
                      url,
                      hideBottomBar: config.hideBottomBar,
                      // Check if we're in overlay mode
                      isCollapsible:
                        currentContainer === overlay?.wrapper
                          ? true
                          : !config.containerId,
                      prospectId: localStorage.getItem(
                        "__breakout__prospectId",
                      ),
                    },
                  },
                  { targetOrigin: "*" },
                );
              }
            }

            if (event.data.type === "EMBED_READY") {
              iFrameSource = event.source;
              // Send initial message if configured
              if (
                iFrameSource &&
                "postMessage" in iFrameSource &&
                config.initialMessage &&
                !initialMessageSent &&
                !event.data.sessionId
              ) {
                iFrameSource.postMessage(
                  {
                    type: "PARENT_FORM_MESSAGE",
                    data: {
                      message: config.initialMessage,
                    },
                  },
                  { targetOrigin: "*" },
                );
                initialMessageSent = true;
              }

              const {
                prospectId,
                apiBaseUrl,
                config: agentConfig,
              } = event.data;

              if (window.__breakout__?.domDetectionInitialized) {
                return;
              }

              // save prospectId for use in tracking dom elements
              window.__breakout__ = {
                tenantId: ConfigManager.getConfig().tenantId as string,
                prospectId,
                apiBaseUrl,
                domDetectionInitialized: true,
              };

              const { tracking_config } = agentConfig;
              initDomDetectors(tracking_config);
            }

            if (event.data.type === "CHAT_INIT") {
              window.__breakout__ = {
                ...window.__breakout__,
                prospectId: event.data.prospectId,
              };
            }

            if (event.data?.chatOpen !== undefined) {
              isAgentOpen = event.data.chatOpen;
              showBanner = event.data.showBanner ?? false;
              entryPointAlignment =
                event.data.entryPointAlignment ?? EntryPointAlignment.CENTER;
              hasFirstUserMessageBeenSent =
                event.data.hasFirstUserMessageBeenSent ?? false;

              URLManager.updateParentUrlParam(
                "isAgentOpen",
                isAgentOpen.toString(),
              );

              if (currentContainer === bottomContainer && bottomContainer) {
                StyleManager.adjustResponsiveStyles(
                  bottomContainer,
                  isAgentOpen,
                  config.hideBottomBar,
                  showBanner,
                  entryPointAlignment,
                  hasFirstUserMessageBeenSent,
                );

                // Send updated state back to iframe
                postMessage(iframe, {
                  chatOpen: isAgentOpen,
                  showBanner,
                  hasFirstUserMessageBeenSent,
                  // Only set isCollapsible based on container if not in overlay
                  isCollapsible:
                    currentContainer === overlay?.wrapper
                      ? true
                      : !config.containerId,
                });
              }
            }
          } catch (err) {
            console.error("Error handling message event:", err);
            if (err instanceof Error) {
              window.Sentry?.captureException(err, {
                tags: {
                  tenant_id: ConfigManager.getConfig().tenantId,
                  agent_id: ConfigManager.getConfig().agentId,
                  error_type: "message_event_error",
                },
                extra: {
                  event: "message_event",
                  url: window.location.href,
                },
              });
            }
          }
        },
      );

      window.addEventListener("resize", () => {
        if (currentContainer === bottomContainer && bottomContainer) {
          StyleManager.adjustResponsiveStyles(
            bottomContainer,
            isAgentOpen,
            config.hideBottomBar,
            showBanner,
            entryPointAlignment ?? EntryPointAlignment.CENTER,
            hasFirstUserMessageBeenSent,
          );
        }
      });

      // Add overlay close handling
      if (overlay) {
        const handleOverlayClose = () => {
          if (iframe) {
            overlay.wrapper.removeChild(iframe);
            if (config.containerId && embeddedContainer) {
              embeddedContainer.appendChild(iframe);
              currentContainer = embeddedContainer;
              // Reset isCollapsible when moving back to embedded mode
              postMessage(iframe, {
                isCollapsible: false,
                type: "MODE_CHANGE",
              });
            } else if (bottomContainer) {
              bottomContainer.appendChild(iframe);
              currentContainer = bottomContainer;
              // Reset isCollapsible when moving back to bottom bar mode
              postMessage(iframe, {
                isCollapsible: true,
                type: "MODE_CHANGE",
              });
            }
          }
          overlay.hide();
        };

        overlay.overlay.addEventListener("click", (e) => {
          if (e.target === overlay.overlay) {
            handleOverlayClose();
          }
        });

        // Listen for close events from iframe
        window.addEventListener("message", (event: MessageEvent) => {
          if (event.data.type === "CLOSE_OVERLAY") {
            handleOverlayClose();
          }
        });
      }

      // Modify the form submit handler
      window.addEventListener("submit", (e) => {
        const form = e.target as HTMLFormElement;
        if (!form.hasAttribute("data-breakout-form")) {
          return;
        }
        e.preventDefault();

        const input = form.querySelector(
          'input[type="text"]',
        ) as HTMLInputElement;
        const message = input.value.trim();

        if (overlay && iframe) {
          // Show the overlay
          overlay.show();

          // Safely move iframe to overlay wrapper
          try {
            // Check if iframe is actually in the current container
            if (iframe.parentNode === currentContainer) {
              currentContainer?.removeChild(iframe);
            } else if (iframe.parentNode) {
              // If iframe is somewhere else, remove it from there
              iframe.parentNode.removeChild(iframe);
            }

            // Update current container before appending
            currentContainer = overlay.wrapper;
            // Append to overlay wrapper
            overlay.wrapper.appendChild(iframe);

            // Immediately send isCollapsible true for overlay mode
            postMessage(iframe, {
              isCollapsible: true,
              type: "MODE_CHANGE",
            });

            // Wait for iframe to be ready in new container
            const messageHandler = (event: MessageEvent) => {
              if (event.data.type === "EMBED_READY") {
                // Send the message once iframe is ready
                postMessage(iframe, {
                  type: "PARENT_FORM_MESSAGE",
                  data: {
                    message: message,
                  },
                  isCollapsible: true, // Always true in overlay mode
                  prospectId: localStorage.getItem("__breakout__prospectId"),
                });
                window.removeEventListener("message", messageHandler);
              }
            };

            window.addEventListener("message", messageHandler);
          } catch (error) {
            console.error("Error moving iframe:", error);
            // If moving fails, try to recover by creating a new iframe
            if (iframe.parentNode !== overlay.wrapper) {
              currentContainer = overlay.wrapper;
              overlay.wrapper.appendChild(iframe);
              // Still try to set isCollapsible in error case
              postMessage(iframe, {
                type: "MODE_CHANGE",
                isCollapsible: true,
              });
            }
          }
        }

        input.value = "";
      });
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
      const config = ConfigManager.getConfig();
      const { tenantId, agentId, startTime, endTime } = config;

      if (!tenantId || !agentId || DeviceManager.isMobile()) {
        return;
      }

      // Check if current time is within allowed range
      if (!TimeManager.isWithinTimeRange(startTime, endTime)) {
        return;
      }

      // Initialize Sentry in the background without awaiting
      SentryManager.init();

      if (config.allowExternalButtons) {
        ExternalButtonManager.handleExternalButtons();
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
