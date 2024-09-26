import "react";

declare module "react" {
  interface FunctionComponent<P = {}> {
    whyDidYouRender?: boolean;
  }

  interface ComponentClass<P = {}, S = any> {
    whyDidYouRender?: boolean;
  }
}

declare global {
  interface Navigator {
    deviceMemory?: number;
    msDoNotTrack?: string;
  }

  interface Window {
    doNotTrack?: string;
  }
}
