import { useMemo } from 'react';

import OverviewDataItem, { OverviewDataItemProps } from './OverviewDataItem';
import { ActiveConversation } from '../../context/ActiveConversationsContext';
import { findFlagUrlByCountryName } from 'country-flags-svg';
import NumberUtil from '@meaku/core/utils/numberUtils';
import { ensureProtocol } from '@meaku/core/utils/index';

interface ContactDetailsCardProps {
  conversation: ActiveConversation;
}

const ContactDetailsCard = ({ conversation }: ContactDetailsCardProps) => {
  const dataItems: OverviewDataItemProps[] = useMemo(() => {
    const { name, email, country, company, company_demographics } = conversation.prospect;
    const { company_revenue, employee_count, website_url } = company_demographics;

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
        value: company,
      },
      {
        label: 'Revenue:',
        value: company_revenue,
        renderValue: (value?: number | string) => {
          return <span>{NumberUtil.formatCurrencyWithDenominaton(value)}</span>;
        },
      },
      {
        label: 'Company Size:',
        value: employee_count,
        renderValue: (value?: number | string) => {
          return <span>{NumberUtil.formatNumber(value)}</span>;
        },
      },
      {
        label: 'Domain:',
        value: ensureProtocol(website_url),
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
