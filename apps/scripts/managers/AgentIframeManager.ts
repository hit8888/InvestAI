import { RETRY_CONFIG, WIDGET_IDS } from "../lib/constants";

export function AgentIframeManager() {
  let iframe: HTMLIFrameElement | null = null;

  const create = (
    container: HTMLElement,
    iframeSrc: string,
  ): HTMLIFrameElement => {
    iframe = document.createElement("iframe");
    Object.assign(iframe.style, {
      width: "100%",
      height: "100%",
      border: "none",
      borderRadius: "36px",
    });
    iframe.allow = "geolocation *; microphone *; camera *";
    iframe.id = WIDGET_IDS.BREAKOUT_AGENT;
    iframe.src = iframeSrc;

    let iframeLoaded = false;

    iframe.onload = () => {
      iframeLoaded = true;
      console.log("Agent loaded successfully");
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
