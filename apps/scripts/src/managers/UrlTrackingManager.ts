import { updateProspect } from "../agent/dom-detectors/api";
import { STORAGE_KEYS } from "../agent/lib/constants";
import { UrlEntry } from "../agent/lib/types";
import { debounce } from "../agent/lib/utils";

type UrlTrackingManagerOptions = {
  maxUrls?: number;
  maxTime?: number;
  urlStorageKey?: string;
  postMessage?: (message: object) => void;
};

function UrlTrackingManager() {
  // Options
  let maxUrls = 10;
  let maxTime = 60 * 60 * 1000;
  let urlStorageKey: string = STORAGE_KEYS.URL_TRACKING;
  let postMessage: ((message: object) => void) | null = null;
  let initialized = false;

  // State
  let firstInteractionTimestamp: number | null = null;
  let urls: UrlEntry[] = [];

  // Utility functions
  function loadFromStorage(): {
    firstInteractionTimestamp: number | null;
    urls: UrlEntry[];
  } {
    try {
      const stored = localStorage.getItem(urlStorageKey);
      return stored
        ? JSON.parse(stored)
        : { firstInteractionTimestamp: null, urls: [] };
    } catch {
      return { firstInteractionTimestamp: null, urls: [] };
    }
  }

  function saveToStorage(): void {
    localStorage.setItem(
      urlStorageKey,
      JSON.stringify({ firstInteractionTimestamp, urls }),
    );
  }

  function flushOldUrls(): void {
    const now: number = Date.now();
    urls = urls.filter((entry: UrlEntry) => now - entry.timestamp <= maxTime);

    if (urls.length > maxUrls) {
      urls = urls.slice(-maxUrls);
    }
  }

  function sendHistoryChangeEvent(): void {
    const prospectId = localStorage.getItem(STORAGE_KEYS.PROSPECT_ID);

    if (prospectId) {
      updateProspect(prospectId, { browsed_urls: urls });
      urls = [];
      saveToStorage();

      return;
    }

    postMessage?.({
      type: "URL_TRACKING_UPDATE",
      payload: {
        browsed_urls: urls,
        firstInteractionTimestamp,
      },
    });
  }

  // Public API
  function init(options: UrlTrackingManagerOptions = {}): void {
    // Set options
    maxUrls = options.maxUrls ?? maxUrls;
    maxTime = options.maxTime ?? maxTime;
    urlStorageKey = options.urlStorageKey ?? urlStorageKey;
    postMessage = options.postMessage ?? postMessage;

    // Set initial state
    const storageValues = loadFromStorage();
    firstInteractionTimestamp = storageValues.firstInteractionTimestamp ?? null;
    urls = storageValues.urls ?? [];

    initialized = true;
  }

  function trackCurrentUrl(): void {
    if (!initialized) return;

    const currentUrl = window.location.href
      .split("?")[0]
      .split("#")[0]
      .replace(/\/$/, "");
    const timestamp = Date.now();

    // Check if URL is different from last entry
    const lastEntry = urls[urls.length - 1];
    if (lastEntry?.url === currentUrl) {
      return; // Same URL, don't add duplicate
    }

    urls.push({ url: currentUrl, timestamp });
    flushOldUrls();
    saveToStorage();
    sendHistoryChangeEvent();
  }

  function updateFirstInteractionTimestamp(hasInteracted: boolean): void {
    if (!initialized || !hasInteracted || firstInteractionTimestamp) return;

    firstInteractionTimestamp = Date.now();
    urls = [];
    saveToStorage();
  }

  return {
    init,
    updateFirstInteractionTimestamp,
    trackCurrentUrl: debounce(trackCurrentUrl, 500),
  };
}

export { UrlTrackingManager };
