import { cn } from '@breakout/design-system/lib/cn';
import { JSX } from 'react';

import {
  COMMON_SMALL_ICON_PROPS,
  COMPANY_DETAILS_DATA_ITEMS,
  PROSPECT_DETAILS_DATA_ITEMS,
} from '../../utils/constants';
import LocationCellValue from '../tableComp/tableCellComp/LocationCellValue';
import { getConversationRightSideDetailsItems } from '../../utils/common';
import { CompanyDetailsType, ProspectDetailsType } from '../../utils/admin-types';

const RightSideTabDisplayContainer = ({
  prospect,
  company,
}: {
  prospect: ProspectDetailsType;
  company: CompanyDetailsType;
}) => {
  const prospectItemsWithValue = getConversationRightSideDetailsItems(prospect, PROSPECT_DETAILS_DATA_ITEMS);
  const companyItemsWithValue = getConversationRightSideDetailsItems(company, COMPANY_DETAILS_DATA_ITEMS);

  if (!prospectItemsWithValue.length && !companyItemsWithValue.length) return;
  return (
    <div className="relative w-[35%] justify-stretch self-stretch border-b border-l border-t border-primary/10">
      <div className="hide-scrollbar sticky top-0 flex max-h-screen w-full flex-col items-start overflow-auto">
        {/* Prospect Section */}
        <div className="flex w-full flex-col items-start gap-4 p-4">
          <p className="self-stretch text-lg font-semibold text-gray-900">Prospect</p>
          <div className="flex flex-col items-start self-stretch">
            {prospectItemsWithValue.map((dataItem, index) => (
              <SingleItemDataDisplay
                showBottomBorder={index !== prospectItemsWithValue.length - 1}
                itemLabel={dataItem.itemLabel}
                itemIcon={<dataItem.ItemIcon {...COMMON_SMALL_ICON_PROPS} />}
                itemValue={dataItem.itemValue}
              />
            ))}
          </div>
        </div>

        {/* Company Section */}
        <div className="flex w-full flex-col items-start gap-4 border-t border-primary/10 p-4">
          <p className="self-stretch text-lg font-semibold text-gray-900">Company</p>
          <div className="flex flex-col items-start self-stretch">
            {companyItemsWithValue.map((dataItem, index) => (
              <SingleItemDataDisplay
                showBottomBorder={index !== companyItemsWithValue.length - 1}
                itemLabel={dataItem.itemLabel}
                itemIcon={<dataItem.ItemIcon {...COMMON_SMALL_ICON_PROPS} />}
                itemValue={dataItem.itemValue}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

type IProps = {
  itemLabel: string;
  itemIcon: JSX.Element;
  itemValue: string;
  showBottomBorder?: boolean;
};

const SingleItemDataDisplay = ({ itemLabel, itemIcon, itemValue, showBottomBorder = true }: IProps) => {
  let content = <span className="ml-auto text-base font-medium text-gray-900">{itemValue}</span>;
  switch (itemLabel) {
    case 'Location:':
      content = <LocationCellValue value={itemValue as string} />;
      break;
    case 'Domain:':
      content = (
        <a
          href={`https://${itemValue as string}`}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto text-blue-600 hover:underline"
        >
          {itemValue as string}
        </a>
      );
      break;
    default:
      break;
  }
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
      <div className="flex w-full justify-end">{content}</div>
    </div>
  );
};

export default RightSideTabDisplayContainer;
