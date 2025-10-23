import type { SessionDetailsDataResponse } from '@meaku/core/types/admin/admin';
import type { CompanyData } from '../components/CompanyDetailsDrawer/types';
import { getCompanyLogoSrc } from '@meaku/core/utils/index';
import { getHighestIntentScore } from '../../../utils/common';

export const mapSessionDetailToCompanyData = (sessionData: SessionDetailsDataResponse): CompanyData => {
  // Top level details
  const prospectDetails = sessionData.prospect;
  const sessionDetails = sessionData.session;
  const chatHistory = sessionData.chat_history;
  const chatSummary = sessionData.chat_summary;

  // Prospect level details
  const companyDemographics = prospectDetails.company_demographics;
  const prospectDemographics = prospectDetails.prospect_demographics;
  const coreCompany = prospectDetails.core_company;

  const website = coreCompany?.domain || companyDemographics?.website_url || '';

  return {
    name: coreCompany?.name || prospectDetails.company || '',
    website,
    logo: getCompanyLogoSrc(website) || '',
    hqLocation: coreCompany?.country || companyDemographics?.company_country || '',
    revenue: coreCompany?.annual_revenue?.toString() || companyDemographics?.company_revenue || '',
    employees: coreCompany?.employee_count?.toString() || companyDemographics?.employee_count || '',
    atsUsed: companyDemographics?.ats_information?.ats_used || '',
    atsWebsiteUrl: companyDemographics?.ats_information?.ats_website_link || '',
    numOpenJobs: companyDemographics?.ats_information?.num_open_jobs || null,
    prospect: {
      prospect_id: prospectDetails.prospect_id || '',
      session_id: prospectDetails.session_id || '',
      name: prospectDetails.name || '',
      title: prospectDetails.role || '',
      email: prospectDetails.email || '',
      timeSpent: '',
      visits: 0,
      location: {
        city: prospectDemographics?.city,
        country: prospectDemographics?.country,
      },
      sdr_assignment: prospectDetails.sdr_assignment || undefined,
      ipAddress: prospectDetails.ip_address || prospectDemographics?.ip_address || '',
      browsing_history: prospectDetails.browsed_urls || [],
      buyer_intent_score:
        sessionDetails?.buyer_intent_score ?? getHighestIntentScore(chatHistory).buyer_intent_score ?? null,
    },
    email: prospectDetails.email || '',
    browsingHistorySummary: prospectDetails.browsing_analysis_summary || '',
    conversationSummary: chatSummary || '',
    enrichmentSource: prospectDemographics?.enrichment_source,
  };
};
