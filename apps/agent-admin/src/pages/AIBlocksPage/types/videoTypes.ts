/**
 * Video-related types for the Demo Video Modal
 */

export interface VideoAsset {
  id: string;
  name: string;
  type: string;
  description: string;
  key: string;
  public_url: string;
}

export interface VideoStory {
  id: string;
  name: string;
  type: string;
  description?: string | null;
  key: string;
  public_url: string;
  thumbnail_url?: string;
}

export interface DemoVideoModalProps {
  videos?: VideoStory[];
  isLoading?: boolean;
}
