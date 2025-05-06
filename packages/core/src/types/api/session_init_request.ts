export type BrowserSignature = {
  userAgent: string;
  platform: string;
  language: string;
  screen: {
    width: number;
    height: number;
    colorDepth: number;
    pixelDepth: number;
    orientation: OrientationType;
  };
  timezone: string;
  plugins: string[];
  mimeTypes: string[];
  hardwareConcurrency: number;
  deviceMemory: number;
  touchPoints: number;
  cookieEnabled: boolean;
  online: boolean;
  webGL: {
    vendor: number;
    renderer: number;
  } | null;
  canvas: () => string | null;
  localStorage: boolean;
  sessionStorage: boolean;
  indexedDB: boolean;
  doNotTrack: string;
};

export type InitializationPayload = {
  session_id?: string;
  prospect_id?: string;
  browser_signature?: Partial<BrowserSignature>;
  is_admin?: boolean;
  is_test?: boolean;
  test_type?: 'automated' | 'manual';
  referrer?: string;
  parent_url?: string;
};
