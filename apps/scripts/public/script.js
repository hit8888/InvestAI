function getConfig() {
  return {
    widgetType: document.getElementById("widgetType").value,
    tenantId: document.getElementById("tenantId").value,
    agentId: document.getElementById("agentId").value,
    embedMode: document.getElementById("embedMode").checked,
    maxHeight: document.getElementById("maxHeight").value,
    hideBottomBar: document.getElementById("hideBottomBar").checked,
    showBottomBar: document.getElementById("showBottomBar").checked,
    allowExternalButtons: document.getElementById("allowExternalButtons")
      .checked,
    isCollapsible: document.getElementById("isCollapsible").checked,
    feedbackEnabled: document.getElementById("feedbackEnabled").checked,
    bc: document.getElementById("bc").checked,
    userEmail: document.getElementById("userEmail").value,
    initialMessage: document.getElementById("initialMessage").value,
    startTime: document.getElementById("startTime").value,
    endTime: document.getElementById("endTime").value,
  };
}

function createScriptTag(config) {
  const script = document.createElement("script");
  script.src =
    config.widgetType === "agent" ? "chat_widget.js" : "command_bar_widget.js";

  const attrs = {
    "tenant-id": config.tenantId,
    "agent-id": config.agentId,
    "container-id": config.embedMode ? "embedded-widget" : null,
    "max-height": config.maxHeight || null,
    "hide-bottom-bar": config.hideBottomBar ? "true" : null,
    "show-bottom-bar": config.showBottomBar ? "true" : null,
    "allow-external-buttons": config.allowExternalButtons ? "true" : null,
    "is-collapsible": !config.isCollapsible ? "false" : null,
    "feedback-enabled": !config.feedbackEnabled ? "false" : null,
    bc: config.bc ? "true" : null,
    "user-email": config.userEmail || null,
    "initial-message": config.initialMessage || null,
    "start-time": config.startTime || null,
    "end-time": config.endTime || null,
  };

  Object.entries(attrs).forEach(([key, value]) => {
    if (value) script.setAttribute(key, value);
  });

  return script;
}

function loadWidget() {
  const config = getConfig();
  if (!config.tenantId) return;

  // Show widget preview panel if embed mode is selected
  const widgetPreviewPanel = document.getElementById("widget-preview-panel");
  if (config.embedMode) {
    widgetPreviewPanel.style.display = "block";
  }

  const embeddedWidget = document.getElementById("embedded-widget");
  embeddedWidget.innerHTML = "";
  embeddedWidget.classList.remove("loaded");

  const configContainer = document.querySelector(
    ".container > .panel:not(#widget-preview-panel)",
  );
  configContainer.style.display = "none";

  const script = createScriptTag(config);
  document.head.appendChild(script);
}

function resetStorage() {
  localStorage.clear();
  sessionStorage.clear();
  document.cookie.split(";").forEach(function (c) {
    document.cookie = c
      .replace(/^ +/, "")
      .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  });
}
