import UrlDerivedDataProvider from '@meaku/core/contexts/UrlDerivedDataProvider';
import ErrorBoundary from '@breakout/design-system/shared/ErrorBoundary';
import ConversationsPage from './ConversationsPage';
import { EntityMetadataProvider } from '../context/EntityMetadataContext';
import { CONVERSATION_LABEL_UPPERCASE } from '../utils/constants';

const ConversationsPageContainer = () => {
  return (
    <ErrorBoundary>
      <EntityMetadataProvider pageType={CONVERSATION_LABEL_UPPERCASE}>
        <UrlDerivedDataProvider>
          <ConversationsPage />
        </UrlDerivedDataProvider>
      </EntityMetadataProvider>
    </ErrorBoundary>
  );
};

export default ConversationsPageContainer;
