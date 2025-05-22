import { ChevronUp, ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ActiveConversation } from '../../context/ActiveConversationsContext';
import { BuyerIntent } from '@meaku/core/types/common';
import SummaryIcon from '@breakout/design-system/components/icons/summary-icon';
import PersonIcon from '@breakout/design-system/components/icons/person-icon';
import EmailIcon from '@breakout/design-system/components/icons/email-icon';
import LocationSmallIcon from '@breakout/design-system/components/icons/location-icon';
import MagnifyingLensIcon from '@breakout/design-system/components/icons/magnifying-lens-icon';
import OfficeBagIcon from '@breakout/design-system/components/icons/office-bag-icon';
import CashIcon from '@breakout/design-system/components/icons/cash-icon';
import CommunityIcon from '@breakout/design-system/components/icons/community-icon';
import DomianIcon from '@breakout/design-system/components/icons/domain-icon';
import { findFlagUrlByCountryName } from 'country-flags-svg';
import BuyerIntentChip from './BuyerIntentChip';
import OverviewDataItems, { OverviewDataItem } from './OverviewDataItems';
import { CHAT_SUMMARY_TRIM_LENGTH } from '../../utils/constants';
import { useActiveConversationDetails } from '../../context/ActiveConversationDetailsContext';

interface ConversationOverviewProps {
  conversation: ActiveConversation;
}

const ConversationOverview = ({ conversation }: ConversationOverviewProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasProspectData, setHasProspectData] = useState(false);
  const [hasCompanyData, setHasCompanyData] = useState(false);

  const Icon = isExpanded ? ChevronUp : ChevronDown;
  const { name, email, country, company, company_demographics } = conversation.prospect;
  const { buyer_intent: buyerIntent } = conversation;
  const { company_revenue, employee_count, website_url } = company_demographics;

  const dataItemIcon = (Icon: React.ComponentType<{ width: number; height: number }>) => (
    <Icon width={16} height={16} />
  );

  const prospectDataItems: OverviewDataItem[] = [
    {
      key: 'name',
      label: 'Name:',
      icon: dataItemIcon(PersonIcon),
      value: name,
    },
    {
      key: 'email',
      label: 'Email:',
      icon: dataItemIcon(EmailIcon),
      value: email,
    },
    {
      key: 'location',
      label: 'Location:',
      icon: dataItemIcon(LocationSmallIcon),
      value: country,
      renderFn: (value: unknown) => {
        const country = value as string | null;
        const countryFlagUrl = country ? findFlagUrlByCountryName(country) : '';
        return (
          <div className="flex gap-2">
            {countryFlagUrl ? <img src={countryFlagUrl} width={20} height={20} /> : null}
            <span>{country}</span>
          </div>
        );
      },
    },
    {
      key: 'intentScore',
      label: 'Intent Score:',
      icon: dataItemIcon(MagnifyingLensIcon),
      value: buyerIntent,
      renderFn: (buyerIntent: unknown) => <BuyerIntentChip buyerIntent={buyerIntent as BuyerIntent} />,
    },
  ];

  const companyDataItems: OverviewDataItem[] = [
    {
      key: 'name',
      label: 'Name:',
      icon: dataItemIcon(OfficeBagIcon),
      value: company,
    },
    {
      key: 'revenue',
      label: 'Revenue:',
      icon: dataItemIcon(CashIcon),
      value: company_revenue,
    },
    {
      key: 'company-size',
      label: 'Company Size:',
      icon: dataItemIcon(CommunityIcon),
      value: employee_count,
      renderFn: (value: unknown) => {
        return value ? <span>{(value as number).toLocaleString()}</span> : null;
      },
    },
    {
      key: 'domain',
      label: 'Domain:',
      icon: dataItemIcon(DomianIcon),
      value: website_url,
      renderFn: (value: unknown) => {
        const url = value as string;
        return (
          <a target="_blank" className="text-blue_sec-1000" href={url}>
            {url}
          </a>
        );
      },
    },
  ];

  useEffect(() => {
    const isRenderingProspectData = prospectDataItems.filter((prospectData) => !!prospectData.value).length > 0;
    const isRenderingCompanyData = companyDataItems.filter((companyData) => !!companyData.value).length > 0;

    setHasProspectData(isRenderingProspectData);
    setHasCompanyData(isRenderingCompanyData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversation, setHasProspectData, setHasCompanyData]);

  const onToggleView = () => {
    setIsExpanded((toggle) => !toggle);
  };

  const activeClasses = isExpanded ? 'ring ring-4 ring-primary/40' : '';
  const sectionBorderClass = 'pb-5 border-b-2 border-dashed';

  return (
    <div className="relative">
      <div
        onClick={onToggleView}
        className={`flex cursor-pointer items-center gap-2 rounded-lg rounded-md border border-primary bg-[#F6F6FD] px-3 py-1.5 text-sm font-medium text-primary transition-colors ${activeClasses}`}
      >
        <span>Overview</span>
        <Icon size={16} className="text-bluegray-1000" />
      </div>

      {isExpanded ? (
        <div className="absolute right-0 top-[115%] z-30 w-96 rounded-2xl border border-gray-200 bg-white p-4 shadow-md">
          <Summary className={`${hasProspectData || hasCompanyData ? sectionBorderClass : ''}`} />

          {hasProspectData ? (
            <OverviewDataItems
              title="Prospect"
              dataItems={prospectDataItems}
              className={`${hasCompanyData ? sectionBorderClass : ''}`}
            />
          ) : null}

          {hasCompanyData ? <OverviewDataItems title="Company" dataItems={companyDataItems} /> : null}
        </div>
      ) : null}
    </div>
  );
};

const Summary = ({ className }: { className: string }) => {
  const [showTrimmed, setShowTrimmed] = useState(true);
  const Icon = showTrimmed ? ChevronDown : ChevronUp;
  const showMoreButtonText = showTrimmed ? 'Show More' : 'Show Less';
  const { chatSummary } = useActiveConversationDetails();

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex flex-1 items-center gap-2">
        <div className="flex items-center justify-center rounded-lg bg-primary/10 px-1 py-1.5">
          <SummaryIcon className="text-primary" />
        </div>
        <p className="text-sm font-medium text-gray-500">Summary:</p>
      </div>

      <p className="text-sm text-gray-900">
        {showTrimmed ? `${chatSummary.substring(0, CHAT_SUMMARY_TRIM_LENGTH)}...` : chatSummary}
      </p>

      <div
        onClick={() => setShowTrimmed((showMore) => !showMore)}
        className={`flex cursor-pointer items-center gap-2 self-end rounded-md px-3 py-1.5 text-sm font-medium text-primary`}
      >
        <span>{showMoreButtonText}</span>
        <Icon size={16} className="text-bluegray-1000" />
      </div>
    </div>
  );
};

export default ConversationOverview;
