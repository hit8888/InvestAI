import ErrorBoundary from '@breakout/design-system/shared/ErrorBoundary';
import UrlDerivedDataProvider from '@meaku/core/contexts/UrlDerivedDataProvider';
import ConversationDetailsPage from './ConversationDetailsPage';

const ConversationDetailsPageContainer = () => {
  return (
    <ErrorBoundary>
      <UrlDerivedDataProvider>
        <ConversationDetailsPage />
      </UrlDerivedDataProvider>
    </ErrorBoundary>
  );
};

export default ConversationDetailsPageContainer;
