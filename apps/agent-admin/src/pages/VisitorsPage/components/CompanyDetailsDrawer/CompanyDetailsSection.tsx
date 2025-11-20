import { findFlagUrlByCountryName } from 'country-flags-svg';
import LogoImage from '@breakout/design-system/components/LogoImage';
import { CompanyData } from './types';
import { ensureProtocol } from '@meaku/core/utils/index';
import NumberUtil from '@meaku/core/utils/numberUtils';
import Typography from '@breakout/design-system/components/Typography/index';
import InfoChip from './InfoChip';
import AssignRepValue from '../../../../components/ConversationDetailsComp/AssignRepValue';
import AiSparklesIcon from '@breakout/design-system/components/icons/ai-sparkles-icon';

type CompanyInfoSectionProps = {
  companyData: CompanyData | null;
};

const CompanyInfoSection = ({ companyData }: CompanyInfoSectionProps) => {
  if (!companyData) {
    return null;
  }

  const fromEnrichment = companyData?.enrichmentSource === 'ip_enrichment';
  const showInfoChips = !!companyData.relevance || !!companyData.atsUsed || !!companyData.numOpenJobs;

  return (
    <div>
      <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-gray-25 p-4">
        {/* Company Header */}
        <div className="flex items-center gap-2">
          <div className="flex flex-1 items-center gap-3">
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
          <div className="flex items-center justify-end gap-2">
            {fromEnrichment && (
              <div className="rounded-2xl bg-gray-100 px-2 py-1">
                <div className="flex items-center gap-1">
                  <AiSparklesIcon className="h-4 w-4 text-gray-900" />
                  <Typography variant="caption-12-normal">Enrichment</Typography>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="h-[1px] w-full bg-gray-100" />

        <div className="flex justify-between gap-2">
          <div className="flex flex-1 flex-col gap-4">
            <div className="flex">
              <Typography variant="caption-12-normal" textColor="textSecondary" className="inline w-20 shrink-0">
                HQ
              </Typography>
              <Typography variant="caption-12-normal" textColor="textSecondary" className="inline px-3">
                :
              </Typography>
              <Typography variant="caption-12-normal" className="inline capitalize">
                {companyData?.hqLocation || '-'}
                &nbsp;
                {companyData?.hqLocation && (
                  <span className="h-5.5 w-5.5 bg-white/32 inline-flex items-center justify-center rounded-full">
                    <img
                      src={findFlagUrlByCountryName(companyData.hqLocation)}
                      width={16}
                      height={16}
                      alt="flag-icon"
                      className="overflow-hidden"
                    />
                  </span>
                )}
              </Typography>
            </div>

            <div className="flex">
              <Typography variant="caption-12-normal" textColor="textSecondary" className="inline w-20 shrink-0">
                Revenue
              </Typography>
              <Typography variant="caption-12-normal" textColor="textSecondary" className="inline px-3">
                :
              </Typography>
              <Typography variant="caption-12-normal" className="inline">
                {companyData?.revenue ? NumberUtil.formatCurrencyWithDenominaton(companyData.revenue) : '-'}
              </Typography>
            </div>

            <div className="flex">
              <Typography variant="caption-12-normal" textColor="textSecondary" className="inline w-20 shrink-0">
                Employees
              </Typography>
              <Typography variant="caption-12-normal" textColor="textSecondary" className="inline px-3">
                :
              </Typography>
              <Typography variant="caption-12-normal" className="inline">
                {companyData?.employees ? NumberUtil.formatNumber(companyData.employees) : '-'}
              </Typography>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            {showInfoChips && (
              <div className="flex flex-wrap justify-end gap-2">
                {!!companyData.relevance && <InfoChip label="Relevance" value={companyData.relevance} />}
                {!!companyData.atsUsed && <InfoChip label="ATS" value={companyData.atsUsed} />}
                {!!companyData.numOpenJobs && (
                  <InfoChip label="Num Open Jobs" value={NumberUtil.formatNumber(companyData.numOpenJobs)} />
                )}
              </div>
            )}
            {!!companyData?.prospect?.sdr_assignment && (
              <InfoChip
                label="Rep"
                content={
                  <AssignRepValue
                    listValue={companyData.prospect.sdr_assignment}
                    prospectId={companyData.prospect.prospect_id}
                  />
                }
                className="w-fit bg-orange-100 py-0"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyInfoSection;
