import PanelConversationActiveIcon from '@breakout/design-system/components/icons/panel-conversation-active-icon';
import withPageViewWrapper from '../pages/PageViewWrapper';
import CustomPageHeader from '../components/CustomPageHeader';
import ConversationsTableContainer from '../components/ConversationsTableContainer';
import { COMMON_SMALL_ICON_PROPS } from '../utils/constants';
import ConversationTabs from '../components/ConversationTabs';

const ConversationsPage = () => {
  return (
    <>
      <CustomPageHeader
        headerTitle="Conversations"
        headerIcon={<PanelConversationActiveIcon {...COMMON_SMALL_ICON_PROPS} />}
      />
      <ConversationTabs />
      <ConversationsTableContainer />
    </>
  );
};

export default withPageViewWrapper(ConversationsPage);
