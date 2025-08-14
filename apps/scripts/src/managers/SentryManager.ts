import { PERFORMANCE_CONFIG } from "../agent/lib/constants";
import type { Config } from "../agent/lib/types";

export function SentryManager(sentryDsn?: string, config?: Config) {
  const loadSDK = async (): Promise<void> => {
    if ("Sentry" in window) return;

    const script = document.createElement("script");
    script.src = "https://browser.sentry-cdn.com/7.69.0/bundle.min.js";
    script.crossOrigin = "anonymous";

    return new Promise((resolve, reject) => {
      script.onload = () => resolve();
      script.onerror = () => {
        console.error("Failed to load Sentry SDK");
        reject();
      };
      document.head.appendChild(script);
    });
  };

  const init = async (): Promise<void> => {
    try {
      await loadSDK();
      if ("Sentry" in window && sentryDsn) {
        window.Sentry.init({
          dsn: sentryDsn,
          tracesSampleRate: PERFORMANCE_CONFIG.SENTRY_TRACES_SAMPLE_RATE,
          beforeSend(event: unknown) {
            return event;
          },
        });

        if (config) {
          window.Sentry.setTag("tenant_id", config.tenantId);
          window.Sentry.setTag("agent_id", config.agentId);
        }
      }
    } catch (error) {
      console.error("Failed to initialize Sentry:", error);
    }
  };

  // Return public API
  return {
    loadSDK,
    init,
  };
}
