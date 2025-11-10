import { PersistStorage } from 'zustand/middleware';
import { PersistedSessionState } from './useSessionStore.types';

// Custom storage adapter that stores each field in separate localStorage keys
export const storageAdapter: PersistStorage<PersistedSessionState> = {
  getItem: (_name: string) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      const activeTenant = localStorage.getItem('admin_tenant_identifier');

      // Return null if no data exists
      if (!accessToken && !refreshToken && !activeTenant) {
        return null;
      }

      // Reconstruct the state object
      const state: PersistedSessionState = {
        accessToken: accessToken ?? null,
        refreshToken: refreshToken ?? null,
        activeTenant: null,
      };

      if (activeTenant) {
        try {
          state.activeTenant = JSON.parse(activeTenant);
        } catch {
          // If parsing fails, keep as null
        }
      }

      // Return in StorageValue format
      return {
        state,
        version: 0,
      };
    } catch (error) {
      console.warn('Error reading from separate keys storage:', error);
      return null;
    }
  },
  setItem: (_name: string, value) => {
    try {
      const state = value.state;

      // Write each field to its respective key
      if (state.accessToken !== undefined) {
        if (state.accessToken === null) {
          localStorage.removeItem('accessToken');
        } else {
          localStorage.setItem('accessToken', state.accessToken);
        }
      }
      if (state.refreshToken !== undefined) {
        if (state.refreshToken === null) {
          localStorage.removeItem('refreshToken');
        } else {
          localStorage.setItem('refreshToken', state.refreshToken);
        }
      }
      if (state.activeTenant !== undefined) {
        if (state.activeTenant === null) {
          localStorage.removeItem('admin_tenant_identifier');
        } else {
          localStorage.setItem('admin_tenant_identifier', JSON.stringify(state.activeTenant));
        }
      }
    } catch (error) {
      console.warn('Error writing to separate keys storage:', error);
    }
  },
  removeItem: (_name: string): void => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('admin_tenant_identifier');
  },
};
