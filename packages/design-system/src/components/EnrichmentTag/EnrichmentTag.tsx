import CrmIcon from '../icons/crm_enrichment_icon.tsx';
import OutboundCampaignIcon from '../icons/outbound_campaign_enrichment_icon.tsx';
import UserInputIcon from '../icons/user_input_enrichment_icon.tsx';
import AiIcon from '../icons/ai_enrichment_icon.tsx';
import TooltipWrapperDark from '../Tooltip/TooltipWrapperDark.tsx';
import { EnrichmentSource } from '@meaku/core/types/admin/admin';
import { ReactElement } from 'react';

const ENRICHMENT_SOURCE_TO_DISPLAY_CONFIG: Record<
  EnrichmentSource,
  {
    icon: ReactElement;
    tooltipContent: string;
  }
> = {
  crm_extracted: {
    icon: <CrmIcon />,
    tooltipContent: 'From CRM',
  },
  utm_extracted: {
    icon: <OutboundCampaignIcon />,
    tooltipContent: 'From Outbound Campaign',
  },
  user_provided: {
    icon: <UserInputIcon />,
    tooltipContent: 'From User Input',
  },
  ip_enrichment: {
    icon: <AiIcon />,
    tooltipContent: 'From AI',
  },
};

type EnrichmentTagProps = {
  enrichmentSource?: EnrichmentSource | null | string;
};

const isValidEnrichmentSource = (
  enrichmentSource: EnrichmentTagProps['enrichmentSource'],
): enrichmentSource is EnrichmentSource => {
  return (
    enrichmentSource !== undefined &&
    enrichmentSource !== null &&
    enrichmentSource in ENRICHMENT_SOURCE_TO_DISPLAY_CONFIG
  );
};

const EnrichmentTag = ({ enrichmentSource }: EnrichmentTagProps) => {
  if (!isValidEnrichmentSource(enrichmentSource)) return null;

  const config = ENRICHMENT_SOURCE_TO_DISPLAY_CONFIG[enrichmentSource];

  return (
    <TooltipWrapperDark
      showTooltip
      content={config.tooltipContent}
      trigger={config.icon}
      tooltipAlign="center"
      tooltipSide="top"
      tooltipSideOffsetValue={5}
      tooltipArrowClassName="!relative !right-0"
    />
  );
};

export default EnrichmentTag;
