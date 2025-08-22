import { Navigate } from 'react-router-dom';

import withPageViewWrapper from '../../pages/PageViewWrapper';
import { AppRoutesEnum } from '../../utils/constants';
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
    return <Navigate to={`/${AppRoutesEnum.CONVERSATIONS}`} replace />;
  }

  return (
    <ActiveConversationsProvider>
      <ActiveConversationsLayout />
    </ActiveConversationsProvider>
  );
};

const ActiveConversationsPage = withPageViewWrapper(ActiveConversationsBasePage);
export default ActiveConversationsPage;
