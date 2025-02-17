import { BrowserSignature } from '@meaku/core/types/api/session_init_request';
import md5 from 'md5';

export const getWebGLInfo = () => {
  const canvas = document.createElement('canvas');
  const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext;

  if (!gl) return null;

  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
  return debugInfo
    ? {
        vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
        renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL),
      }
    : null;
};

export const getCanvasFingerprint = () => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) return null;

  ctx.textBaseline = 'top';
  ctx.font = '14px Arial';
  ctx.fillStyle = '#f60';
  ctx.fillRect(125, 1, 62, 20);
  ctx.fillStyle = '#069';
  ctx.fillText('Meaku', 2, 15);
  ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
  ctx.fillText('Meaku', 4, 17);
  const dataURL = canvas.toDataURL();
  const hashedDataURL = md5(dataURL);

  return hashedDataURL;
};

export const getBrowserSignature = (): Partial<BrowserSignature> => ({
  userAgent: navigator.userAgent,
  platform: navigator.platform,
  language: navigator.language,
  screen: (() => {
    try {
      return {
        width: window.screen.width,
        height: window.screen.height,
        colorDepth: window.screen.colorDepth,
        pixelDepth: window.screen.pixelDepth,
        orientation: window.screen.orientation.type,
      };
    } catch {
      return undefined;
    }
  })(),
  timezone: (() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      return undefined;
    }
  })(),
  plugins: (() => {
    try {
      return Array.from(navigator.plugins).map((plugin) => plugin.name);
    } catch {
      return [];
    }
  })(),
  mimeTypes: (() => {
    try {
      return Array.from(navigator.mimeTypes).map((mimeType) => mimeType.type);
    } catch {
      return [];
    }
  })(),
  hardwareConcurrency: (() => {
    try {
      return navigator.hardwareConcurrency;
    } catch {
      return undefined;
    }
  })(),
  deviceMemory: (() => {
    try {
      return navigator.deviceMemory;
    } catch {
      return undefined;
    }
  })(),
  touchPoints: (() => {
    try {
      return navigator.maxTouchPoints;
    } catch {
      return undefined;
    }
  })(),
  cookieEnabled: (() => {
    try {
      return navigator.cookieEnabled;
    } catch {
      return undefined;
    }
  })(),
  online: (() => {
    try {
      return navigator.onLine;
    } catch {
      return undefined;
    }
  })(),
  webGL: (() => {
    try {
      return getWebGLInfo();
    } catch {
      return null;
    }
  })(),
  canvas: (() => {
    try {
      return () => getCanvasFingerprint();
    } catch {
      return () => null;
    }
  })(),
  localStorage: (() => {
    try {
      return !!window.localStorage;
    } catch {
      return false;
    }
  })(),
  sessionStorage: (() => {
    try {
      return !!window.sessionStorage;
    } catch {
      return false;
    }
  })(),
  indexedDB: (() => {
    try {
      return !!window.indexedDB;
    } catch {
      return false;
    }
  })(),
  doNotTrack: (() => {
    try {
      return navigator.doNotTrack || navigator.msDoNotTrack || window.doNotTrack;
    } catch {
      return undefined;
    }
  })(),
});
