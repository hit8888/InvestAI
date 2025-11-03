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
  [key: `primary_goal_redirected_${string}`]: boolean;
  [key: `nudge_action_cta_${string}`]: boolean;
}

export interface StorageData {
  [key: string]: TenantStorageData;
}
