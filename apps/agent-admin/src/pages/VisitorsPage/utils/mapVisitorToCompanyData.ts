import type { VisitorsTableDisplayContent } from '@meaku/core/types/admin/admin';
import type { CompanyData } from '../components/CompanyDetailsDrawer/types';
import { getCompanyLogoSrc } from '@meaku/core/utils/index';

/**
 * Maps visitor table data to company data format for the CompanyDetailsDrawer
 */
export const mapVisitorToCompanyData = (visitorData: VisitorsTableDisplayContent): CompanyData => {
  const websiteUrl = visitorData.website_url;
  const logo = websiteUrl ? getCompanyLogoSrc(websiteUrl) : '';

  return {
    id: visitorData.prospect_id,
    name: visitorData.company || '',
    website: visitorData.website_url || '',
    logo,
    hqLocation: visitorData.company_country || '',
    revenue: visitorData.revenue || '',
    employees: visitorData.employee_count?.toString() || '',
    prospect: {
      id: visitorData.name?.toString(),
      name: visitorData.name || '',
      title: visitorData.role || '',
      email: visitorData.email || '',
      timeSpent: '',
      visits: 0,
      location: visitorData.country || '',
    },
    email: visitorData.email || '',
    session_id: visitorData.session_id || '',
  };
};
