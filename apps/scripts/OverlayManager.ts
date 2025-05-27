export function OverlayManager(
  config: Config,
  postMessage: (iframe: HTMLIFrameElement, message: object) => void,
  embeddedContainer: HTMLElement | null = null,
  bottomContainer: HTMLElement | null = null,
) {
  let overlay: HTMLDivElement;
  let wrapper: HTMLDivElement;
  let iframe: HTMLIFrameElement | null = null;
  let currentContainer: HTMLElement | null = null;

  const createOverlayElements = (): void => {
    // Create overlay
    overlay = document.createElement("div");
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

    // Create wrapper
    wrapper = document.createElement("div");
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
  };

  const handleClose = (): void => {
    if (iframe) {
      wrapper.removeChild(iframe);

      if (config.containerId && embeddedContainer) {
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

  const setupEventListeners = (): void => {
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

  const showWithIframe = (formId: string, message: string): void => {
    if (!iframe) return;

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

  const show = (): void => {
    overlay.style.display = "block";
  };

  const hide = (): void => {
    overlay.style.display = "none";
  };

  const setIframe = (
    newIframe: HTMLIFrameElement,
    container: HTMLElement,
  ): void => {
    iframe = newIframe;
    currentContainer = container;
  };

  const getWrapper = (): HTMLDivElement => wrapper;
  const getOverlay = (): HTMLDivElement => overlay;

  const destroy = (): void => {
    window.removeEventListener("message", handleClose);
    window.removeEventListener("submit", handleFormSubmit);

    if (overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
    }
  };

  // Initialize
  createOverlayElements();
  setupEventListeners();

  // Return public API
  return {
    show,
    hide,
    setIframe,
    getWrapper,
    getOverlay,
    destroy,
  };
}
