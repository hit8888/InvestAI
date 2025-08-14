declare global {
  interface Navigator {
    deviceMemory?: number;
    msDoNotTrack?: string;
  }

  interface Window {
    doNotTrack?: string;
  }
}

export {};
