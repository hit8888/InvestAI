import { CSS_CLASSES, RETRY_CONFIG, WIDGET_IDS } from "../agent/lib/constants";

export function ExternalButtonManager(
  sendMessage?: (iframe: HTMLIFrameElement, message: object) => void,
) {
  const handleExternalButtons = (): void => {
    const buttons = document.querySelectorAll<HTMLElement>(
      CSS_CLASSES.NOTIFY_BREAKOUT_BUTTON,
    );
    if (buttons.length > 0) {
      waitForIframe();
    }
  };

  const waitForIframe = (retryCount = 0): void => {
    const iframe = document.getElementById(
      WIDGET_IDS.BREAKOUT_AGENT,
    ) as HTMLIFrameElement | null;
    if (iframe) {
      attachButtonListeners(
        document.querySelectorAll<HTMLElement>(
          CSS_CLASSES.NOTIFY_BREAKOUT_BUTTON,
        ),
        iframe,
      );
    } else if (retryCount < RETRY_CONFIG.MAX_IFRAME_RETRIES) {
      const delay = Math.pow(2, retryCount) * RETRY_CONFIG.BASE_RETRY_DELAY;
      setTimeout(() => waitForIframe(retryCount + 1), delay);
    } else {
      console.error("Breakout: Iframe not found after maximum retries.");
    }
  };

  const attachButtonListeners = (
    buttons: NodeListOf<HTMLElement>,
    iframe: HTMLIFrameElement,
  ): void => {
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        if (sendMessage) {
          sendMessage(iframe, {
            type: "open-breakout-button",
            data: {
              buttonId: button.id,
              message: `Button ${button.id} was clicked!`,
            },
          });
        }
      });
    });
  };

  // Return public API
  return {
    handleExternalButtons,
  };
}
