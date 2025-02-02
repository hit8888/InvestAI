(function () {
  // Config Module
  const ConfigManager = {
    scriptElement: document.currentScript as HTMLScriptElement | null,
    constants: {
      DEFAULT_WIDTH: "100vw",
      DEFAULT_HEIGHT: "88vh",
      COLLAPSED_SIZE_WIDTH: "100vw",
      COLLAPSED_SIZE_HEIGHT_WITH_BUBBLE_PX: 240,
      COLLAPSED_SIZE_HEIGHT_PX: 120,
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
          this.constants.DEFAULT_HEIGHT,
        allowExternalButtons:
          this.scriptElement?.getAttribute("allow-external-buttons") === "true",
        containerId: this.scriptElement?.getAttribute("container-id") ?? null,
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
      return (
        Math.min(window.screen.width, window.screen.height) < 768 ||
        navigator.userAgent.indexOf("Mobi") > -1
      );
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
    adjustResponsiveStyles(
      container: HTMLElement,
      isAgentOpen: boolean,
      hideBottomBar: boolean,
      showBanner: boolean,
    ): void {
      const {
        DEFAULT_WIDTH,
        DEFAULT_HEIGHT,
        COLLAPSED_SIZE_WIDTH,
        COLLAPSED_SIZE_HEIGHT_WITH_BUBBLE_PX,
        COLLAPSED_SIZE_HEIGHT_PX,
      } = ConfigManager.constants;

      let width: string, height: string;
      if (!isAgentOpen) {
        width = hideBottomBar ? "0" : COLLAPSED_SIZE_WIDTH;
        height = hideBottomBar
          ? "0"
          : showBanner
            ? `${COLLAPSED_SIZE_HEIGHT_WITH_BUBBLE_PX}px`
            : `${COLLAPSED_SIZE_HEIGHT_PX}px`;
      } else {
        width = DEFAULT_WIDTH;
        height = DEFAULT_HEIGHT;
      }

      Object.assign(container.style, { width, height });
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
      });
      iframe.allow = "geolocation *; microphone *; camera *";
      iframe.id = "breakout-agent";
      iframe.src = iframeSrc;

      let iframeLoaded = false;

      iframe.onload = () => {
        iframeLoaded = true;
        console.log("Agent loaded successfully");
      };

      iframe.onerror = (event) => this.handleError(container, iframeSrc, event);

      container.appendChild(iframe);
      setTimeout(
        () =>
          this.checkIframeStatus(iframeLoaded, iframe, container, iframeSrc),
        3000,
      );

      return iframe;
    },

    handleError(
      container: HTMLElement,
      iframeSrc: string,
      event: Event | string,
      retryCount = 0,
    ): void {
      console.error("Chat widget failed to load");
      if ("Sentry" in window) {
        window.Sentry.captureException(new Error("Chat widget load failed"), {
          tags: {
            tenant_id: ConfigManager.getConfig().tenantId,
            agent_id: ConfigManager.getConfig().agentId,
            error_type: "iframe_load_error",
          },
          extra: {
            event: typeof event === "string" ? event : event.type,
            url: window.location.href,
          },
        });
      }
      this.retryLoading(container, iframeSrc, retryCount);
    },

    checkIframeStatus(
      iframeLoaded: boolean,
      iframe: HTMLIFrameElement,
      container: HTMLElement,
      iframeSrc: string,
      retryCount = 0,
    ): void {
      if (!iframeLoaded && (!iframe.contentWindow || !iframe.contentDocument)) {
        console.warn("Chat widget is blocked by browser security settings");
        this.retryLoading(container, iframeSrc, retryCount);
      }
    },

    retryLoading(
      container: HTMLElement,
      iframeSrc: string,
      retryCount: number,
    ): void {
      const maxRetries = 3;
      if (retryCount < maxRetries) {
        console.warn(
          `Loading failed. Retrying... (${retryCount + 1}/${maxRetries})`,
        );
        setTimeout(
          () => {
            container.innerHTML = "";
            this.create(container, iframeSrc);
          },
          Math.pow(2, retryCount) * 1000,
        );
      } else {
        this.handleMaxRetriesReached(container);
      }
    },

    handleMaxRetriesReached(container: HTMLElement): void {
      console.error("Failed to load chat widget");
      container.style.display = "none";
    },
  };

  // Bottom bar container Manager Module
  const BottomBarContainerManager = {
    createContainer(): HTMLDivElement {
      const container = document.createElement("div");
      container.id = "chat-widget-container";
      Object.assign(container.style, {
        position: "fixed",
        bottom: "10px",
        left: "50%",
        zIndex: ConfigManager.getConfig().containerId ? "1" : "99999",
        width: ConfigManager.constants.DEFAULT_WIDTH,
        height: ConfigManager.getConfig().height,
        maxHeight: "100%",
        transform: "translateX(-50%)",
        pointerEvents: "auto",
        display: ConfigManager.getConfig().containerId ? "none" : "block",
      });
      document.body.appendChild(container);
      return container;
    },
  };

  // Widget initialization function
  const initializeWidget = async (): Promise<void> => {
    const config = ConfigManager.getConfig();
    const IFRAME_SRC = `https://agent.getbreakout.ai/org/${config.tenantId}/agent/${config.agentId}?`;

    // const IFRAME_SRC = `http://localhost:5173/org/hackerearth/agent/2?config=multimedia&showGlass=true`;
    let isAgentOpen = false;
    let iFrameSource: MessageEventSource | null = null;
    let showBanner = false;
    let currentContainer: HTMLElement | null = null;
    let embeddedContainer: HTMLElement | null = null;
    let bottomContainer: HTMLElement | null = null;

    try {
      const url = URLManager.getCurrentUrl();
      let iframe: HTMLIFrameElement;
      let overlay: OverlayManager | null = null;

      // Create embedded container if containerId is provided
      if (config.containerId) {
        const targetContainer = document.getElementById(config.containerId);
        if (targetContainer) {
          embeddedContainer = document.createElement("div");
          embeddedContainer.id = "chat-widget-embedded";
          Object.assign(embeddedContainer.style, {
            position: "relative",
            width: "100%",
            height: "100%",
            zIndex: "99999",
            pointerEvents: "auto",
          });
          targetContainer.appendChild(embeddedContainer);
          iframe = AgentIframeManager.create(embeddedContainer, IFRAME_SRC);
          currentContainer = embeddedContainer;

          // Send initial config for embedded mode
          if (iframe.contentWindow) {
            iframe.contentWindow.postMessage(
              {
                isCollapsible: false, // Set false for embedded mode
              },
              { targetOrigin: "*" },
            );
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

              // Send initial config immediately after IFRAME_READY
              if (iFrameSource && "postMessage" in iFrameSource) {
                const utmParams = URLManager.getUtmParameters();
                const http_referrer = document.referrer;

                iFrameSource.postMessage(
                  {
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
                  { targetOrigin: "*" },
                );
              }
            }

            if (event.data?.chatOpen !== undefined) {
              isAgentOpen = event.data.chatOpen;
              showBanner = event.data.showBanner ?? false;

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
                );

                // Send updated state back to iframe
                if (iframe.contentWindow) {
                  iframe.contentWindow.postMessage(
                    {
                      chatOpen: isAgentOpen,
                      showBanner,
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
              if (event.data.type === "IFRAME_READY") {
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
