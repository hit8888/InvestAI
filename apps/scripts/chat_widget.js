/**
 Create a minified version of script below using https://try.terser.org/
 Upload the minified version to S3
 Invalidate cloudfront cache
*/
// Main function
(function () {
  const DEFAULT_WIDTH = "95vw";
  const DEFAULT_HEIGHT = "90vh";
  const COLLAPSED_SIZE_WIDTH = "95vw";
  const COLLAPSED_SIZE_HEIGHT_PX = 180;

  /**
   * Creates and styles the container for the chat widget.
   * @returns {HTMLElement} The container element.
   */
  const createContainer = () => {
    const container = document.createElement("div");
    container.id = "chat-widget-container";
    Object.assign(container.style, {
      position: "fixed",
      bottom: "10px", // Position 20px from the bottom
      left: "50%", // Center horizontally
      zIndex: "10000",
      width: DEFAULT_WIDTH,
      height: DEFAULT_HEIGHT,
      maxHeight: "100%",
      transform: "translateX(-50%)",
    });
    document.body.appendChild(container);
    return container;
  };

  /**
   * Creates the iframe for the chat widget.
   * @param {HTMLElement} container - The container element to append the iframe to.
   * @param {string} IFRAME_SRC - The source URL for the iframe.
   */
  const createIframe = (container, IFRAME_SRC) => {
    const iframe = document.createElement("iframe");
    Object.assign(iframe.style, {
      width: "100%",
      height: "100%",
      border: "none",
    });
    iframe.allow = "geolocation *";
    iframe.src = IFRAME_SRC;
    iframe.id = "breakout-agent";
    container.appendChild(iframe);
  };

  /**
   * Adjusts the responsive styles of the container.
   * @param {HTMLElement} container - The container element to adjust.
   * @param {boolean} isAgentOpen - Whether the chat is open.
   * @param {boolean} isTooltipOpen - Whether the tooltip is open.
   */
  const adjustResponsiveStyles = (container, isAgentOpen, hideBottomBar) => {
    let width, height;

    if (!isAgentOpen) {
      // Default desktop view with chat closed
      width = hideBottomBar ? 0 : COLLAPSED_SIZE_WIDTH;
      height = hideBottomBar ? 0 : `${COLLAPSED_SIZE_HEIGHT_PX}px`;
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
          `Iframe not found. Retrying in ${delay}ms (Attempt ${retryCount + 1})`,
        );

        setTimeout(() => waitForIframe(retryCount + 1), delay);
      } else {
        console.error("Iframe not found after maximum retries.");
      }
    };

    if (buttons.length > 0) {
      waitForIframe();
    } else {
      console.error("No breakout buttons found.");
    }
  };

  //   const parentUrl = document.currentScript.dataset.param1;
  const tenantId = document.currentScript?.getAttribute("tenant-id");
  const agentId = document.currentScript?.getAttribute("agent-id") || "1";
  const hideBottomBar =
    document.currentScript?.getAttribute("hide-bottom-bar") === "true";

  if (!tenantId || !agentId || isMobile()) {
    return;
  }

  // Set the script URL based on the environment
  const IFRAME_SRC = `https://agent.getbreakout.ai/org/${tenantId}/agent/${agentId}?config=multimedia`;
  let isAgentOpen = false;
  let iFrameSource = null;

  // Main execution
  const container = createContainer();
  createIframe(container, IFRAME_SRC);
  adjustResponsiveStyles(container, isAgentOpen, hideBottomBar);

  console.log("sets up the container and iframe");

  const url =
    window.location != window.parent.location
      ? document.referrer
      : document.location.href;

  // Event listener for messages from the iframe
  window.addEventListener("message", (event) => {
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
      adjustResponsiveStyles(container, isAgentOpen, hideBottomBar);
    }
  });

  // Event listener for window resize
  window.addEventListener("resize", () => {
    adjustResponsiveStyles(container, isAgentOpen, hideBottomBar);
  });

  // Event listener for External buttons
  const allowExternalButtons =
    document.currentScript?.getAttribute("allow-external-buttons") || false;
  if (allowExternalButtons === false) {
    return;
  }
  document.addEventListener("DOMContentLoaded", () => {
    handleExternalBreakoutButton();
  });
})();
