import { RESPONSIVE_SIZES, SENTRY_DSN } from "../agent/lib/constants";
import type { Config, Constants } from "../agent/lib/types";

export function ConfigManager(deviceType?: "DESKTOP" | "TABLET") {
  const scriptElement = document.currentScript as HTMLScriptElement | null;
  const constants = {
    RESPONSIVE_SIZES,
    SENTRY_DSN,
  } as Constants;

  const getConfig = (): Config => {
    const defaultDeviceType = deviceType || "DESKTOP";
    const defaultHeight =
      constants.RESPONSIVE_SIZES[defaultDeviceType].DEFAULT.HEIGHT;

    return {
      tenantId: scriptElement?.getAttribute("tenant-id") ?? null,
      agentId: scriptElement?.getAttribute("agent-id") || "1",
      hideBottomBar: scriptElement?.getAttribute("hide-bottom-bar") === "true",
      showBottomBar: scriptElement?.getAttribute("show-bottom-bar") === "true",
      height: scriptElement?.getAttribute("max-height") || defaultHeight,
      allowExternalButtons:
        scriptElement?.getAttribute("allow-external-buttons") === "true",
      containerId: scriptElement?.getAttribute("container-id") ?? null,
      feedbackEnabled:
        scriptElement?.getAttribute("feedback-enabled") === "true",
      userEmail: scriptElement?.getAttribute("user-email") ?? "",
      initialMessage: scriptElement?.getAttribute("initial-message") ?? "",
      startTime: scriptElement?.getAttribute("start-time") ?? null,
      endTime: scriptElement?.getAttribute("end-time") ?? null,
    };
  };

  // Return public API
  return {
    constants,
    getConfig,
  };
}
