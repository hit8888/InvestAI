import withPageViewWrapper from '../PageViewWrapper';
import { GenericTablePage } from '../../features/table-system';
import { conversationsTableConfig } from './config/conversationsTableConfig';

/**
 * ConversationsV2BasePage
 * All Chats page using generic table system with PROSPECT entity
 */
const ConversationsV2BasePage = () => {
  return <GenericTablePage config={conversationsTableConfig as never} />;
};

const ConversationsV2Page = withPageViewWrapper(ConversationsV2BasePage);
export default ConversationsV2Page;
