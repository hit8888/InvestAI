export type organizationDetails = {
  id?: number;
  name?: string;
  role?: string;
  "tenant-name"?: string;
};

export type AuthResponse = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_staff: boolean;
  date_joined: string; // ISO 8601 format
  last_login: string; // ISO 8601 format
  organizations: organizationDetails[];
};
