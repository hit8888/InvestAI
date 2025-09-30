import { BrowsedUrl } from '@meaku/core/types/common';
import { SdrAssignment } from '@meaku/core/types/admin/api';
import { EnrichmentSource } from '@meaku/core/types/admin/admin';

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
  buyer_intent_score?: number | null;
  ipAddress?: string;
  browsing_history?: BrowsedUrl[];
  sdr_assignment?: SdrAssignment;
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
  numOpenJobs?: number | null;
  prospect: Employee;
  browsingHistorySummary?: string;
  conversationSummary?: string;
  email: string;
  enrichmentSource?: EnrichmentSource | null;
};

export type CompanyDetailsDrawerProps = {
  open: boolean;
  onClose: () => void;
  companyData?: CompanyData;
};
