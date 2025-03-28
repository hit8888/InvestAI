(function () {
  // Config Module
  const ConfigManager = {
    scriptElement: document.currentScript as HTMLScriptElement | null,
    constants: {
      RESPONSIVE_SIZES: {
        DESKTOP: {
          DEFAULT: {
            WIDTH: "max(420px, 100vw)",
            HEIGHT: "max(700px, 88vh)",
          },
          COLLAPSED: {
            WIDTH_INITIAL: "max(420px, 100vw)",
            WIDTH_MESSAGE_SENT: "min(430px, 30vw)",
            HEIGHT_WITH_BUBBLE: "min(280px, 40vh)",
            HEIGHT_MESSAGE_SENT: "max(100px, 10vh)",
            HEIGHT: "max(150px, 10vh)",
          },
        },
        TABLET: {
          DEFAULT: {
            WIDTH: "max(380px, 100vw)",
            HEIGHT: "max(600px, 88vh)",
          },
          COLLAPSED: {
            WIDTH_INITIAL: "max(380px, 100vw)",
            WIDTH_MESSAGE_SENT: "max(380px, 30vw)",
            HEIGHT_WITH_BUBBLE: "max(280px, 30vh)",
            HEIGHT_MESSAGE_SENT: "max(100px, 10vh)",
            HEIGHT: "max(140px, 10vh)",
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
      };
    },
  };

  // URL and Parameters Module
  const URLManager = {
    updateParentUrlParam(key: string, value: string | null): void {
      const url = new URL(window.parent.location.href);
      if (value === null || value === "") {
        url.searchParams.delete(key);
      } else {
        url.searchParams.set(key, value);
      }
      window.parent.history.replaceState({}, "", url);
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
      hasFirstUserMessageBeenSent: boolean,
    ): void {
      const deviceType = DeviceManager.getDeviceType();
      const sizes = StyleManager.getResponsiveSize(deviceType, !isAgentOpen);

      let width: string, height: string;

      if (!isAgentOpen) {
        if (hideBottomBar) {
          width = "0";
          height = "0";
        } else {
          width = hasFirstUserMessageBeenSent
            ? (sizes as CollapsedSizes).WIDTH_MESSAGE_SENT
            : (sizes as CollapsedSizes).WIDTH_INITIAL;

          height = showBanner
            ? (sizes as CollapsedSizes).HEIGHT_WITH_BUBBLE
            : hasFirstUserMessageBeenSent
              ? (sizes as CollapsedSizes).HEIGHT_MESSAGE_SENT
              : (sizes as DefaultSizes).HEIGHT;
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
        bottom: "10px",
        left: "50%",
        transform: "translateX(-50%)",
        borderRadius: "12px",
      });

      Object.assign(container.style, styles);
    },
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
          iframe.contentWindow?.postMessage(
            {
              type: "open-breakout-button",
              data: {
                buttonId: button.id,
                message: `Button ${button.id} was clicked!`,
              },
            },
            { targetOrigin: "*" },
          );
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
        width: (sizes as CollapsedSizes).WIDTH_INITIAL,
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
      if (iframe.contentWindow) {
        iframe.contentWindow.postMessage(
          {
            isCollapsible: false, // Set false for embedded mode
          },
          { targetOrigin: "*" },
        );
      }

      return { container, iframe };
    },
  };

  // Widget initialization function
  const initializeWidget = async (): Promise<void> => {
    const config = ConfigManager.getConfig();
    const IFRAME_SRC = IframeURLManager.getIframeSrc(config);

    let isAgentOpen = false;
    let iFrameSource: MessageEventSource | null = null;
    let showBanner = false;
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
            }

            if (event.data?.chatOpen !== undefined) {
              isAgentOpen = event.data.chatOpen;
              showBanner = event.data.showBanner ?? false;
              hasFirstUserMessageBeenSent =
                event.data.hasFirstUserMessageBeenSent ?? false;

              if (
                !isAgentOpen &&
                URLManager.getQueryParameter("isAgentOpen") === "true"
              ) {
                URLManager.updateParentUrlParam("isAgentOpen", "false");
              }

              if (currentContainer === bottomContainer && bottomContainer) {
                StyleManager.adjustResponsiveStyles(
                  bottomContainer,
                  isAgentOpen,
                  config.hideBottomBar,
                  showBanner,
                  hasFirstUserMessageBeenSent,
                );

                // Send updated state back to iframe
                if (iframe.contentWindow) {
                  iframe.contentWindow.postMessage(
                    {
                      chatOpen: isAgentOpen,
                      showBanner,
                      hasFirstUserMessageBeenSent,
                      // Only set isCollapsible based on container if not in overlay
                      isCollapsible:
                        currentContainer === overlay?.wrapper
                          ? true
                          : !config.containerId,
                    },
                    { targetOrigin: "*" },
                  );
                }
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
              iframe.contentWindow?.postMessage(
                {
                  isCollapsible: false,
                  type: "MODE_CHANGE",
                },
                { targetOrigin: "*" },
              );
            } else if (bottomContainer) {
              bottomContainer.appendChild(iframe);
              currentContainer = bottomContainer;
              // Reset isCollapsible when moving back to bottom bar mode
              iframe.contentWindow?.postMessage(
                {
                  isCollapsible: true,
                  type: "MODE_CHANGE",
                },
                { targetOrigin: "*" },
              );
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
            iframe.contentWindow?.postMessage(
              {
                type: "MODE_CHANGE",
                isCollapsible: true,
              },
              { targetOrigin: "*" },
            );

            // Wait for iframe to be ready in new container
            const messageHandler = (event: MessageEvent) => {
              if (event.data.type === "EMBED_READY") {
                // Send the message once iframe is ready
                iframe.contentWindow?.postMessage(
                  {
                    type: "PARENT_FORM_MESSAGE",
                    data: {
                      message: message,
                    },
                    isCollapsible: true, // Always true in overlay mode
                  },
                  { targetOrigin: "*" },
                );
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
              iframe.contentWindow?.postMessage(
                {
                  type: "MODE_CHANGE",
                  isCollapsible: true,
                },
                { targetOrigin: "*" },
              );
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

      if (!config.tenantId || !config.agentId || DeviceManager.isMobile()) {
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
