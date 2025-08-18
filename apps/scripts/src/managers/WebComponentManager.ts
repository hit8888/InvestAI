interface WebComponentOptions {
  url: string;
  tagName: string;
  attributes?: Record<string, string>;
}

export function WebComponentManager() {
  const loadWebComponent = async (
    options: WebComponentOptions,
  ): Promise<void> => {
    const { url, tagName, attributes = {} } = options;

    await loadScript(url);

    const element = document.createElement(tagName);
    element.id = tagName;

    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });

    document.body.appendChild(element);
  };

  const loadScript = (url: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const existingScript = document.querySelector(`script[src="${url}"]`);
      if (existingScript) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = url;
      script.type = "module";
      script.defer = true;

      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${url}`));

      document.head.appendChild(script);
    });
  };

  return {
    loadWebComponent,
  };
}
