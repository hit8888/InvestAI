import Separator from '@breakout/design-system/components/layout/separator';
import SessionIDIcon from '@breakout/design-system/components/icons/sessionid-icon';
import CompanyNameIcon from '@breakout/design-system/components/icons/company-name-icon';
import SingleDetailsWithIconHeaderValue from './SingleDetailsWithIconHeaderValue';
import ConversationDetailsNavigationButtons from './ConversationDetailsNavigationButtons';

type IProps = {
  companyName: string;
  sessionID: string;
};
const ConversationDetailsNavigatedHeader = ({ companyName, sessionID }: IProps) => {
  return (
    <div className="flex max-h-14 w-full items-center gap-6">
      <SingleDetailsWithIconHeaderValue headerLabel="Session ID:" itemValue={sessionID}>
        <SessionIDIcon width={'24'} height={'24'} />
      </SingleDetailsWithIconHeaderValue>
      <div className="h-10">
        <Separator vertical={true} />
      </div>
      <SingleDetailsWithIconHeaderValue headerLabel="Company name:" itemValue={companyName} isTakingFullWidth={true}>
        <CompanyNameIcon width={'24'} height={'24'} />
      </SingleDetailsWithIconHeaderValue>
      <ConversationDetailsNavigationButtons />
    </div>
  );
};

export default ConversationDetailsNavigatedHeader;
