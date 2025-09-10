import { COMMON_SMALL_ICON_PROPS } from '../utils/constants';
import PanelConversationActiveIcon from '@breakout/design-system/components/icons/panel-conversation-active-icon';
import ConversationTabs from '../components/ConversationTabs';
import CustomPageHeader from '../components/CustomPageHeader';

const ConversationsWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <CustomPageHeader
        headerTitle="Conversations"
        headerIcon={<PanelConversationActiveIcon {...COMMON_SMALL_ICON_PROPS} />}
      />
      <ConversationTabs />
      {children}
    </>
  );
};

export default ConversationsWrapper;
