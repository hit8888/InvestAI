import { WIDGET_IDS, Z_INDEX } from "../agent/lib/constants";

export function EmbeddedContainerManager(
  createIframe?: (
    container: HTMLElement,
    iframeSrc: string,
    isMobile: boolean,
  ) => HTMLIFrameElement,
  sendMessage?: (iframe: HTMLIFrameElement, message: object) => void,
) {
  const createContainer = (
    targetId: string,
    iframeSrc: string,
    isMobile: boolean,
  ): {
    container: HTMLElement | null;
    iframe?: HTMLIFrameElement;
  } => {
    const targetContainer = document.getElementById(targetId);
    if (!targetContainer) return { container: null };

    // Check if embedded container already exists
    const existingEmbedded = document.getElementById(WIDGET_IDS.CHAT_EMBEDDED);
    if (existingEmbedded) {
      return { container: existingEmbedded };
    }

    const container = document.createElement("div");
    container.id = WIDGET_IDS.CHAT_EMBEDDED;
    Object.assign(container.style, {
      position: "relative",
      width: "100%",
      height: "100%",
      zIndex: Z_INDEX.WIDGET_BOTTOM,
      pointerEvents: "auto",
      overflow: "hidden",
      contain: "strict",
      isolation: "isolate",
    });

    targetContainer.appendChild(container);

    if (createIframe) {
      const iframe = createIframe(container, iframeSrc, isMobile);

      // Send initial config for embedded mode
      if (sendMessage) {
        sendMessage(iframe, {
          isCollapsible: false, // Set false for embedded mode
        });
      }

      return { container, iframe };
    }

    return { container };
  };

  // Return public API
  return {
    createContainer,
  };
}
