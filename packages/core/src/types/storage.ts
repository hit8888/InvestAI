export interface TenantStorageData {
  sessionId?: string;
  prospectId?: string;
  tenantId?: string;
  agentId?: string;
  distinctId?: string;
}

export interface StorageData {
  [key: string]: TenantStorageData;
}
