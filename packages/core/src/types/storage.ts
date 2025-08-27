export interface TenantStorageData {
  sessionId?: string;
  prospectId?: string;
  tenantId?: string;
  agentId?: string;
  distinctId?: string;
  prospect_info_collected?: boolean;
  tenantName?: string;
}

export interface StorageData {
  [key: string]: TenantStorageData;
}
