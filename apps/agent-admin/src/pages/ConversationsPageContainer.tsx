import ConversationsPage from './ConversationsPage';
import { EntityMetadataProvider } from '../context/EntityMetadataContext';
import { VISITOR_LABEL_UPPERCASE } from '../utils/constants';

const ConversationsPageContainer = () => {
  return (
    <EntityMetadataProvider pageType={VISITOR_LABEL_UPPERCASE}>
      <ConversationsPage />
    </EntityMetadataProvider>
  );
};

export default ConversationsPageContainer;
