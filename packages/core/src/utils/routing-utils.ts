const URL_PREFIX = 'bo_';

export const getUrlParams = (): Record<string, string> => {
  const urlParams = new URLSearchParams(window.location.search);
  const params: Record<string, string> = {};

  for (const [key, value] of urlParams.entries()) {
    if (key.startsWith(URL_PREFIX)) {
      params[key.slice(URL_PREFIX.length)] = value ?? '';
    }
  }

  return params;
};

export const clearUrlParams = (keepParams: string[] = []): void => {
  const urlParams = new URLSearchParams(window.location.search);
  for (const key of urlParams.keys()) {
    if (key.startsWith(URL_PREFIX) && !keepParams.includes(key)) {
      urlParams.delete(key);
    }
  }

  const newUrl = new URL(window.location.href);
  newUrl.search = urlParams.toString();

  window.history.replaceState({}, '', newUrl.toString());
};

export const removeParamFromUrl = (key: string): void => {
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.delete(URL_PREFIX + key);

  const newUrl = new URL(window.location.href);
  newUrl.search = urlParams.toString();

  window.history.replaceState({}, '', newUrl.toString());
};
