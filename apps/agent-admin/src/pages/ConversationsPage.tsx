import PanelConversationActiveIcon from '@breakout/design-system/components/icons/panel-conversation-active-icon';
import withPageViewWrapper from '../pages/PageViewWrapper';
import CustomPageHeader from '../components/CustomPageHeader';
import ConversationsTableContainer from '../components/ConversationsTableContainer';
import { COMMON_SMALL_ICON_PROPS } from '../utils/constants';
import ActiveConversationsLayout from '../components/ActiveConversationsComp/ActiveConversationsLayout';
import { ActiveConversationsProvider } from '../context/ActiveConversationsContext';
import { useAuth } from '../context/AuthProvider';
import { getTenantFromLocalStorage } from '../utils/common';

const ConversationsPage = () => {
  const { userInfo } = useAuth();
  const orgList = userInfo?.organizations;
  const tenantName = getTenantFromLocalStorage();
  const organization = orgList?.find((org) => org['tenant-name'] === tenantName);
  const showActiveConversations = organization?.active_conversations_enabled;

  return (
    <>
      <div className="flex flex-col items-start gap-6 self-stretch">
        <CustomPageHeader
          headerTitle="Conversations"
          headerIcon={<PanelConversationActiveIcon {...COMMON_SMALL_ICON_PROPS} />}
        />
        {showActiveConversations && (
          <ActiveConversationsProvider>
            <ActiveConversationsLayout />
          </ActiveConversationsProvider>
        )}
      </div>
      <ConversationsTableContainer />
    </>
  );
};

export default withPageViewWrapper(ConversationsPage);
