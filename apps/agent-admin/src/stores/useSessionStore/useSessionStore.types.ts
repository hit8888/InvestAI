import { UserInfoResponse, OrganizationDetailsResponse } from '@neuraltrade/core/types/admin/api';

export type SessionState = {
  accessToken: string | null;
  refreshToken: string | null;
  activeTenant: OrganizationDetailsResponse | null;
  userInfo: UserInfoResponse;
  isAuthenticated: boolean;

  // Actions
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUserInfo: (userInfo: UserInfoResponse) => void;
  updateUserInfo: (userInfo: Partial<UserInfoResponse>) => void;
  setActiveTenant: (tenant: OrganizationDetailsResponse) => void;
  login: () => void;
  logout: () => void;
  clearAuth: () => void;
};

// Partial state type for persistence (only the fields we want to persist)
export type PersistedSessionState = Pick<SessionState, 'accessToken' | 'refreshToken' | 'activeTenant'>;
