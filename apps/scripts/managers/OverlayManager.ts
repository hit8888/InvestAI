import { WIDGET_IDS, Z_INDEX } from "../lib/constants";

export function OverlayManager(
  postMessage: (iframe: HTMLIFrameElement, message: object) => void,
  containerId?: string | null,
) {
  let overlay: HTMLDivElement | null = null;
  let wrapper: HTMLDivElement | null = null;
  let iframe: HTMLIFrameElement | null = null;
  let currentContainer: HTMLElement | null = null;
  let embeddedContainer: HTMLElement | null = null;
  let bottomContainer: HTMLElement | null = null;
  let isInitialized = false;

  const createOverlayElements = (): void => {
    if (isInitialized) return;

    // Create overlay
    overlay = document.createElement("div");
    overlay.id = WIDGET_IDS.CHAT_OVERLAY;
    Object.assign(overlay.style, {
      position: "fixed",
      top: "0",
      left: "0",
      right: "0",
      bottom: "0",
      zIndex: Z_INDEX.OVERLAY,
      display: "none",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      transition: "opacity 0.3s ease",
      pointerEvents: "auto",
    });

    // Create wrapper
    wrapper = document.createElement("div");
    Object.assign(wrapper.style, {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "90%",
      maxWidth: "1600px",
      height: "90vh",
      backgroundColor: "#fff",
      borderRadius: "24px",
      overflow: "hidden",
      pointerEvents: "auto",
      zIndex: Z_INDEX.OVERLAY_WRAPPER,
    });

    overlay.appendChild(wrapper);
    document.body.appendChild(overlay);
    isInitialized = true;
  };

  const setupEventListeners = (): void => {
    if (!overlay) return;

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        handleClose();
      }
    });

    window.addEventListener("message", (event: MessageEvent) => {
      if (event.data.type === "CLOSE_OVERLAY") {
        handleClose();
      }
    });

    window.addEventListener("submit", handleFormSubmit);
  };

  const handleClose = (): void => {
    if (iframe && wrapper) {
      wrapper.removeChild(iframe);

      if (containerId && embeddedContainer) {
        embeddedContainer.appendChild(iframe);
        currentContainer = embeddedContainer;
        postMessage(iframe, {
          isCollapsible: false,
          type: "MODE_CHANGE",
        });
      } else if (bottomContainer) {
        bottomContainer.appendChild(iframe);
        currentContainer = bottomContainer;
        postMessage(iframe, {
          isCollapsible: true,
          type: "MODE_CHANGE",
        });
      }
    }
    hide();
  };

  const handleFormSubmit = (e: Event): void => {
    const form = e.target as HTMLFormElement;
    if (!form.hasAttribute("data-breakout-form")) {
      return;
    }
    e.preventDefault();

    const input = form.querySelector('input[type="text"]') as HTMLInputElement;
    const message = input.value.trim();

    if (iframe) {
      showWithIframe(form.id, message);
    }

    input.value = "";
  };

  const showWithIframe = (formId: string, message: string): void => {
    if (!iframe || !wrapper) return;

    show();

    try {
      if (iframe.parentNode === currentContainer) {
        currentContainer?.removeChild(iframe);
      } else if (iframe.parentNode) {
        iframe.parentNode.removeChild(iframe);
      }

      currentContainer = wrapper;
      wrapper.appendChild(iframe);

      postMessage(iframe, {
        isCollapsible: true,
        type: "MODE_CHANGE",
      });

      const messageHandler = (event: MessageEvent) => {
        if (event.data.type === "EMBED_READY") {
          postMessage(iframe!, {
            type: "PARENT_FORM_MESSAGE",
            data: { message, formId },
            isCollapsible: true,
            prospectId: localStorage.getItem("__breakout__prospectId"),
          });
          window.removeEventListener("message", messageHandler);
        }
      };

      window.addEventListener("message", messageHandler);
    } catch (error) {
      console.error("Error moving iframe:", error);
      if (iframe.parentNode !== wrapper) {
        currentContainer = wrapper;
        wrapper.appendChild(iframe);
        postMessage(iframe, {
          type: "MODE_CHANGE",
          isCollapsible: true,
        });
      }
    }
  };

  const initialize = (
    embeddedContainerParam: HTMLElement | null = null,
    bottomContainerParam: HTMLElement | null = null,
  ): void => {
    embeddedContainer = embeddedContainerParam;
    bottomContainer = bottomContainerParam;
    createOverlayElements();
    setupEventListeners();
  };

  const show = (): void => {
    if (!overlay) initialize();
    overlay!.style.display = "block";
  };

  const hide = (): void => {
    if (overlay) {
      overlay.style.display = "none";
    }
  };

  const setIframe = (
    newIframe: HTMLIFrameElement,
    container: HTMLElement,
  ): void => {
    iframe = newIframe;
    currentContainer = container;
  };

  const getWrapper = (): HTMLDivElement | null => wrapper;
  const getOverlay = (): HTMLDivElement | null => overlay;

  const destroy = (): void => {
    window.removeEventListener("message", handleClose);
    window.removeEventListener("submit", handleFormSubmit);

    if (overlay && overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
    }

    overlay = null;
    wrapper = null;
    iframe = null;
    currentContainer = null;
    isInitialized = false;
  };

  // Return public API (no automatic initialization)
  return {
    initialize,
    show,
    hide,
    setIframe,
    getWrapper,
    getOverlay,
    destroy,
  };
}
