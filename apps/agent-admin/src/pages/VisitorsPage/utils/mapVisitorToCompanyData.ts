import type { SessionDetailsDataResponse } from '@meaku/core/types/admin/admin';
import type { CompanyData } from '../components/CompanyDetailsDrawer/types';
import { getCompanyLogoSrc } from '@meaku/core/utils/index';
import { getHighestIntentScore } from '../../../utils/common';

export const mapSessionDetailToCompanyData = (sessionData: SessionDetailsDataResponse): CompanyData => {
  const prospect = sessionData.prospect;
  const session = sessionData.session;
  const websiteUrl = prospect.company_demographics?.website_url;
  const logo = websiteUrl ? getCompanyLogoSrc(websiteUrl) : '';

  return {
    name: prospect.company || '',
    website: websiteUrl || '',
    logo,
    hqLocation: prospect.company_demographics?.company_country || '',
    revenue: prospect.company_demographics?.company_revenue || '',
    employees: prospect.company_demographics?.employee_count || '',
    atsUsed: prospect.company_demographics?.ats_information?.ats_used || '',
    atsWebsiteUrl: prospect.company_demographics?.ats_information?.ats_website_link || '',
    numOpenJobs: prospect.company_demographics?.ats_information?.num_open_jobs || null,
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
      sdr_assignment: prospect.sdr_assignment || undefined,
      ipAddress: prospect.ip_address || prospect.prospect_demographics?.ip_address || '',
      browsing_history: prospect.browsed_urls || [],
      buyer_intent_score:
        session?.buyer_intent_score ?? getHighestIntentScore(sessionData.chat_history).buyer_intent_score ?? null,
    },
    email: prospect.email || '',
    browsingHistorySummary: prospect.browsing_analysis_summary || '',
    conversationSummary: sessionData.chat_summary || '',
    enrichmentSource: prospect.prospect_demographics?.enrichment_source,
  };
};
