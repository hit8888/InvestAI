import Separator from '@breakout/design-system/components/layout/separator';
import LocationCellValue from '../tableComp/tableCellComp/LocationCellValue';
import BuyerIntentCellValue from '../tableComp/tableCellComp/BuyerIntentCellValue';
import ActiveConvNoCompanyIcon from '@breakout/design-system/components/icons/active-conv-no-company-icon';
import { cn } from '@breakout/design-system/lib/cn';

type IConversationBasicAndBuyerIntentLabelContainerProps = {
  companyLogoUrl: string;
  companyName: string;
  userName: string;
  buyerIntentLabel: string;
};

const ConversationBasicAndBuyerIntentLabelContainer = ({
  companyLogoUrl,
  companyName,
  userName,
  buyerIntentLabel,
}: IConversationBasicAndBuyerIntentLabelContainerProps) => {
  const isCompanyLogoUrlEmpty = companyLogoUrl === '';
  const isBuyerIntentLabelEmpty = buyerIntentLabel === '';
  const isUserNameEmpty = userName === '';
  const isCompanyNameEmpty = companyName === '';
  return (
    <div className="flex flex-col items-start gap-4 self-stretch">
      <div className="flex items-center gap-3 self-stretch">
        <div
          className={cn('flex h-14 w-14 items-center justify-center rounded-3xl bg-primary/10 p-2', {
            'rounded-full bg-white': isCompanyLogoUrlEmpty && isCompanyNameEmpty,
          })}
        >
          {isCompanyLogoUrlEmpty && isCompanyNameEmpty ? (
            <div className="relative flex items-center justify-center">
              <ActiveConvNoCompanyIcon className="h-14 w-14 text-gray-100" />
              <p className="absolute left-1/2 -translate-x-1/2 bg-gradient-to-b from-[#101828] to-[#98A2B3] bg-clip-text text-center font-inter text-[29.333px] font-semibold leading-normal tracking-[-0.235px] text-transparent">
                ?
              </p>
            </div>
          ) : (
            <img src={companyLogoUrl} alt={companyName} className="h-10 w-10 object-cover" />
          )}
        </div>
        <div className="flex flex-1 flex-col items-start justify-center gap-3 self-stretch">
          <div className="flex flex-1 items-center gap-3 self-stretch">
            <p className="w-full flex-1 self-stretch text-lg font-semibold text-gray-900">
              {isCompanyNameEmpty ? 'No Company Provided' : companyName}
            </p>
            <div className="flex justify-end self-stretch">
              {!isBuyerIntentLabelEmpty && <BuyerIntentCellValue value={buyerIntentLabel} />}
            </div>
          </div>
          <div className="flex w-80 flex-1 items-center gap-3">
            <p className="flex-1 self-stretch text-sm font-normal text-gray-500">
              {isUserNameEmpty ? 'Guest User' : userName}
            </p>
            <LocationCellValue value={{ city: 'New York', country: 'United States' }} />
          </div>
        </div>
      </div>
      <Separator isDashed />
    </div>
  );
};

export default ConversationBasicAndBuyerIntentLabelContainer;
