export function MessageManager() {
  const sendMessage = (iframe: HTMLIFrameElement, message: object): void => {
    if (iframe.contentWindow && "postMessage" in iframe.contentWindow) {
      iframe.contentWindow.postMessage({ ...message }, { targetOrigin: "*" });
    }
  };

  // Return public API
  return {
    sendMessage,
  };
}
