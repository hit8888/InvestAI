import type { UtmParameters } from "../agent/lib/types";

export function URLManager() {
  const updateParentUrlParam = (key: string, value: string | null): void => {
    const url = new URL(window.parent.location.href);
    const currentValue = url.searchParams.get(key);

    if (key === "isAgentOpen" && currentValue === null) {
      return;
    }

    // Only update if the value is different
    if (value === null || value === "") {
      if (currentValue !== null) {
        url.searchParams.delete(key);
        window.parent.history.replaceState({}, "", url);
      }
    } else if (currentValue !== value) {
      url.searchParams.set(key, value);
      window.parent.history.replaceState({}, "", url);
    }
  };

  const getQueryParameter = (name: string): string | null => {
    return new URLSearchParams(window.location.search).get(name);
  };

  const getUtmParameters = (): UtmParameters => {
    const utmParams = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
      "isAgentOpen",
      "source",
    ] as const;
    return utmParams.reduce((params: Partial<UtmParameters>, key) => {
      params[key as keyof UtmParameters] = getQueryParameter(key);
      return params;
    }, {}) as UtmParameters;
  };

  const getCurrentUrl = (): string => {
    return window.location !== window.parent.location
      ? document.referrer
      : document.location.href;
  };

  // Return public API
  return {
    updateParentUrlParam,
    getQueryParameter,
    getUtmParameters,
    getCurrentUrl,
  };
}
