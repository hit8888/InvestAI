export type LayoutType = 'bottom_center' | 'bottom_right';

export interface TenantStorageData {
  sessionId?: string;
  prospectId?: string;
  tenantId?: string;
  agentId?: string;
  distinctId?: string;
  prospect_info_collected?: boolean;
  tenantName?: string;
  watchedVideos?: string[];
  layoutPreference?: {
    layout: LayoutType;
    timestamp: number;
    expiresAt: number;
  };
}

export interface StorageData {
  [key: string]: TenantStorageData;
}
