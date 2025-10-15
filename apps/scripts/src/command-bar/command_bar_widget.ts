import { ConfigManager, TimeManager, WebComponentManager } from "../managers";
import { env } from "../env";
import { BreakoutFormManager } from "../managers/BreakoutFormManager";
import { DEFAULT_ALLOWED_DAYS } from "../managers/TimeManager";

(function () {
  const scriptAttributes = (() => {
    const scriptElement = document.currentScript as HTMLScriptElement | null;
    const attributes: Record<string, string> = {};

    if (scriptElement && scriptElement.attributes) {
      for (const attr of Array.from(scriptElement.attributes)) {
        if (
          attr.name === "src" ||
          attr.name === "type" ||
          attr.name === "async"
        ) {
          continue;
        }

        attributes[attr.name] = attr.value;
      }
    }

    return attributes;
  })();

  const timeManager = TimeManager();
  const configManager = ConfigManager();
  const webComponentManager = WebComponentManager();
  const breakoutFormManager = BreakoutFormManager({
    onFormSubmit: (_, message: string) => {
      const tagName = env.COMMAND_BAR_TAG_NAME;

      if (message && tagName) {
        document.getElementById(tagName)?.setAttribute("message", message);
      }
    },
  });

  const initializeWidget = async (): Promise<void> => {
    const webComponentUrl = `${env.COMMAND_BAR_BASE_URL}/${env.COMMAND_BAR_TAG_NAME}.js`;
    const tagName = env.COMMAND_BAR_TAG_NAME;

    if (!webComponentUrl || !tagName) {
      return;
    }

    await webComponentManager.loadWebComponent({
      url: webComponentUrl,
      tagName,
      attributes: scriptAttributes,
    });
  };

  const App = {
    async init(): Promise<void> {
      const config = configManager.getConfig();
      const { tenantId, agentId, startTime, endTime, allowedDays } = config;

      if (!tenantId || !agentId) {
        return;
      }

      if (
        !timeManager.isWithinTimeRange({
          startTime,
          endTime,
          allowedDays: allowedDays ?? DEFAULT_ALLOWED_DAYS,
        })
      ) {
        return;
      }

      await initializeWidget();
      breakoutFormManager.setupFormEventListeners();
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
