import type { Config } from "../agent/lib/types";
import { env } from "../env";

export function IframeURLManager() {
  const AGENT_BASE_URL = env.AGENT_BASE_URL;
  const getIframeSrc = (config: Config): string => {
    const params = new URLSearchParams();

    const baseUrl = config.feedbackEnabled
      ? `${AGENT_BASE_URL}/demo`
      : AGENT_BASE_URL;

    if (config.containerId) {
      params.append("container_id", config.containerId);
      params.append("isAgentOpen", "true"); // if its embedded, we need to open the agent
    }

    if (config.userEmail) {
      params.append("email", config.userEmail);
    }

    if (config.feedbackEnabled) {
      params.append("is_test", "true");
      params.append("test_type", "manual");
    }

    return `${baseUrl}/org/${config.tenantId}/agent/${config.agentId}?${params.toString()}`;
  };

  // Return public API
  return {
    getIframeSrc,
  };
}
