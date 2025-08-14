// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Window {
  isBreakoutChatReady: boolean;
  breakoutInitializationIntervalId: string | number;
}

window.isBreakoutChatReady = false;
window.breakoutInitializationIntervalId = "";

const USER_VISIT_LS_KEY = "BREAKOUT_USER_VISIT";

const getAllQueryParams = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const params: Record<string, string> = {};
  urlParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
};

const getURL = () => {
  return window.location.href;
};

const getReferer = () => {
  return document.referrer;
};

const trackUserVisits = () => {
  const currentPath = window.location.pathname;
  const currentTimestamp = new Date().toISOString();

  const trackedPaths = JSON.parse(
    localStorage.getItem(USER_VISIT_LS_KEY) || "[]",
  );

  if (trackedPaths.length > 0) {
    const lastEntry = trackedPaths[trackedPaths.length - 1];
    if (lastEntry.pathname === currentPath) {
      lastEntry.count += 1;
      lastEntry.timestamp = currentTimestamp;
    } else {
      trackedPaths.push({
        pathname: currentPath,
        timestamp: currentTimestamp,
        count: 1,
      });
    }
  } else {
    trackedPaths.push({
      pathname: currentPath,
      timestamp: currentTimestamp,
      count: 1,
    });
  }

  localStorage.setItem(USER_VISIT_LS_KEY, JSON.stringify(trackedPaths));
};

const payload = {
  queryParams: getAllQueryParams(),
  referer: getReferer(),
  parentURL: getURL(),
  userVisits: trackUserVisits(),
};

const establishConnection = () => {
  try {
    if (window.isBreakoutChatReady) {
      clearInterval(window.breakoutInitializationIntervalId as number);
      return;
    }

    const breakoutChat = document.getElementById(
      "breakoutChat",
    ) as HTMLIFrameElement;

    if (!breakoutChat) {
      return;
    }

    const chatWindow = breakoutChat.contentDocument?.querySelector(
      "iframe",
    ) as HTMLIFrameElement;

    if (!chatWindow) {
      return;
    }

    // Add safety checks for contentWindow and origin
    if (!chatWindow.contentWindow) {
      console.warn("Chat window or content window not available");
      return;
    }

    try {
      chatWindow.contentWindow.postMessage({ type: "INIT", payload }, "*");
    } catch (postMessageError) {
      console.warn("Failed to send postMessage:", postMessageError);
      // Clear the interval if we hit a critical error
      clearInterval(window.breakoutInitializationIntervalId as number);

      // Optional: Report to error tracking
      if (postMessageError instanceof Error) {
        window.Sentry?.captureException(postMessageError, {
          tags: {
            tenant_id: null,
            agent_id: "unknown",
            error_type: "post_message_error",
            component: "scripts/communication.ts - establishConnection",
          },
          extra: {
            event: "establish_connection",
            url: window.location.href,
            data: payload,
          },
        });
      }
    }
  } catch (error) {
    console.warn("Error in establishConnection:", error);
    // Clear the interval if we hit a critical error
    clearInterval(window.breakoutInitializationIntervalId as number);

    if (error instanceof Error) {
      // Optional: Report to error tracking
      window.Sentry?.captureException(error, {
        tags: {
          tenant_id: null,
          agent_id: "unknown",
          error_type: "establish_connection_error",
          component: "scripts/communication.ts - establishConnection",
        },
        extra: {
          event: "establish_connection",
          url: window.location.href,
        },
      });
    }
  }
};

// Add error handling to the message event listener
window.addEventListener("message", (event) => {
  try {
    const type = event.data?.type;

    if (type === "CHAT_READY") {
      window.isBreakoutChatReady = true;
      clearInterval(window.breakoutInitializationIntervalId as number);
    }
  } catch (error) {
    console.warn("Error handling message event:", error);
    if (error instanceof Error) {
      window.Sentry?.captureException(error, {
        tags: {
          tenant_id: null,
          agent_id: "unknown",
          error_type: "message_event_error",
          component: "scripts/communication.ts - message event listener",
        },
        extra: {
          event: "message_event",
          url: window.location.href,
        },
      });
    }
  }
});

window.breakoutInitializationIntervalId = window.setInterval(() => {
  establishConnection();
}, 1000);
