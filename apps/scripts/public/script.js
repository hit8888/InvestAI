// Constants
const CONFIG = {
  SCRIPT_NAME: "command_bar_widget.js",
  QUERY_PREFIX: "bo_",
  SELECTORS: {
    FORM: "#widget_form",
    WIDGET_PREVIEW: "#widget-preview-panel",
    EMBEDDED_WIDGET: "#embedded-widget",
    CONFIG_PANEL: ".container > .panel:not(#widget-preview-panel)",
    STATIC_CONTENT: "#static-content",
    BRAND_COVER_CONTAINER: "#bo-bc-container",
  },
  REQUIRED_FIELDS: ["tenant_id", "agent_id"],
};

// DOM Utilities
const DOM = {
  get: (selector) => document.querySelector(selector),
  show: (element) => element?.style.removeProperty("display"),
  hide: (element) => element && (element.style.display = "none"),
  remove: (element) => element?.remove(),
};

// UI Controller
class UIController {
  static showForm() {
    DOM.show(DOM.get(CONFIG.SELECTORS.CONFIG_PANEL));
    DOM.hide(DOM.get(CONFIG.SELECTORS.STATIC_CONTENT));
    DOM.hide(DOM.get(CONFIG.SELECTORS.BRAND_COVER_CONTAINER));
  }

  static hideForm() {
    DOM.hide(DOM.get(CONFIG.SELECTORS.CONFIG_PANEL));
    DOM.show(DOM.get(CONFIG.SELECTORS.STATIC_CONTENT));
    DOM.show(DOM.get(CONFIG.SELECTORS.BRAND_COVER_CONTAINER));
  }

  static removeExistingWidget() {
    DOM.remove(DOM.get(`script[src="${CONFIG.SCRIPT_NAME}"]`));
  }
}

// Form Controller
class FormController {
  static getConfig() {
    const form = DOM.get(CONFIG.SELECTORS.FORM);
    if (!form) return null;

    const formData = new FormData(form);
    const config = {};

    formData.forEach((value, key) => {
      if (value) config[key] = value;
    });

    return config;
  }

  static isValid(config) {
    return CONFIG.REQUIRED_FIELDS.every((field) => config?.[field]);
  }
}

// Widget Controller
class WidgetController {
  static create(config) {
    const script = document.createElement("script");
    script.src = CONFIG.SCRIPT_NAME;
    script.setAttribute("tenant-id", config.tenant_id);
    script.setAttribute("agent-id", config.agent_id);
    return script;
  }

  static load(script) {
    document.head.appendChild(script);
  }

  static updateBrowserUrl(config) {
    const params = new URLSearchParams();
    Object.entries(config).forEach(([key, value]) => {
      if (value) {
        params.set(`${CONFIG.QUERY_PREFIX}${key}`, value.toString());
      }
    });
    window.location.href = `${window.location.pathname}?${params.toString()}`;
  }

  static parseUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const config = {};

    params.forEach((value, key) => {
      if (key.startsWith(CONFIG.QUERY_PREFIX)) {
        const configKey = key.replace(CONFIG.QUERY_PREFIX, "");
        config[configKey] = value;
      }
    });

    return config;
  }
}

// Storage Controller
class StorageController {
  static reset() {
    localStorage.clear();
    sessionStorage.clear();

    document.cookie.split(";").forEach((cookie) => {
      const expiry = "=;expires=" + new Date().toUTCString() + ";path=/";
      document.cookie = cookie.replace(/^ +/, "").replace(/=.*/, expiry);
    });
  }
}

// Main Functions
function loadWidgetFromQueryParams() {
  const config = WidgetController.parseUrlParams();

  if (FormController.isValid(config)) {
    UIController.removeExistingWidget();
    const script = WidgetController.create(config);
    UIController.hideForm();
    WidgetController.load(script);
    return true;
  }
  return false;
}

function loadWidget() {
  const config = FormController.getConfig();
  if (!FormController.isValid(config)) return;
  WidgetController.updateBrowserUrl(config);
}

function resetStorage() {
  StorageController.reset();
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  const loaded = loadWidgetFromQueryParams();
  if (!loaded) UIController.showForm();
});
