import withPageViewWrapper from '../PageViewWrapper';
import { GenericTablePage } from '../../features/table-system';
import { conversationsTableConfig } from './config/conversationsTableConfig';
import { useAuth } from '../../context/AuthProvider';

/**
 * ConversationsV2BasePage
 * All Chats page using generic table system with PROSPECT entity
 */
const ConversationsV2BasePage = () => {
  const { userInfo } = useAuth();
  const userId = userInfo?.id;

  return <GenericTablePage config={conversationsTableConfig(userId) as never} />;
};

const ConversationsV2Page = withPageViewWrapper(ConversationsV2BasePage);
export default ConversationsV2Page;
