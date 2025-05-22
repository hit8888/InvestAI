type AuthInstance = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  saveTokens: (accessToken: string, refreshToken: string, userData: any) => void;
  logout: () => void;
  clearAuthValuesFromLocalStorage: () => void;
};

export let authInstance: AuthInstance | null = null;

export const setAuthInstance = (instance: AuthInstance | null) => {
  authInstance = instance;
};
