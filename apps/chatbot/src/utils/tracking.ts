import { BrowserSignature } from "../types/api";

export const getWebGLInfo = () => {
  const canvas = document.createElement("canvas");
  const gl = (canvas.getContext("webgl") ||
    canvas.getContext("experimental-webgl")) as WebGLRenderingContext;

  if (!gl) return null;

  const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
  return debugInfo
    ? {
        vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
        renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL),
      }
    : null;
};

export const getCanvasFingerprint = () => {
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

export const getBrowserSignature = (): Partial<BrowserSignature> => ({
  userAgent: navigator.userAgent,
  platform: navigator.platform,
  language: navigator.language,
  screen: {
    width: window.screen.width,
    height: window.screen.height,
    colorDepth: window.screen.colorDepth,
    pixelDepth: window.screen.pixelDepth,
    orientation: window.screen.orientation.type,
  },
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  plugins: Array.from(navigator.plugins).map((plugin) => plugin.name),
  mimeTypes: Array.from(navigator.mimeTypes).map((mimeType) => mimeType.type),
  hardwareConcurrency: navigator.hardwareConcurrency,
  deviceMemory: navigator.deviceMemory,
  touchPoints: navigator.maxTouchPoints,
  cookieEnabled: navigator.cookieEnabled,
  online: navigator.onLine,
  webGL: getWebGLInfo(),
  canvas: getCanvasFingerprint(),
  localStorage: !!window.localStorage,
  sessionStorage: !!window.sessionStorage,
  indexedDB: !!window.indexedDB,
  doNotTrack:
    navigator.doNotTrack || navigator.msDoNotTrack || window.doNotTrack,
});
