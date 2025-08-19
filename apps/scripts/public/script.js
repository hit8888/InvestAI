// DOM Element IDs and Selectors
const ELEMENTS = {
  WIDGET_PREVIEW: "widget-preview-panel",
  EMBEDDED_WIDGET: "embedded-widget",
  CONFIG_PANEL: ".container > .panel:not(#widget-preview-panel)",
  FORM_FIELDS: {
    widgetType: "widgetType",
    tenantId: "tenantId",
    agentId: "agentId",
    embedMode: "embedMode",
    maxHeight: "maxHeight",
    hideBottomBar: "hideBottomBar",
    showBottomBar: "showBottomBar",
    allowExternalButtons: "allowExternalButtons",
    isCollapsible: "isCollapsible",
    feedbackEnabled: "feedbackEnabled",
    bc: "bc",
    userEmail: "userEmail",
    initialMessage: "initialMessage",
    startTime: "startTime",
    endTime: "endTime",
  },
};

// Widget Configuration
const WIDGET_CONFIG = {
  SCRIPT_NAMES: {
    agent: "chat_widget.js",
    "command-bar": "command_bar_widget.js",
  },
  DEFAULT_TYPE: "command-bar",
  QUERY_PARAMS: {
    tenantId: "bo_tenant_id",
    agentId: "bo_agent_id",
    widgetType: "bo_widget_type",
  },
};

// UI Management
const UI = {
  showElement: (elementId) => {
    const element = document.getElementById(elementId);
    if (element) element.style.display = "block";
  },
  hideElement: (selector) => {
    const element = document.querySelector(selector);
    if (element) element.style.display = "none";
  },
  resetEmbeddedWidget: () => {
    const widget = document.getElementById(ELEMENTS.EMBEDDED_WIDGET);
    if (widget) {
      widget.innerHTML = "";
      widget.classList.remove("loaded");
    }
  },
  handleContainers: (isEmbedMode) => {
    if (isEmbedMode) {
      UI.showElement(ELEMENTS.WIDGET_PREVIEW);
      UI.resetEmbeddedWidget();
    }
    UI.hideElement(ELEMENTS.CONFIG_PANEL);
  },
};

// Form Management
const Form = {
  getValue: (id) => document.getElementById(id)?.value || "",
  getChecked: (id) => document.getElementById(id)?.checked || false,

  getConfig: () => {
    const fields = ELEMENTS.FORM_FIELDS;
    return {
      widgetType: Form.getValue(fields.widgetType),
      tenantId: Form.getValue(fields.tenantId),
      agentId: Form.getValue(fields.agentId),
      embedMode: Form.getChecked(fields.embedMode),
      maxHeight: Form.getValue(fields.maxHeight),
      hideBottomBar: Form.getChecked(fields.hideBottomBar),
      showBottomBar: Form.getChecked(fields.showBottomBar),
      allowExternalButtons: Form.getChecked(fields.allowExternalButtons),
      isCollapsible: Form.getChecked(fields.isCollapsible),
      feedbackEnabled: Form.getChecked(fields.feedbackEnabled),
      bc: Form.getChecked(fields.bc),
      userEmail: Form.getValue(fields.userEmail),
      initialMessage: Form.getValue(fields.initialMessage),
      startTime: Form.getValue(fields.startTime),
      endTime: Form.getValue(fields.endTime),
    };
  },
};

// Widget Script Management
const WidgetScript = {
  create: (widgetType, attributes) => {
    const script = document.createElement("script");
    script.src = WIDGET_CONFIG.SCRIPT_NAMES[widgetType];
    Object.entries(attributes).forEach(([key, value]) => {
      if (value) script.setAttribute(key, value);
    });
    return script;
  },

  load: (script) => {
    document.head.appendChild(script);
  },

  createAttributes: (config) => ({
    "tenant-id": config.tenantId,
    "agent-id": config.agentId,
    "container-id": config.embedMode ? ELEMENTS.EMBEDDED_WIDGET : null,
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
  }),
};

// Main Functions
function loadWidgetFromQueryParams() {
  const params = new URLSearchParams(window.location.search);
  const config = {
    tenantId: params.get(WIDGET_CONFIG.QUERY_PARAMS.tenantId),
    agentId: params.get(WIDGET_CONFIG.QUERY_PARAMS.agentId),
    widgetType:
      params.get(WIDGET_CONFIG.QUERY_PARAMS.widgetType) ||
      WIDGET_CONFIG.DEFAULT_TYPE,
  };

  if (config.tenantId && config.agentId) {
    const script = WidgetScript.create(config.widgetType, {
      "tenant-id": config.tenantId,
      "agent-id": config.agentId,
    });
    UI.handleContainers();
    WidgetScript.load(script);
    return true;
  }
  return false;
}

function loadWidget() {
  const config = Form.getConfig();
  if (!config.tenantId) return;

  const script = WidgetScript.create(
    config.widgetType,
    WidgetScript.createAttributes(config),
  );
  UI.handleContainers(config.embedMode);
  WidgetScript.load(script);
}

function resetStorage() {
  localStorage.clear();
  sessionStorage.clear();
  document.cookie.split(";").forEach((c) => {
    document.cookie = c
      .replace(/^ +/, "")
      .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  });
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  const loaded = loadWidgetFromQueryParams();
  if (!loaded) {
    UI.showElement(ELEMENTS.CONFIG_PANEL.slice(1)); // Remove leading dot for getElementById
  }
});
