import { z } from "zod";
import { getCanvasFingerprint, getWebGLInfo } from "../utils/tracking";

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
  webGL: ReturnType<typeof getWebGLInfo>;
  canvas: ReturnType<typeof getCanvasFingerprint>;
  localStorage: boolean;
  sessionStorage: boolean;
  indexedDB: boolean;
  doNotTrack: string;
};

export type InitializationPayload = {
  session_id?: string;
  prospect_id?: string;
  browser_signature?: Partial<BrowserSignature>;
};

export const UpdateSessionDataPayloadSchema = z.object({
  query_params: z.record(z.string()),
  referer: z.string(),
  parent_url: z.string(),
});

export type UpdateSessionDataPayload = z.infer<
  typeof UpdateSessionDataPayloadSchema
>;
