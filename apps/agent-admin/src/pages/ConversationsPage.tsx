import CustomPageHeader from '../components/CustomPageHeader';
import ConversationsIcon from '@breakout/design-system/components/icons/conversations-icon';
import { PAGE_HEADER_TITLE_ICON_PROPS } from '../utils/constants';

const ConversationsPage = () => {
  return (
    <div className="w-full">
      <div className="flex flex-col items-start gap-6 self-stretch">
        <CustomPageHeader
          headerTitle="Conversations Page"
          headerIcon={<ConversationsIcon {...PAGE_HEADER_TITLE_ICON_PROPS} />}
        />
        <div className="flex h-64 flex-col items-start gap-4 self-stretch rounded-2xl border p-4"></div>
      </div>
      <div></div>
    </div>
  );
};

export default ConversationsPage;
