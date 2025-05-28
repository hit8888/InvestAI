import { RETRY_CONFIG, WIDGET_IDS } from "../lib/constants";

export function AgentIframeManager() {
  const create = (
    container: HTMLElement,
    iframeSrc: string,
  ): HTMLIFrameElement => {
    const iframe = document.createElement("iframe");
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
      () => checkIframeStatus(iframeLoaded, iframe),
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

  // Return public API
  return {
    create,
    checkIframeStatus,
  };
}
