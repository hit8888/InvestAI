import Separator from '@breakout/design-system/components/layout/separator';
import SessionIDIcon from '@breakout/design-system/components/icons/sessionid-icon';
import CompanyNameIcon from '@breakout/design-system/components/icons/company-name-icon';
import SingleDetailsWithIconHeaderValue from './SingleDetailsWithIconHeaderValue';
import ConversationDetailsNavigationButtons from './ConversationDetailsNavigationButtons';

type IProps = {
  companyName: string;
  sessionID: string;
  companyLogoUrl: string;
  isLoading: boolean;
  isDirectAccess: boolean;
};
const ConversationDetailsNavigatedHeader = ({
  companyName,
  sessionID,
  companyLogoUrl,
  isLoading,
  isDirectAccess,
}: IProps) => {
  return (
    <div className="flex max-h-14 w-full items-center gap-6">
      <SingleDetailsWithIconHeaderValue isLoading={isLoading} headerLabel="Company name:" itemValue={companyName}>
        {companyLogoUrl.length > 0 ? (
          <img src={companyLogoUrl} alt={`${companyName}-logo`} />
        ) : (
          <CompanyNameIcon width={'24'} height={'24'} />
        )}
      </SingleDetailsWithIconHeaderValue>
      <div className="h-10">
        <Separator vertical={true} />
      </div>
      <SingleDetailsWithIconHeaderValue
        isLoading={isLoading}
        headerLabel="Session ID:"
        itemValue={sessionID}
        isTakingFullWidth={true}
      >
        <SessionIDIcon width={'24'} height={'24'} />
      </SingleDetailsWithIconHeaderValue>
      <ConversationDetailsNavigationButtons sessionID={sessionID} isDirectAccess={isDirectAccess} />
    </div>
  );
};

export default ConversationDetailsNavigatedHeader;
