import { Navigate } from 'react-router-dom';

import PanelConversationActiveIcon from '@breakout/design-system/components/icons/panel-conversation-active-icon';
import withPageViewWrapper from '../../pages/PageViewWrapper';
import CustomPageHeader from '../../components/CustomPageHeader';
import { COMMON_SMALL_ICON_PROPS, DEFAULT_ROUTE } from '../../utils/constants';
import ActiveConversationsLayout from '../../components/ActiveConversationsComp/ActiveConversationsLayout';
import { ActiveConversationsProvider } from '../../context/ActiveConversationsContext';
import { useAuth } from '../../context/AuthProvider';
import { getTenantFromLocalStorage } from '@meaku/core/utils/index';

const ActiveConversationsBasePage = () => {
  const { userInfo } = useAuth();
  const orgList = userInfo?.organizations;
  const tenantName = getTenantFromLocalStorage();
  const organization = orgList?.find((org) => org['tenant-name'] === tenantName);
  const activeConversationsEnabled = organization?.active_conversations_enabled;

  if (!activeConversationsEnabled) {
    return <Navigate to={`/${DEFAULT_ROUTE}`} replace />;
  }

  return (
    <ActiveConversationsProvider>
      <CustomPageHeader
        headerTitle="Live Conversations"
        headerIcon={<PanelConversationActiveIcon {...COMMON_SMALL_ICON_PROPS} />}
      />
      <ActiveConversationsLayout />
    </ActiveConversationsProvider>
  );
};

const ActiveConversationsPage = withPageViewWrapper(ActiveConversationsBasePage);
export default ActiveConversationsPage;
