export type Employee = {
  id: string;
  name: string;
  title: string;
  email: string;
  avatar?: string;
  linkedin?: string;
  timeSpent?: string;
  visits?: number;
  location?: string;
};

export type CompanyData = {
  id: string;
  name: string;
  website: string;
  logo?: string;
  hqLocation: string;
  relevance?: string;
  revenue: string;
  employees: string;
  visits?: number;
  ats?: string;
  prospect: Employee;
  browsingHistorySummary?: string;
  conversationSummary?: string;
  email: string;
  session_id: string;
};

export type CompanyDetailsDrawerProps = {
  open: boolean;
  onClose: () => void;
  companyData?: CompanyData;
};
