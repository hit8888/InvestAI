import { findFlagUrlByCountryName } from 'country-flags-svg';
import InfoChip from './InfoChip';
import LogoImage from '@breakout/design-system/components/LogoImage';
import { CompanyData } from './types';
import { ensureProtocol } from '@meaku/core/utils/index';
import NumberUtil from '@meaku/core/utils/numberUtils';

type CompanyInfoSectionProps = {
  companyData?: CompanyData;
};

const CompanyInfoSection = ({ companyData }: CompanyInfoSectionProps) => {
  if (!companyData) {
    return null;
  }

  const showInfoChips =
    companyData.hqLocation ||
    companyData.revenue ||
    companyData.employees ||
    companyData.atsUsed ||
    companyData.atsWebsiteUrl ||
    companyData.numOpenJobs;

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
          <InfoChip label="Revenue" value={NumberUtil.formatCurrencyWithDenominaton(companyData.revenue)} />
          <InfoChip label="Employees" value={NumberUtil.formatNumber(companyData.employees)} />
          {companyData.atsUsed && <InfoChip label="ATS" value={companyData.atsUsed} />}
          {companyData.atsWebsiteUrl && (
            <InfoChip label="ATS Website" value={companyData.atsWebsiteUrl} isLink={true} />
          )}
          {companyData.numOpenJobs !== undefined && companyData.numOpenJobs !== null && (
            <InfoChip label="Num Open Jobs" value={NumberUtil.formatNumber(companyData.numOpenJobs)} />
          )}
          {/* <InfoChip label="Visits" value={companyData.visits.toString()} /> */}
          {/* <InfoChip label="ATS" value={companyData.ats} /> */}
        </div>
      )}
    </div>
  );
};

export default CompanyInfoSection;
