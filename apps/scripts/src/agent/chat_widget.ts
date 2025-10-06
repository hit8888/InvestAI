(function () {
  const App = {
    init() {
      console.warn(
        "⚠️ Breakout Agent: This script has been deprecated and will be removed in a future version.",
        "Please contact Breakout support for migration assistance.",
      );
    },
  };

  (() => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => App.init());
    } else {
      App.init();
    }
  })();
})();
