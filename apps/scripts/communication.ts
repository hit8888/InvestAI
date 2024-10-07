interface Window {
  isBreakoutChatReady: boolean;
  breakoutInitializationIntervalId: string | number;
}

window.isBreakoutChatReady = false;
window.breakoutInitializationIntervalId = "";

const USER_VISIT_LS_KEY = "BREAKOUT_USER_VISIT";

const getWebGLInfo = () => {
  const canvas = document.createElement("canvas");
  const gl =
    canvas.getContext("webgl") ||
    (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
  if (!gl) return null;
  const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
  return debugInfo
    ? {
        vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
        renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL),
      }
    : null;
};

const getCanvasFingerprint = () => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.textBaseline = "top";
  ctx.font = "14px Arial";
  ctx.fillStyle = "#f60";
  ctx.fillRect(125, 1, 62, 20);
  ctx.fillStyle = "#069";
  ctx.fillText("Meaku", 2, 15);
  ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
  ctx.fillText("Meaku", 4, 17);
  return canvas.toDataURL();
};

const getAllQueryParams = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const params: Record<string, string> = {};
  urlParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
};

const getBrowserSignature = () => {
  return {
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    userAgent: navigator.userAgent,
    platform: navigator.platform,
  };
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
  webGLInfo: getWebGLInfo(),
  canvasFingerprint: getCanvasFingerprint(),
  queryParams: getAllQueryParams(),
  browserSignature: getBrowserSignature(),
  referer: getReferer(),
  parentURL: getURL(),
  userVisits: trackUserVisits(),
};

const establishConnection = () => {
  if (window.isBreakoutChatReady) {
    clearInterval(window.breakoutInitializationIntervalId);
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
