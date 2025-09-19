import type { SessionDetailsDataResponse, VisitorsTableDisplayContent } from '@meaku/core/types/admin/admin';
import type { CompanyData } from '../components/CompanyDetailsDrawer/types';
import { getCompanyLogoSrc } from '@meaku/core/utils/index';

/**
 * Maps visitor table data to company data format for the CompanyDetailsDrawer
 */
export const mapVisitorTableDisplayContentToCompanyData = (visitorData: VisitorsTableDisplayContent): CompanyData => {
  const websiteUrl = visitorData.website_url;
  const logo = websiteUrl ? getCompanyLogoSrc(websiteUrl) : '';

  return {
    name: visitorData.company || '',
    website: visitorData.website_url || '',
    logo,
    hqLocation: visitorData.company_country || '',
    revenue: visitorData.revenue || '',
    employees: visitorData.employee_count?.toString() || '',
    prospect: {
      prospect_id: visitorData.prospect_id,
      session_id: visitorData.session_id || '',
      name: visitorData.name || '',
      title: visitorData.role || '',
      email: visitorData.email || '',
      timeSpent: '',
      visits: 0,
      location: visitorData.country || {},
    },
    email: visitorData.email || '',
  };
};

export const mapSessionDetailToCompanyData = (sessionData: SessionDetailsDataResponse): CompanyData => {
  const prospect = sessionData.prospect;
  const websiteUrl = prospect.company_demographics?.website_url;
  const logo = websiteUrl ? getCompanyLogoSrc(websiteUrl) : '';

  return {
    name: prospect.company || '',
    website: websiteUrl || '',
    logo,
    hqLocation: prospect.company_demographics?.company_country || '',
    revenue: prospect.company_demographics?.company_revenue || '',
    employees: prospect.company_demographics?.employee_count || '',
    prospect: {
      prospect_id: prospect.prospect_id || '',
      session_id: prospect.session_id || '',
      name: prospect.name || '',
      title: prospect.role || '',
      email: prospect.email || '',
      timeSpent: '',
      visits: 0,
      location: {
        city: prospect.prospect_demographics?.city,
        country: prospect.prospect_demographics?.country,
      },
    },
    email: prospect.email || '',
    browsingHistorySummary: prospect.browsing_analysis_summary || '',
    conversationSummary: sessionData.chat_summary || '',
  };
};
