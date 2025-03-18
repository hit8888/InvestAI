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
  isKeyValueColumnwise?: boolean;
};

const SingleRightSideItemDataDisplay = ({
  itemLabel,
  itemIcon,
  itemValue,
  showBottomBorder = true,
  isKeyValueColumnwise = false,
}: IProps) => {
  let content = (
    <span
      className={cn('text-base font-medium text-gray-900', {
        'text-left': isKeyValueColumnwise,
        'w-full max-w-full truncate text-right': !isKeyValueColumnwise,
      })}
    >
      {itemValue as string}
    </span>
  );
  const isEmailField = itemLabel === EMAIL;
  switch (itemLabel) {
    case LOCATION:
      content = <LocationCellValue isValueOrientationRight value={itemValue} />;
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
          className="w-full max-w-full truncate text-right text-blue-600 hover:underline"
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
      className={cn('flex w-full items-start gap-4 self-stretch px-2 py-4', {
        'border-b border-dashed border-primary/20': showBottomBorder,
        'border-solid border-gray-200': showBottomBorder && isKeyValueColumnwise,
        'items-center': isEmailField,
        'flex-col items-center gap-2': isKeyValueColumnwise,
      })}
    >
      <div className="flex w-[40%] items-center justify-start gap-2">
        <div className="flex items-center justify-center gap-2 rounded-lg bg-primary/10 p-1">{itemIcon}</div>
        <span className="text-sm font-medium text-gray-500">{itemLabel}</span>
      </div>
      <div
        className={cn('flex w-[60%] justify-end', {
          'justify-start': isKeyValueColumnwise,
        })}
      >
        {content}
      </div>
    </div>
  );
};

export default SingleRightSideItemDataDisplay;
