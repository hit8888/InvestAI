import { JSX } from 'react';
import LocationCellValue from '../tableComp/tableCellComp/LocationCellValue';
import EmailCellValue from '../tableComp/tableCellComp/EmailCellValue';
import { cn } from '@breakout/design-system/lib/cn';
import { CONV_RIGHTSIDE_DETAILS_DATA_ITEMS } from '../../utils/constants';
import { LocationWithCityCountry } from '@meaku/core/types/admin/admin';

const { LOCATION, EMAIL, DOMAIN } = CONV_RIGHTSIDE_DETAILS_DATA_ITEMS;

type IProps = {
  itemLabel: string;
  itemIcon: JSX.Element;
  itemValue: string | LocationWithCityCountry;
  showBottomBorder?: boolean;
};

const SingleRightSideItemDataDisplay = ({ itemLabel, itemIcon, itemValue, showBottomBorder = true }: IProps) => {
  let content = <span className="ml-auto text-base font-medium text-gray-900">{itemValue as string}</span>;
  const isEmailField = itemLabel === EMAIL;
  switch (itemLabel) {
    case LOCATION:
      content = <LocationCellValue value={itemValue} />;
      break;
    case EMAIL:
      content = <EmailCellValue value={itemValue as string} valueOrientation="right" />;
      break;
    case DOMAIN:
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
        'items-center': isEmailField,
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

export default SingleRightSideItemDataDisplay;
