import type { StorageData, TenantStorageData } from '../types/storage';

const STORAGE_KEY = '__breakout_tenant_data__';
const ACTIVE_TENANT_KEY = '__breakout_active_tenant__';

type ActiveTenant = {
  tenantId: string;
  agentId: string;
} | null;

// Helper functions
const safeLocalStorageOp = <T>(operation: () => T, errorMsg: string): T | null => {
  try {
    return operation();
  } catch (error) {
    console.error(errorMsg, error);
    return null;
  }
};

const getStorageKey = (tenant: ActiveTenant): string | null => {
  if (!tenant?.tenantId || !tenant?.agentId) return null;
  return `${tenant.tenantId}_${tenant.agentId}`;
};

// Main storage operations
export const getActiveTenantData = (): ActiveTenant =>
  safeLocalStorageOp(() => {
    const data = localStorage.getItem(ACTIVE_TENANT_KEY);
    return data ? JSON.parse(data) : null;
  }, 'Error getting active tenant data from localStorage:');

export const setActiveTenantData = (tenantId: string, agentId: string): void => {
  safeLocalStorageOp(
    () => localStorage.setItem(ACTIVE_TENANT_KEY, JSON.stringify({ tenantId, agentId })),
    'Error setting active tenant data in localStorage:',
  );
};

const getAllStorageData = (): StorageData =>
  safeLocalStorageOp(() => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  }, 'Error getting all data from localStorage:') ?? {};

export const getLocalStorageData = (): TenantStorageData | null => {
  const tenant = getActiveTenantData();
  const key = getStorageKey(tenant);
  if (!key) return null;

  const allData = getAllStorageData();
  return allData[key] || null;
};

export const setLocalStorageData = (data: Partial<TenantStorageData>): void => {
  const tenant = getActiveTenantData();
  const key = getStorageKey(tenant);
  if (!key) return;

  safeLocalStorageOp(() => {
    const allData = getAllStorageData();
    const existingData = (allData[key] || {}) as TenantStorageData;
    const updatedData = { ...allData, [key]: { ...existingData, ...data } };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
  }, 'Error setting data in localStorage:');
};

export const removeLocalStorageFields = (fields: Array<keyof TenantStorageData>): void => {
  const tenant = getActiveTenantData();
  const key = getStorageKey(tenant);
  if (!key) return;

  safeLocalStorageOp(() => {
    const allData = getAllStorageData();
    const tenantData = { ...(allData[key] || {}) };
    fields.forEach((field) => delete tenantData[field as keyof TenantStorageData]);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...allData, [key]: tenantData }));
  }, 'Error removing fields from localStorage:');
};

export const clearLocalStorageData = (): void => {
  const tenant = getActiveTenantData();
  const key = getStorageKey(tenant);
  if (!key) return;

  safeLocalStorageOp(() => {
    const allData = getAllStorageData();
    delete allData[key];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));
  }, 'Error clearing data from localStorage:');
};
