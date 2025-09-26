export type Employee = {
  icp_id?: number;
  prospect_id?: string;
  session_id?: string;
  name: string;
  title: string;
  email?: string;
  avatar?: string;
  linkedin?: string;
  timeSpent?: string;
  visits?: number;
  location?: {
    city?: string;
    country?: string;
  };
};

export type CompanyData = {
  name: string;
  website: string;
  logo?: string;
  hqLocation: string;
  relevance?: string;
  revenue: string;
  employees: string;
  visits?: number;
  atsUsed?: string;
  atsWebsiteUrl?: string;
  numOpenJobs?: number;
  prospect: Employee;
  browsingHistorySummary?: string;
  conversationSummary?: string;
  email: string;
};

export type CompanyDetailsDrawerProps = {
  open: boolean;
  onClose: () => void;
  companyData?: CompanyData;
};
