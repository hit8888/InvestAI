import CompanyInfoSection from './CompanyInfoSection';
import IcpSection from './IcpSection';
import BrowsingConversationSummary from './BrowsingConversationSummary';

import type { CompanyData } from './types';
import { useNavigate } from 'react-router-dom';

type CompanyDetailsContentProps = {
  companyData?: CompanyData;
};

const CompanyDetailsContent = ({ companyData }: CompanyDetailsContentProps) => {
  const navigate = useNavigate();

  const handleSeeAllDetails = () => {
    if (companyData?.session_id) {
      navigate(`${companyData.session_id}`, {
        state: { from: 'prospects' },
      });
    }
  };

  if (!companyData) {
    return null;
  }

  return (
    <>
      {/* Company Info Section */}
      <CompanyInfoSection companyData={companyData} />

      {/* Employees Section */}
      <IcpSection companyData={companyData} />

      {/* Browsing & Conversation Summary */}
      <BrowsingConversationSummary companyData={companyData} onSeeAllDetails={handleSeeAllDetails} />
    </>
  );
};

export default CompanyDetailsContent;
