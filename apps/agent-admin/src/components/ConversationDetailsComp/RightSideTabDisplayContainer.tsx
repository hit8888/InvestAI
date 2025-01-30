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
import { COMMON_SMALL_ICON_PROPS } from '../../utils/constants';
import LocationCellValue from '../tableComp/tableCellComp/LocationCellValue';

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
    <div className="relative w-[35%] justify-stretch self-stretch border-b border-l border-t border-primary/10">
      <div className="hide-scrollbar sticky top-0 flex max-h-screen w-full flex-col items-start overflow-auto">
        {/* Prospect Section */}
        <div className="flex w-full flex-col items-start gap-4 p-4">
          <p className="self-stretch text-lg font-semibold text-gray-900">Prospect</p>
          <div className="flex flex-col items-start self-stretch">
            <SingleItemDataDisplay
              itemLabel="Name:"
              itemIcon={<ProspectNameIcon {...COMMON_SMALL_ICON_PROPS} />}
              itemValue={prospect.name}
            />
            <SingleItemDataDisplay
              itemLabel="Email:"
              itemIcon={<ProspectEmailIcon {...COMMON_SMALL_ICON_PROPS} />}
              itemValue={prospect.email}
            />
            <SingleItemDataDisplay
              showBottomBorder={false}
              itemLabel="Location:"
              itemIcon={<LocationSmallIcon {...COMMON_SMALL_ICON_PROPS} />}
              itemValue={<LocationCellValue value={prospect.location} />}
            />
          </div>
        </div>

        {/* Company Section */}
        <div className="flex w-full flex-col items-start gap-4 border-t border-primary/10 p-4">
          <p className="self-stretch text-lg font-semibold text-gray-900">Company</p>
          <div className="flex flex-col items-start self-stretch">
            <SingleItemDataDisplay
              itemLabel="Name:"
              itemIcon={<CompanyNameIcon {...COMMON_SMALL_ICON_PROPS} />}
              itemValue={company.name}
            />
            <SingleItemDataDisplay
              itemLabel="Location:"
              itemIcon={<LocationSmallIcon {...COMMON_SMALL_ICON_PROPS} />}
              itemValue={<LocationCellValue value={company.location} />}
            />
            <SingleItemDataDisplay
              itemLabel="Revenue:"
              itemIcon={<CompanyRevenueIcon {...COMMON_SMALL_ICON_PROPS} />}
              itemValue={company.revenue}
            />
            <SingleItemDataDisplay
              itemLabel="Number of employees:"
              itemIcon={<CompanyNumberOfEmployeesIcon {...COMMON_SMALL_ICON_PROPS} />}
              itemValue={company.employees}
            />
            <SingleItemDataDisplay
              itemLabel="Domain:"
              itemIcon={<CompanyDomainIcon {...COMMON_SMALL_ICON_PROPS} />}
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
              itemIcon={<CompanyFoundationDate {...COMMON_SMALL_ICON_PROPS} />}
              itemValue={company.foundationDate}
            />
          </div>
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
        <div className="flex w-full justify-end">{itemValue}</div>
      )}
    </div>
  );
};

export default RightSideTabDisplayContainer;
