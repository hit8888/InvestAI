import { JSX } from 'react';
import LocationCellValue from '../tableComp/tableCellComp/LocationCellValue';
import EmailCellValue from '../tableComp/tableCellComp/EmailCellValue';
import { cn } from '@breakout/design-system/lib/cn';
import { CONV_RIGHTSIDE_DETAILS_DATA_ITEMS } from '../../utils/constants';
import { EnrichmentSource, LocationWithCityCountry } from '@meaku/core/types/admin/admin';
import EnrichmentTag from '@breakout/design-system/components/EnrichmentTag/index';
import { useTextTruncation } from '@breakout/design-system/hooks/useTextTruncation';
import TooltipWrapperDark from '@breakout/design-system/components/Tooltip/TooltipWrapperDark';
import { Link } from 'react-router-dom';
import { ensureProtocol, extractLinkedInUsername } from '@meaku/core/utils/index';

const { LOCATION, EMAIL, LINKED_IN, DOMAIN } = CONV_RIGHTSIDE_DETAILS_DATA_ITEMS;

type IProps = {
  itemLabel: string;
  itemIcon: JSX.Element;
  itemValue: string | LocationWithCityCountry;
  showBottomBorder?: boolean;
  isKeyValueColumnwise?: boolean;
  itemLabelWidth?: string;
  enrichmentSource: EnrichmentSource | string;
};

const SingleProspectAndCompanyItemDataDisplay = ({
  itemLabel,
  itemIcon: ItemIcon,
  itemValue,
  showBottomBorder = true,
  isKeyValueColumnwise = false,
  itemLabelWidth,
  enrichmentSource,
}: IProps) => {
  const { textRef, isTextTruncated } = useTextTruncation({
    text: itemValue as string,
  });
  let content = (
    <div className="max-w-full">
      <TooltipWrapperDark
        tooltipSide="top"
        tooltipAlign="end"
        tooltipSideOffsetValue={15}
        trigger={
          <span
            ref={textRef}
            className={cn('text-base font-medium capitalize text-gray-900', {
              'text-left': isKeyValueColumnwise,
              'line-clamp-1 w-full max-w-56 truncate text-right': !isKeyValueColumnwise,
            })}
          >
            {itemValue as string}
          </span>
        }
        showTooltip={isTextTruncated}
        content={<p className="max-w-[350px] capitalize">{itemValue as string}</p>}
      />
    </div>
  );
  const isEmailField = itemLabel === EMAIL;
  switch (itemLabel) {
    case LOCATION:
      content = <LocationCellValue isValueOrientationRight value={itemValue} />;
      break;
    case EMAIL:
      content = <EmailCellValue value={itemValue as string} valueOrientation="right" />;
      break;
    case LINKED_IN:
      content = (
        <Link
          to={itemValue as string}
          target="_blank"
          className={cn('text-base font-normal text-blue_sec-1000', {
            'text-left': isKeyValueColumnwise,
            'line-clamp-1 w-full max-w-56 truncate text-right': !isKeyValueColumnwise,
          })}
        >
          {extractLinkedInUsername(itemValue as string) || (itemValue as string)}
        </Link>
      );
      break;
    case DOMAIN:
      content = (
        <a
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue_sec-1000"
          href={ensureProtocol(itemValue as string)}
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
      className={cn('flex w-full items-start self-stretch px-2 py-4', {
        'border-b border-dashed border-primary/20': showBottomBorder,
        'border-solid border-gray-200': showBottomBorder && isKeyValueColumnwise,
        'items-center': isEmailField,
        'flex-col items-center gap-2': isKeyValueColumnwise,
      })}
    >
      <div className={cn('flex items-center justify-start gap-2', itemLabelWidth || 'w-[40%]')}>
        <div className="flex items-center justify-center gap-2 rounded-lg bg-primary/10 p-1">{ItemIcon}</div>
        <span className="w-full text-sm font-medium text-gray-500">{itemLabel}</span>
      </div>
      <div
        className={cn('flex w-[60%] items-center justify-end gap-2', {
          'justify-start': isKeyValueColumnwise,
          'w-[100%]': !itemLabelWidth,
          'w-[80%]': itemLabelWidth === 'w-[20%]',
          'w-[50%]': itemLabelWidth === 'w-[50%]',
        })}
      >
        {content}
        <EnrichmentTag enrichmentSource={enrichmentSource} />
      </div>
    </div>
  );
};

export default SingleProspectAndCompanyItemDataDisplay;
