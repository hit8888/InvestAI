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

  let trackedPaths = JSON.parse(
    localStorage.getItem(USER_VISIT_LS_KEY) || "[]"
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
  if (window.isBreakoutChatReady) {
    clearInterval(window.breakoutInitializationIntervalId as number);
    return;
  }

  const breakoutChat = document.getElementById(
    "breakoutChat"
  ) as HTMLIFrameElement;

  if (!breakoutChat) {
    return;
  }

  const chatWindow = breakoutChat.contentDocument?.querySelector(
    "iframe"
  ) as HTMLIFrameElement;

  if (!chatWindow) {
    return;
  }

  chatWindow.contentWindow?.postMessage({ type: "INIT", payload }, "*");
};

window.addEventListener("message", (event) => {
  const type = event.data?.type;

  if (type === "CHAT_READY") {
    window.isBreakoutChatReady = true;
  }
});

window.breakoutInitializationIntervalId = window.setInterval(() => {
  establishConnection();
}, 1000);
