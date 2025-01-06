import 'react';

declare module 'react' {
  interface FunctionComponent {
    whyDidYouRender?: boolean;
  }

  interface ComponentClass {
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
