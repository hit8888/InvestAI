import {
  COMMON_SMALL_ICON_PROPS,
  COMPANY_DETAILS_DATA_ITEMS,
  PROSPECT_DETAILS_DATA_ITEMS,
  STICKY_TOP_VALUE_CONVERSATION_DETAILS_PAGE,
} from '../../utils/constants';
import { getConversationRightSideDetailsItems } from '../../utils/common';
import SingleProspectAndCompanyItemDataDisplay from './SingleProspectAndCompanyItemDataDisplay';
import { TransformedProspectAndCompanyDetailsContent } from '@meaku/core/types/admin/admin';

const ProspectAndCompanyDetailsDisplayContainer = ({
  prospect,
  company,
}: TransformedProspectAndCompanyDetailsContent) => {
  const prospectItemsWithValue = getConversationRightSideDetailsItems(prospect, PROSPECT_DETAILS_DATA_ITEMS);
  const companyItemsWithValue = getConversationRightSideDetailsItems(company, COMPANY_DETAILS_DATA_ITEMS);

  const isProspectItemsEmpty = !prospectItemsWithValue.length;
  const isCompanyItemsEmpty = !companyItemsWithValue.length;

  if (isProspectItemsEmpty && isCompanyItemsEmpty) return;
  return (
    <div className="relative w-[35%] justify-stretch self-stretch border-b border-l border-primary/10">
      <div
        className="hide-scrollbar sticky flex max-h-screen w-full flex-col items-start overflow-auto"
        style={{
          top: `${STICKY_TOP_VALUE_CONVERSATION_DETAILS_PAGE}px`,
        }}
      >
        {/* Prospect Section */}
        {!isProspectItemsEmpty && (
          <div className="flex w-full flex-col items-start gap-4 p-4">
            <p className="self-stretch text-lg font-semibold text-gray-900">Prospect</p>
            <div className="flex flex-col items-start self-stretch">
              {prospectItemsWithValue.map((dataItem, index) => (
                <SingleProspectAndCompanyItemDataDisplay
                  key={`prospect-${index}`}
                  itemLabelWidth={'w-[20%]'}
                  showBottomBorder={index !== prospectItemsWithValue.length - 1}
                  itemLabel={dataItem.itemLabel}
                  itemIcon={<dataItem.ItemIcon {...COMMON_SMALL_ICON_PROPS} />}
                  itemValue={dataItem.itemValue}
                  enrichmentSource={prospect.enrichmentSource}
                />
              ))}
            </div>
          </div>
        )}

        {/* Company Section */}
        {!isCompanyItemsEmpty && (
          <div className="flex w-full flex-col items-start gap-4 border-t border-primary/10 p-4">
            <p className="self-stretch text-lg font-semibold text-gray-900">Company</p>
            <div className="flex flex-col items-start self-stretch">
              {companyItemsWithValue.map((dataItem, index) => (
                <SingleProspectAndCompanyItemDataDisplay
                  key={`company-${index}`}
                  itemLabelWidth={'w-[50%]'}
                  showBottomBorder={index !== companyItemsWithValue.length - 1}
                  itemLabel={dataItem.itemLabel}
                  itemIcon={<dataItem.ItemIcon {...COMMON_SMALL_ICON_PROPS} />}
                  itemValue={dataItem.itemValue}
                  enrichmentSource={company.enrichmentSource}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProspectAndCompanyDetailsDisplayContainer;
