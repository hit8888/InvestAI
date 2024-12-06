document.addEventListener("DOMContentLoaded", () => {
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
});
