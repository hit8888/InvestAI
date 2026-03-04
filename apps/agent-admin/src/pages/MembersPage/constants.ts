import { UserRole } from '@neuraltrade/core/types/admin/api';

/**
 * User role options for dropdown components
 */
export const ROLE_OPTIONS: { label: string; value: UserRole }[] = [
  { label: 'Admin', value: 'admin' },
  { label: 'Rep', value: 'read-write' },
  { label: 'Read Only', value: 'read-only' },
];

/**
 * Map of role values to display labels
 */
export const ROLE_LABEL_MAP: Record<string, string> = {
  admin: 'Admin',
  'read-write': 'Rep',
  'read-only': 'Read Only',
};
