import { RESPONSIVE_SIZES, SENTRY_DSN } from "../agent/lib/constants";
import type { Config, Constants } from "../agent/lib/types";

export function ConfigManager() {
  const scriptElement = document.currentScript as HTMLScriptElement | null;
  const constants = {
    RESPONSIVE_SIZES,
    SENTRY_DSN,
  } as Constants;

  const getConfig = (): Config => {
    return {
      tenantId: scriptElement?.getAttribute("tenant-id") ?? null,
      agentId: scriptElement?.getAttribute("agent-id") ?? null,
      startTime: scriptElement?.getAttribute("start-time") ?? null,
      endTime: scriptElement?.getAttribute("end-time") ?? null,
      allowedDays: scriptElement?.getAttribute("allowed-days") ?? null,
    };
  };

  // Return public API
  return {
    constants,
    getConfig,
  };
}
