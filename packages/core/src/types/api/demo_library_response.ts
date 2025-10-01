export interface DemoAsset {
  id: string;
  name: string;
  type: string;
  description: string;
  key: string | null;
  public_url: string;
}

export interface DemoItem {
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
  asset: DemoAsset;
}

export interface DemoThumbnail {
  thumbnail_asset_url: string;
  thumbnail_type: string;
  entity_artifact_id: number;
}

export interface DemoLibraryResponse {
  session_id: string;
  prospect_id: string;
  demos: DemoItem[];
  demo_thumbnails: DemoThumbnail[];
}
