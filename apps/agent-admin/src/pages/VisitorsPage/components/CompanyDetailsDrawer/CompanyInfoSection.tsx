import { findFlagUrlByCountryName } from 'country-flags-svg';
import InfoChip from './InfoChip';
import LogoImage from '@breakout/design-system/components/LogoImage';
import { CompanyData } from './types';
import { ensureProtocol } from '@meaku/core/utils/index';

type CompanyInfoSectionProps = {
  companyData?: CompanyData;
};

const CompanyInfoSection = ({ companyData }: CompanyInfoSectionProps) => {
  if (!companyData) {
    return null;
  }

  const showInfoChips = companyData.hqLocation || companyData.revenue || companyData.employees;

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 p-4">
      {/* Company Header */}
      <div className="flex items-center gap-3">
        {/* Company Logo */}
        <div className="h-11 w-11">
          <LogoImage src={companyData.logo} placeholderText={companyData.name} />
        </div>

        {/* Company Name and Website */}
        <div className="flex flex-col gap-1">
          <h2 className="text-base font-medium text-gray-900">{companyData.name}</h2>
          <a
            href={ensureProtocol(companyData.website)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue_sec-1000"
          >
            {companyData.website}
          </a>
        </div>
      </div>

      {/* Company Info Chips */}
      {showInfoChips && (
        <div className="flex flex-wrap gap-2.5">
          <InfoChip
            label="HQ loc"
            value={companyData.hqLocation}
            iconUrl={findFlagUrlByCountryName(companyData.hqLocation)}
          />
          {/* <InfoChip label="Relevance" value={companyData.relevance} /> */}
          <InfoChip label="Revenue" value={companyData.revenue} />
          <InfoChip label="Employees" value={companyData.employees} />
          {/* <InfoChip label="Visits" value={companyData.visits.toString()} /> */}
          {/* <InfoChip label="ATS" value={companyData.ats} /> */}
        </div>
      )}
    </div>
  );
};

export default CompanyInfoSection;
