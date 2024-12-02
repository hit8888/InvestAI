document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("notifyButton"); // TODO: Change the id as per your use

  const waitForIframe = (retryCount = 0) => {
    const iframe = document.getElementById("breakout-agent");
    if (iframe) {
      button.addEventListener("click", () => {
        iframe.contentWindow.postMessage(
          { type: "open-breakout-button", payload: "Button was clicked!" },
          "*",
        );
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

  if (button) {
    waitForIframe();
  } else {
    console.error("Button not found.");
  }
});
