import ConversationsPage from './ConversationsPage';
import { EntityMetadataProvider } from '../context/EntityMetadataContext';
import { CONVERSATION_LABEL_UPPERCASE } from '../utils/constants';

const ConversationsPageContainer = () => {
  return (
    <EntityMetadataProvider pageType={CONVERSATION_LABEL_UPPERCASE}>
      <ConversationsPage />
    </EntityMetadataProvider>
  );
};

export default ConversationsPageContainer;
