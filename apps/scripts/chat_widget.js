/**
 Create a minified version of script below using https://try.terser.org/
 Upload the minified version to S3
 Invalidate cloudfront cache
*/
// Main function
(function () {
  const DEFAULT_WIDTH = "90vw";
  const DEFAULT_HEIGHT = "90vh";
  const COLLAPSED_SIZE_WIDTH = "90vw";
  const COLLAPSED_SIZE_HEIGHT_PX = 90;
  const COLLAPSED_SIZE_WITH_TOOLTIP_WIDTH_PX = 1400;
  const COLLAPSED_SIZE_WITH_TOOLTIP_HEIGHT_PX = 340;

  /**
   * Creates and styles the container for the chat widget.
   * @returns {HTMLElement} The container element.
   */
  const createContainer = () => {
    const container = document.createElement("div");
    container.id = "chat-widget-container";
    Object.assign(container.style, {
      position: "fixed",
      bottom: "20px", // Position 20px from the bottom
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
   * @param {boolean} isChatOpen - Whether the chat is open.
   * @param {boolean} isTooltipOpen - Whether the tooltip is open.
   */
  const adjustResponsiveStyles = (container, isChatOpen, isTooltipOpen) => {
    let width, height;

    if (!isChatOpen && isTooltipOpen) {
      width = COLLAPSED_SIZE_WITH_TOOLTIP_WIDTH_PX;
      height = COLLAPSED_SIZE_WITH_TOOLTIP_HEIGHT_PX;
    } else if (!isChatOpen) {
      // Default desktop view with chat closed
      width = COLLAPSED_SIZE_WIDTH;
      height = `${COLLAPSED_SIZE_HEIGHT_PX}px`;
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
    ];

    return utmParams.reduce((params, key) => {
      params[key] = getQueryParameter(key);
      return params;
    }, {});
  };

  /**
   * Checks if a chat session exists in local storage.
   * @returns {boolean} True if a chat session exists, false otherwise.
   */
  const checkSessionExists = () => {
    try {
      return JSON.parse(localStorage.getItem("chatSession")) !== null;
    } catch (error) {
      return false;
    }
  };

  const isMobile = () => {
    return (
      Math.min(window.screen.width, window.screen.height) < 768 ||
      navigator.userAgent.indexOf("Mobi") > -1
    );
  };

  const handleExternalBreakoutButton = () => {
    const buttons = document.querySelectorAll(".notifyBreakoutButton"); // Use this shared class for all buttons

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

  const shouldShowBottomBar =
    document.currentScript?.getAttribute("show-bottom-bar");

  if (!tenantId || !agentId || isMobile()) {
    return;
  }

  // Set the script URL based on the environment
  const IFRAME_SRC = `https://agent.getbreakout.ai/org/${tenantId}/agent/${agentId}?config=multimedia`;

  let isChatOpen = false;
  let isTooltipOpen = checkSessionExists();
  let iFrameSource = null;

  // Main execution
  const container = createContainer();
  createIframe(container, IFRAME_SRC);
  adjustResponsiveStyles(container, isChatOpen, isTooltipOpen);

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
        shouldShowBottomBar,
      },
      "*",
    );

    if (
      event.data &&
      typeof event.data.chatOpen === "boolean" &&
      typeof event.data.tooltipOpen === "boolean"
    ) {
      isChatOpen = event.data.chatOpen;
      isTooltipOpen = event.data.tooltipOpen;
      adjustResponsiveStyles(container, isChatOpen, isTooltipOpen);
    }
  });

  // Event listener for window resize
  window.addEventListener("resize", () => {
    adjustResponsiveStyles(container, isChatOpen, isTooltipOpen);
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
