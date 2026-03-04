import { useMemo } from 'react';

import OverviewDataItem, { OverviewDataItemProps } from './OverviewDataItem';
import { ActiveConversation } from '../../context/ActiveConversationsContext';
import { findFlagUrlByCountryName } from 'country-flags-svg';
import NumberUtil from '@neuraltrade/core/utils/numberUtils';
import { ensureProtocol } from '@neuraltrade/core/utils/index';

interface ContactDetailsCardProps {
  conversation: ActiveConversation;
}

const ContactDetailsCard = ({ conversation }: ContactDetailsCardProps) => {
  const dataItems: OverviewDataItemProps[] = useMemo(() => {
    const { name, email, country, company, core_company, company_demographics } = conversation.prospect;

    const companyName = core_company?.name || company_demographics?.company_name || company || '';
    const companyRevenue = core_company?.annual_revenue || company_demographics?.company_revenue || '';
    const companyEmployeeCount = core_company?.employee_count || company_demographics?.employee_count || '';
    const companyWebsiteUrl = core_company?.domain || company_demographics?.website_url || '';

    return [
      {
        label: 'Name:',
        value: name,
      },
      {
        label: 'Email:',
        value: email,
      },
      {
        label: 'Location:',
        value: country,
        renderValue: (value: unknown) => {
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
        label: 'Company:',
        value: companyName,
      },
      {
        label: 'Revenue:',
        value: companyRevenue,
        renderValue: (value?: number | string) => {
          return <span>{NumberUtil.formatCurrencyWithDenominaton(value)}</span>;
        },
      },
      {
        label: 'Company Size:',
        value: companyEmployeeCount,
        renderValue: (value?: number | string) => {
          return <span>{NumberUtil.formatNumber(value)}</span>;
        },
      },
      {
        label: 'Domain:',
        value: ensureProtocol(companyWebsiteUrl),
        renderValue: (value: unknown) => {
          const url = value as string;
          return (
            <a target="_blank" rel="noopener noreferrer" className="text-blue_sec-1000" href={url}>
              {url}
            </a>
          );
        },
      },
    ].filter((item) => !!item.value);
  }, [conversation.prospect]);

  if (dataItems.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col rounded-lg bg-white p-4 shadow-md">
      {dataItems.map((dataItem) => (
        <OverviewDataItem key={dataItem.label} {...dataItem} />
      ))}
    </div>
  );
};

export default ContactDetailsCard;
