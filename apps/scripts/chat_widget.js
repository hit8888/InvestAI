/**
 Create a minified version of script below using https://try.terser.org/
 Upload the minified version to S3
 Invalidate cloudfront cache
*/
// Main function

(function () {
  // Capture script attributes immediately
  const scriptElement = document.currentScript;

  const DEFAULT_WIDTH = "100vw";
  const DEFAULT_HEIGHT = "88vh";
  const COLLAPSED_SIZE_WIDTH = "100vw";
  const COLLAPSED_SIZE_HEIGHT_WITH_BUBBLE_PX = 320;
  const COLLAPSED_SIZE_HEIGHT_PX = 120;

  const updateParentUrlParam = (key, value) => {
    const url = new URL(window.parent.location.href);
    if (value === null || value === "") {
      url.searchParams.delete(key);
    } else {
      url.searchParams.set(key, value);
    }
    window.parent.history.replaceState({}, "", url);
  };
  const config = {
    tenantId: scriptElement?.getAttribute("tenant-id"),
    agentId: scriptElement?.getAttribute("agent-id") || "1",
    hideBottomBar: scriptElement?.getAttribute("hide-bottom-bar") === "true",
    height: scriptElement?.getAttribute("max-height") || DEFAULT_HEIGHT,
    allowExternalButtons:
      scriptElement?.getAttribute("allow-external-buttons") || false,
  };

  const SENTRY_DSN =
    "https://abd92d53cb1a15b17a6c41f3750a5324@o4507977649750016.ingest.us.sentry.io/4507977650733056";

  // Add this function at the top, before initSentry
  const loadSentrySDK = () => {
    return new Promise((resolve, reject) => {
      // Check if Sentry is already loaded
      if (window.Sentry) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = "https://browser.sentry-cdn.com/7.69.0/bundle.min.js";
      script.crossOrigin = "anonymous";

      script.onload = () => resolve();
      script.onerror = () => {
        console.error("Failed to load Sentry SDK");
        reject();
      };

      document.head.appendChild(script);
    });
  };

  // Modify initSentry to handle SDK loading
  const initSentry = async () => {
    try {
      await loadSentrySDK();
      window.Sentry.init({
        dsn: SENTRY_DSN,
        tracesSampleRate: 0.1,
        beforeSend(event) {
          return event;
        },
      });

      window.Sentry.setTag("tenant_id", config.tenantId);
      window.Sentry.setTag("agent_id", config.agentId);
    } catch (error) {
      console.error("Failed to initialize Sentry:", error);
    }
  };

  /**
   * Creates and styles the container for the chat widget.
   * @returns {HTMLElement} The container element.
   */
  const createContainer = () => {
    try {
      const container = document.createElement("div");
      if (!container) {
        throw new Error("Failed to create div element");
      }

      container.id = "chat-widget-container";
      Object.assign(container.style, {
        position: "fixed",
        bottom: "10px",
        left: "50%",
        zIndex: "10000",
        width: DEFAULT_WIDTH,
        height: config.height,
        maxHeight: "100%",
        transform: "translateX(-50%)",
      });

      // Check if document.body exists
      if (!document.body) {
        throw new Error("Document body not available");
      }

      document.body.appendChild(container);
      return container;
    } catch (error) {
      console.error("Error in createContainer:", error);
      window.Sentry?.captureException(error, {
        tags: {
          tenant_id: config.tenantId,
          agent_id: config.agentId,
          component: "container_creation",
        },
      });
      return null;
    }
  };

  /**
   * Creates the iframe for the chat widget.
   * @param {HTMLElement} container - The container element to append the iframe to.
   * @param {string} IFRAME_SRC - The source URL for the iframe.
   */
  const createIframe = (container, IFRAME_SRC, retryCount = 0) => {
    const iframe = document.createElement("iframe");
    Object.assign(iframe.style, {
      width: "100%",
      height: "100%",
      border: "none",
    });
    iframe.allow = "geolocation *; microphone *; camera *";

    let iframeLoaded = false;

    // Simple check for iframe functionality
    const checkIframe = () => {
      if (!iframeLoaded && (!iframe.contentWindow || !iframe.contentDocument)) {
        console.warn("Chat widget is blocked by browser security settings");

        // Report to Sentry
        window.Sentry?.captureException(new Error("Chat widget blocked"), {
          tags: {
            tenant_id: config.tenantId,
            agent_id: config.agentId,
            error_type: "iframe_blocked",
          },
          extra: {
            url: window.location.href,
            userAgent: navigator.userAgent,
          },
        });

        handleIframeError(container, IFRAME_SRC, retryCount);
      }
    };

    iframe.onload = () => {
      iframeLoaded = true;
      console.log("Chat widget loaded successfully");
    };

    iframe.onerror = (event) => {
      console.error("Chat widget failed to load");

      // Report load error to Sentry
      window.Sentry?.captureException(new Error("Chat widget load failed"), {
        tags: {
          tenant_id: config.tenantId,
          agent_id: config.agentId,
          error_type: "iframe_load_error",
        },
        extra: {
          event: event,
          url: window.location.href,
        },
      });

      handleIframeError(container, IFRAME_SRC, retryCount);
    };

    iframe.id = "breakout-agent";
    iframe.src = IFRAME_SRC;
    container.appendChild(iframe);

    // Check after a reasonable delay
    setTimeout(checkIframe, 3000);
  };

  const handleIframeError = (container, IFRAME_SRC, retryCount) => {
    const maxRetries = 3;

    if (retryCount < maxRetries) {
      console.warn(
        `Loading failed. Retrying... (${retryCount + 1}/${maxRetries})`,
      );
      setTimeout(
        () => {
          container.innerHTML = "";
          createIframe(container, IFRAME_SRC, retryCount + 1);
        },
        Math.pow(2, retryCount) * 1000,
      );
    } else {
      console.error("Failed to load chat widget");

      // Report final failure to Sentry
      window.Sentry?.captureException(
        new Error("Chat widget failed after max retries"),
        {
          tags: {
            tenant_id: config.tenantId,
            agent_id: config.agentId,
            error_type: "max_retries_reached",
          },
          extra: {
            retryCount,
            maxRetries,
            url: window.location.href,
          },
        },
      );

      container.style.display = "none";
    }
  };

  /**
   * Adjusts the responsive styles of the container.
   * @param {HTMLElement} container - The container element to adjust.
   * @param {boolean} isAgentOpen - Whether the chat is open.
   * @param {boolean} isTooltipOpen - Whether the tooltip is open.
   */
  const adjustResponsiveStyles = (
    container,
    isAgentOpen,
    hideBottomBar,
    showBanner,
  ) => {
    let width, height;

    if (!isAgentOpen) {
      // Default desktop view with chat closed
      width = hideBottomBar ? 0 : COLLAPSED_SIZE_WIDTH;
      height = hideBottomBar
        ? 0
        : showBanner
          ? `${COLLAPSED_SIZE_HEIGHT_WITH_BUBBLE_PX}px`
          : `${COLLAPSED_SIZE_HEIGHT_PX}px`;
    } else {
      // Default full desktop size
      width = DEFAULT_WIDTH;
      height = DEFAULT_HEIGHT;
    }

    Object.assign(container.style, {
      width: width,
      height: height,
    });
  };

  /**
   * Gets a query parameter by name.
   * @param {string} name - The name of the query parameter to get.
   * @returns {string} The value of the query parameter.
   */
  const getQueryParameter = (name) =>
    new URLSearchParams(window.location.search).get(name);

  /**
   * Extracts UTM parameters from the current URL query string.
   * @returns {Object} An object containing UTM parameters.
   */
  const getUtmParameters = () => {
    const utmParams = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
      "isAgentOpen",
      "source",
      "is_test",
      "test_type",
    ];

    return utmParams.reduce((params, key) => {
      params[key] = getQueryParameter(key);
      return params;
    }, {});
  };

  const isMobile = () => {
    return (
      Math.min(window.screen.width, window.screen.height) < 768 ||
      navigator.userAgent.indexOf("Mobi") > -1
    );
  };

  const handleExternalBreakoutButton = () => {
    const buttons = document.querySelectorAll(".notify-breakout-button"); // Use this shared class for all buttons

    const waitForIframe = (retryCount = 0) => {
      const iframe = document.getElementById("breakout-agent");
      if (iframe) {
        buttons.forEach((button) => {
          button.addEventListener("click", () => {
            const payload = {
              type: "open-breakout-button",
              data: {
                buttonId: button.id,
                message: `Button ${button.id} was clicked!`,
              },
            };

            iframe.contentWindow.postMessage(payload, "*");
          });
        });
      } else if (retryCount < 5) {
        const delay = Math.pow(2, retryCount) * 100;
        console.warn(
          `Breakout: Iframe not found. Retrying in ${delay}ms (Attempt ${retryCount + 1})`,
        );

        setTimeout(() => waitForIframe(retryCount + 1), delay);
      } else {
        console.error("Breakout: Iframe not found after maximum retries.");
      }
    };

    if (buttons.length > 0) {
      waitForIframe();
    } else {
      console.error("Breakout: No breakout buttons found.");
    }
  };

  const hideBottomBar =
    document.currentScript?.getAttribute("hide-bottom-bar") === "true";

  // Add a function to initialize the widget
  const initializeWidget = async () => {
    if (!config.tenantId || !config.agentId || isMobile()) {
      return;
    }

    const IFRAME_SRC = `https://agent.getbreakout.ai/org/${config.tenantId}/agent/${config.agentId}?`;
    let isAgentOpen = false;
    let iFrameSource = null;
    let showBanner = false;

    try {
      // Main execution with error handling
      const container = createContainer();
      if (!container) {
        console.error("Breakout: Failed to create container");
        return;
      }

      createIframe(container, IFRAME_SRC, 0);
      adjustResponsiveStyles(
        container,
        isAgentOpen,
        config.hideBottomBar,
        showBanner,
      );

      console.log("Breakout: sets up the container and iframe");

      const url =
        window.location != window.parent.location
          ? document.referrer
          : document.location.href;

      // Event listener for messages from the iframe
      window.addEventListener("message", (event) => {
        try {
          // Check if the message is from the same domain
          if (event.origin.split(".")?.[1] !== IFRAME_SRC?.split(".")?.[1]) {
            return;
          }

          const utmParams = getUtmParameters();
          const http_referrer = document.referrer;
          iFrameSource = event.source;
          iFrameSource?.postMessage(
            {
              utmParams,
              http_referrer,
              url,
              hideBottomBar,
            },
            "*",
          );

          if (event.data && typeof event.data.chatOpen === "boolean") {
            isAgentOpen = event.data.chatOpen;
            showBanner = event.data.showBanner;
            if (!isAgentOpen && utmParams?.isAgentOpen === "true") {
              updateParentUrlParam("isAgentOpen", "false");
            }
            adjustResponsiveStyles(
              container,
              isAgentOpen,
              config.hideBottomBar,
              showBanner,
            );
          }
        } catch (error) {
          console.error("Breakout: Error handling message event:", error);
          window.Sentry?.captureException(error, {
            tags: {
              tenant_id: config.tenantId,
              agent_id: config.agentId,
              component: "message_handling",
            },
            extra: {
              eventOrigin: event.origin,
              iframeSrc: IFRAME_SRC,
              eventData: JSON.stringify(event.data),
            },
          });
        }
      });

      // Event listener for window resize
      window.addEventListener("resize", () => {
        adjustResponsiveStyles(
          container,
          isAgentOpen,
          config.hideBottomBar,
          showBanner,
        );
      });
    } catch (error) {
      console.error("Breakout: Error initializing widget:", error);
    }
  };

  // Wait for document to be ready
  const documentReady = () => {
    return new Promise((resolve) => {
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", resolve);
      } else {
        resolve();
      }
    });
  };

  // Update the documentReady flow to not block on initSentry
  documentReady()
    .then(() => {
      if (config.allowExternalButtons !== false) {
        handleExternalBreakoutButton();
      }

      // Initialize Sentry in parallel, don't wait for it
      initSentry()
        .then(() => {
          console.log("Sentry initialized");
        })
        .catch((error) => {
          console.warn("Sentry initialization failed:", error);
          // Continue execution, Sentry is optional
        });
    })
    .catch((error) => {
      console.error("Breakout: Error during initialization:", error);
    })
    .finally(() => {
      // Always initialize widget
      initializeWidget();
    });
})();
