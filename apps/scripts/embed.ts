// Constants for default values
const DEFAULT_WIDTH_PX = 450;
const DEFAULT_HEIGHT_PX = 700;
const COLLAPSED_SIZE_WIDTH_PX = 200;
const COLLAPSED_SIZE_HEIGHT_PX = 80;
const DEFAULT_MOBILE_WIDTH_VH = 90;
const DEFAULT_MOBILE_HEIGHT_VH = 90;

/**
 * Creates and styles the container for the chat widget.
 * @returns {HTMLElement} The container element.
 */
const createContainer = (): HTMLElement => {
  const container = document.createElement("div");
  container.id = "chat-widget-container";
  Object.assign(container.style, {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    zIndex: "10000",
    width: `${COLLAPSED_SIZE_WIDTH_PX}px`,
    height: `${COLLAPSED_SIZE_HEIGHT_PX}px`,
    maxWidth: "100%",
    maxHeight: "100%",
  });
  document.body.appendChild(container);
  return container;
};

/**
 * Creates the iframe for the chat widget.
 * @param {HTMLElement} container - The container element to append the iframe to.
 * @param {string} IFRAME_SRC - The source URL for the iframe.
 */
const createIframe = (container: HTMLElement, IFRAME_SRC: string): void => {
  const iframe = document.createElement("iframe");
  Object.assign(iframe.style, {
    width: "100%",
    height: "100%",
    border: "none",
  });
  iframe.allow = "geolocation *";
  iframe.src = IFRAME_SRC;
  container.appendChild(iframe);
};

/**
 * Adjusts the responsive styles of the container.
 * @param {HTMLElement} container - The container element to adjust.
 * @param {boolean} isChatOpen - Whether the chat is open.
 */
const adjustResponsiveStyles = (
  container: HTMLElement,
  isChatOpen: boolean,
): void => {
  const isMobile =
    window.innerWidth < DEFAULT_WIDTH_PX ||
    window.innerHeight < DEFAULT_HEIGHT_PX;

  let width: number, height: number;

  if (isChatOpen && isMobile) {
    width = Math.min(
      window.innerWidth * (DEFAULT_MOBILE_WIDTH_VH / 100),
      DEFAULT_WIDTH_PX,
    );
    height = Math.min(
      window.innerHeight * (DEFAULT_MOBILE_HEIGHT_VH / 100),
      DEFAULT_HEIGHT_PX,
    );
  } else if (!isChatOpen) {
    width = COLLAPSED_SIZE_WIDTH_PX;
    height = COLLAPSED_SIZE_HEIGHT_PX;
  } else {
    width = DEFAULT_WIDTH_PX;
    height = DEFAULT_HEIGHT_PX;
  }

  Object.assign(container.style, {
    width: `${width}px`,
    height: `${height}px`,
  });
};

/**
 * Gets a query parameter by name.
 * @param {string} name - The name of the query parameter to get.
 * @returns {string | null} The value of the query parameter.
 */
const getQueryParameter = (name: string): string | null =>
  new URLSearchParams(window.location.search).get(name);

/**
 * Extracts UTM parameters from the current URL query string.
 * @returns {Record<string, string | null>} An object containing UTM parameters.
 */
const getUtmParameters = (): Record<string, string | null> => {
  const utmParams = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
  ];

  return utmParams.reduce(
    (params, key) => {
      params[key] = getQueryParameter(key);
      return params;
    },
    {} as Record<string, string | null>,
  );
};

// Main function
(async function () {
  //   const parentUrl = document.currentScript.dataset.param1;
  const tenantId = document.currentScript?.getAttribute("tenant-id");
  const agentId = document.currentScript?.getAttribute("agent-id");

  // Set the script URL based on the environment
  const IFRAME_SRC = `https://agent.getbreakout.ai/org/${tenantId}/agent/${agentId}?config=widget`;

  let isChatOpen = false;
  let iFrameSource: Window | MessageEventSource | null = null;

  // Main execution
  const container = createContainer();
  createIframe(container, IFRAME_SRC);

  const url =
    window.location !== window.parent.location
      ? document.referrer
      : document.location.href;

  // Event listener for messages from the iframe
  window.addEventListener("message", (event: MessageEvent) => {
    // Check if the message is from the same domain
    if (event.origin.split(".")?.[1] !== IFRAME_SRC?.split(".")?.[1]) {
      return;
    }

    const utmParams = getUtmParameters();
    const http_referrer = document.referrer;
    iFrameSource = event.source;
    (iFrameSource as Window)?.postMessage(
      {
        utmParams,
        http_referrer,
        url,
      },
      "*",
    );

    if (event.data && typeof event.data.chatOpen === "boolean") {
      isChatOpen = event.data.chatOpen;
      adjustResponsiveStyles(container, isChatOpen);
    }
  });

  // Event listener for window resize
  window.addEventListener("resize", () => {
    adjustResponsiveStyles(container, isChatOpen);
  });
})();
