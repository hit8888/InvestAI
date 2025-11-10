import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserInfoResponse, OrganizationDetailsResponse } from '@meaku/core/types/admin/api';
import { DefaultAuthResponse } from '../../utils/constants';
import { SessionState } from './useSessionStore.types';
import { storageAdapter } from './useSessionStore.storageAdapter';

const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      activeTenant: null,
      userInfo: DefaultAuthResponse,
      isAuthenticated: false,

      // Actions
      setTokens: (accessToken: string, refreshToken: string) => {
        set({ accessToken, refreshToken });
      },

      setUserInfo: (userInfo: UserInfoResponse) => {
        set({ userInfo });
      },

      updateUserInfo: (userInfo: Partial<UserInfoResponse>) => {
        set((state) => ({ userInfo: { ...state.userInfo, ...userInfo } }));
      },

      setActiveTenant: (tenant: OrganizationDetailsResponse) => {
        set({ activeTenant: tenant });
      },

      login: () => {
        set({ isAuthenticated: true });
      },

      logout: () => {
        set({
          isAuthenticated: false,
          userInfo: DefaultAuthResponse,
          accessToken: null,
          refreshToken: null,
          activeTenant: null,
        });
      },

      clearAuth: () => {
        set({
          accessToken: null,
          refreshToken: null,
          activeTenant: null,
          userInfo: DefaultAuthResponse,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'agent-admin-session-store',
      storage: storageAdapter,
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        activeTenant: state.activeTenant,
      }),
    },
  ),
);

export default useSessionStore;
