export interface VideoAsset {
  id: string;
  name: string;
  type: string;
  description: string;
  key: string;
  public_url: string;
}

export interface VideoItem {
  data_source_id: number;
  data_source_type: string;
  asset_id: string;
  title: string;
  data: string;
  relevant_queries: string[];
  metadata: Record<string, unknown>;
  status: string;
  labelled_by_id: string | null;
  id: number;
  created_on: string;
  updated_on: string;
  asset: VideoAsset;
}

export interface VideoThumbnail {
  thumbnail_asset_url: string;
  thumbnail_type: string;
  entity_artifact_id: number;
}

export interface VideoLibraryResponse {
  session_id: string;
  prospect_id: string;
  videos: VideoItem[];
  video_thumbnails: VideoThumbnail[];
}
