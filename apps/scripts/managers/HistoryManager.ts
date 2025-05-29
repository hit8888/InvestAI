export function HistoryManager(historyChangeCallback: () => void) {
  let currentUrl = window.location.href;

  window.addEventListener("popstate", () => {
    if (currentUrl !== window.location.href) {
      currentUrl = window.location.href;
      historyChangeCallback();
    }
  });

  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function (...args) {
    originalPushState.apply(history, args);
    setTimeout(() => {
      if (currentUrl !== window.location.href) {
        currentUrl = window.location.href;
        historyChangeCallback();
      }
    }, 0);
  };

  history.replaceState = function (...args) {
    originalReplaceState.apply(history, args);
    setTimeout(() => {
      if (currentUrl !== window.location.href) {
        currentUrl = window.location.href;
        historyChangeCallback();
      }
    }, 0);
  };
}
