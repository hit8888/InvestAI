import { RETRY_CONFIG, WIDGET_IDS } from "../agent/lib/constants";

export function AgentIframeManager() {
  let iframe: HTMLIFrameElement | null = null;

  const create = (
    container: HTMLElement,
    iframeSrc: string,
    isMobile: boolean,
  ): HTMLIFrameElement => {
    iframe = document.createElement("iframe");
    Object.assign(iframe.style, {
      display: "block",
      width: "100%",
      height: "100%",
      border: "none",
      borderRadius: isMobile ? "0" : "24px",
    });
    iframe.allow = "geolocation *; microphone *; camera *; clipboard-write";
    iframe.setAttribute("allowfullscreen", "true");
    iframe.setAttribute("mozallowfullscreen", "mozallowfullscreen");
    iframe.setAttribute("webkitallowfullscreen", "webkitallowfullscreen");
    iframe.id = WIDGET_IDS.BREAKOUT_AGENT;
    iframe.src = iframeSrc;

    let iframeLoaded = false;

    iframe.onload = () => {
      iframeLoaded = true;
    };

    container.appendChild(iframe);
    setTimeout(
      () => iframe && checkIframeStatus(iframeLoaded, iframe),
      RETRY_CONFIG.IFRAME_CHECK_DELAY,
    );

    return iframe;
  };

  const checkIframeStatus = (
    iframeLoaded: boolean,
    iframe: HTMLIFrameElement,
  ): void => {
    // TODO: Why returning false alarm for Satwik's system @KK
    if (!iframeLoaded && (!iframe.contentWindow || !iframe.contentDocument)) {
      console.warn("Breakout Agent is blocked by browser security settings");
    }
  };

  const reload = () => {
    if (iframe) {
      const currentSrc = iframe.src;

      // Force reload by setting src again
      iframe.src = "";
      setTimeout(() => {
        if (iframe) {
          iframe.src = currentSrc;
        }
      }, 10);
    }
  };

  // Return public API
  return {
    create,
    checkIframeStatus,
    reload,
  };
}
