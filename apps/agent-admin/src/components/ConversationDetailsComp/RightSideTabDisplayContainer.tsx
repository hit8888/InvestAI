import { cn } from '@breakout/design-system/lib/cn';
import { JSX } from 'react';

import CompanyNameIcon from '@breakout/design-system/components/icons/company-name-icon';
import ProspectNameIcon from '@breakout/design-system/components/icons/prospect-name-icon';
import ProspectEmailIcon from '@breakout/design-system/components/icons/prospect-email-icon';
import CompanyDomainIcon from '@breakout/design-system/components/icons/company-domain-icon';
import CompanyFoundationDate from '@breakout/design-system/components/icons/company-foundation-date';
import CompanyNumberOfEmployeesIcon from '@breakout/design-system/components/icons/company-numberofemployees-icon';
import CompanyRevenueIcon from '@breakout/design-system/components/icons/company-revenue-icon';
import LocationSmallIcon from '@breakout/design-system/components/icons/location-icon';

const IconPropsValue = {
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
  color: 'rgb(var(--primary))',
};
const RightSideTabDisplayContainer = ({
  prospect,
  company,
}: {
  prospect: { name: string; email: string; location: string };
  company: {
    name: string;
    logoUrl?: string;
    location: string;
    revenue: string;
    employees: string;
    domain: string;
    foundationDate: string;
  };
}) => {
  return (
    <div className="flex w-[35%] flex-col items-start self-stretch border-b border-l border-t border-primary/10">
      {/* Prospect Section */}
      <div className="flex w-full flex-col items-start gap-4 p-4">
        <p className="self-stretch text-lg font-semibold text-gray-900">Prospect</p>
        <div className="flex flex-col items-start self-stretch">
          <SingleItemDataDisplay
            itemLabel="Name:"
            itemIcon={<ProspectNameIcon {...IconPropsValue} />}
            itemValue={prospect.name}
          />
          <SingleItemDataDisplay
            itemLabel="Email:"
            itemIcon={<ProspectEmailIcon {...IconPropsValue} />}
            itemValue={prospect.email}
          />
          <SingleItemDataDisplay
            showBottomBorder={false}
            itemLabel="Location:"
            itemIcon={<LocationSmallIcon {...IconPropsValue} />}
            itemValue={prospect.location}
          />
        </div>
      </div>

      {/* Company Section */}
      <div className="flex w-full flex-col items-start gap-4 border-t border-primary/10 p-4">
        <p className="self-stretch text-lg font-semibold text-gray-900">Company</p>
        <div className="flex flex-col items-start self-stretch">
          <SingleItemDataDisplay
            itemLabel="Name:"
            itemIcon={<CompanyNameIcon {...IconPropsValue} />}
            itemValue={company.name}
          />
          <SingleItemDataDisplay
            itemLabel="Location:"
            itemIcon={<LocationSmallIcon {...IconPropsValue} />}
            itemValue={company.location}
          />
          <SingleItemDataDisplay
            itemLabel="Revenue:"
            itemIcon={<CompanyRevenueIcon {...IconPropsValue} />}
            itemValue={company.revenue}
          />
          <SingleItemDataDisplay
            itemLabel="Number of employees:"
            itemIcon={<CompanyNumberOfEmployeesIcon {...IconPropsValue} />}
            itemValue={company.employees}
          />
          <SingleItemDataDisplay
            itemLabel="Domain:"
            itemIcon={<CompanyDomainIcon {...IconPropsValue} />}
            itemValue={
              <a
                href={`https://${company.domain}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto text-blue-600 hover:underline"
              >
                {company.domain}
              </a>
            }
          />
          <SingleItemDataDisplay
            showBottomBorder={false}
            itemLabel="Foundation Date:"
            itemIcon={<CompanyFoundationDate {...IconPropsValue} />}
            itemValue={company.foundationDate}
          />
        </div>
      </div>
    </div>
  );
};

type IProps = {
  itemLabel: string;
  itemIcon: JSX.Element;
  itemValue: JSX.Element | string;
  showBottomBorder?: boolean;
};

const SingleItemDataDisplay = ({ itemLabel, itemIcon, itemValue, showBottomBorder = true }: IProps) => {
  const isItemValueString = typeof itemValue === 'string';
  return (
    <div
      className={cn('flex items-start self-stretch px-2 py-4', {
        'border-b border-dashed border-primary/20': showBottomBorder,
      })}
    >
      <div className="flex items-center justify-center gap-2">
        <div className="flex items-center justify-center gap-2 rounded-lg bg-primary/10 p-1">{itemIcon}</div>
        <span className="text-sm font-medium text-gray-500">{itemLabel}</span>
      </div>
      {isItemValueString ? (
        <span className="ml-auto text-base font-medium text-gray-900">{itemValue}</span>
      ) : (
        <>{itemValue}</>
      )}
    </div>
  );
};

export default RightSideTabDisplayContainer;
