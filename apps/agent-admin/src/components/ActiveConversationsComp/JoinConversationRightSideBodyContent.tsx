import { useState } from 'react';
import { CompanyDetailsType, ProspectDetailsType } from '../../utils/admin-types';
import { getConversationRightSideDetailsItems } from '../../utils/common';
import {
  COMMON_SMALL_ICON_PROPS,
  COMPANY_DETAILS_DATA_ITEMS,
  DEFAULT_SUMMARY_VALUE,
  PROSPECT_DETAILS_DATA_ITEMS,
} from '../../utils/constants';
import { cn } from '@breakout/design-system/lib/cn';
import ActiveConvRightSideOverviewIcon from '@breakout/design-system/components/icons/active-conv-rightside-overview-icon';
import ActiveConvOverviewCollapseIcon from '@breakout/design-system/components/icons/active-conv-overview-collapse-icon';
import ActiveConvOverviewExtendIcon from '@breakout/design-system/components/icons/active-conv-overview-extend-icon';
import ActiveConvSummaryItemIcon from '@breakout/design-system/components/icons/active-conv-summary-item-icon';
import Separator from '@breakout/design-system/components/layout/separator';
import SingleProspectAndCompanyItemDataDisplay from '../ConversationDetailsComp/SingleProspectAndCompanyItemDataDisplay';

const JoinConversationRightSideBodyContent = ({
  prospect,
  company,
  hasJoinedConversation,
}: {
  prospect: ProspectDetailsType;
  company: CompanyDetailsType;
  hasJoinedConversation: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const prospectItemsWithValue = getConversationRightSideDetailsItems(prospect, PROSPECT_DETAILS_DATA_ITEMS);
  const companyItemsWithValue = getConversationRightSideDetailsItems(company, COMPANY_DETAILS_DATA_ITEMS);

  const isProspectItemsEmpty = !prospectItemsWithValue.length;
  const isCompanyItemsEmpty = !companyItemsWithValue.length;

  if (!hasJoinedConversation) return null;
  if (isProspectItemsEmpty && isCompanyItemsEmpty) return;
  return (
    <div
      className={cn('hide-scrollbar sticky top-10 z-50 flex max-h-[calc(90vh-120px)] w-full overflow-auto', {
        'w-72': isOpen,
        'w-16': !isOpen,
      })}
    >
      <div
        className="flex h-full w-full flex-col items-start gap-4 rounded-[8px_8px_16px_16px] border border-gray-200 bg-white p-4"
        style={{
          boxShadow: '0px 0px 170px 0px rgba(208, 213, 221, 0.08)',
        }}
      >
        <div
          className={cn('flex w-full items-center gap-4', {
            'flex-col': !isOpen,
            'border-b-2 border-dashed border-gray-200 pb-4': isOpen,
          })}
        >
          <div className="flex flex-1 items-center gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/5">
              <ActiveConvRightSideOverviewIcon className="h-6 w-6 text-primary" />
            </div>
            {isOpen && <p className="text-base font-medium text-gray-900">Overview</p>}
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-primary/20 bg-primary/2.5 opacity-80"
          >
            {isOpen ? (
              <ActiveConvOverviewCollapseIcon className="h-6 w-6 text-primary" />
            ) : (
              <ActiveConvOverviewExtendIcon className="h-6 w-6 text-primary" />
            )}
          </button>
        </div>
        {isOpen && (
          <div className="flex w-full flex-col items-start gap-4 rounded-lg border border-gray-200 bg-primary/2.5 p-4">
            {!isProspectItemsEmpty && (
              <div className="flex flex-col items-start self-stretch">
                {prospectItemsWithValue.map((dataItem, index) => (
                  <SingleProspectAndCompanyItemDataDisplay
                    isKeyValueColumnwise={true}
                    showBottomBorder={index !== prospectItemsWithValue.length - 1}
                    itemLabel={dataItem.itemLabel}
                    itemIcon={<dataItem.ItemIcon {...COMMON_SMALL_ICON_PROPS} />}
                    itemValue={dataItem.itemValue}
                  />
                ))}
              </div>
            )}
            <Separator className="w-full bg-gray-200" />
            <SingleProspectAndCompanyItemDataDisplay
              isKeyValueColumnwise={true}
              showBottomBorder={true}
              itemLabel={'Summary:'}
              itemIcon={<ActiveConvSummaryItemIcon {...COMMON_SMALL_ICON_PROPS} />}
              itemValue={DEFAULT_SUMMARY_VALUE}
            />
            {!isCompanyItemsEmpty && (
              <div className="flex flex-col items-start self-stretch">
                {companyItemsWithValue.map((dataItem, index) => (
                  <SingleProspectAndCompanyItemDataDisplay
                    isKeyValueColumnwise={true}
                    showBottomBorder={index !== companyItemsWithValue.length - 1}
                    itemLabel={dataItem.itemLabel}
                    itemIcon={<dataItem.ItemIcon {...COMMON_SMALL_ICON_PROPS} />}
                    itemValue={dataItem.itemValue}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JoinConversationRightSideBodyContent;
