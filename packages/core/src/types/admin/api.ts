export type LoginWithEmailPasswordPayload = {
  email: string;
  password: string;
};

export type GenerateOtpPayload = {
  email: string;
};

export type GenerateTokens = {
  refresh: string;
};

export type VerifyOtpPayload = {
  email: string;
  code: string;
};

export type Operator = 
      "eq"
    | "neq"
    | "gt"
    | "gte"
    | "lt"
    | "lte"
    | "contains"
    | "icontains"
    | "in"
    | "not_in"
    | "is_null"
    | "is_not_null"
    | "exists"
    | "not_exists"
    | "between";

export type Filter = {
  field: string;
  operator: Operator;
  value: string | number | boolean | (string | number)[] | null; // Supports array for 'in', 'not_in', and range for 'between'
};

export type Sort = {
  field: string;
  order: "asc" | "desc";
};

export type LeadsPayload = {
  filters: Filter[];
  sort: Sort[];
  search: string;
  page: number;
};

// Type for individual result item
export type LeadResult = {
  id: number;
  external_id: string | null;
  prospect_id: string | null;
  name: string | null;
  email: string;
  phone: string | null;
  role: string | null;
  country: string | null;
  company: string | null;
  company_size: string | null;
  company_industry: string | null;
  budget: string | null;
  timeline: string | null;
  product_interest: string | null;
  additional_info: Record<string, unknown>; // Generic object for additional info
  created_on: string; // ISO date string
  updated_on: string; // ISO date string
};

// Type for the entire response object
export type LeadsTableResponse = {
  total_pages: number;
  total_records: number;
  current_page: number;
  page_size: number;
  results: LeadResult[];
};


export type APIHeaders = {
  'x-tenant-name'?: string; // Represents the tenant name
  'Content-Type': 'application/json'; // Fixed value
  'Authorization': `Bearer ${string}`; // Template literal to enforce "Bearer " prefix followed by a string
};

