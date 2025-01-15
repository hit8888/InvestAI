import UrlDerivedDataProvider from '@meaku/core/contexts/UrlDerivedDataProvider';
import ErrorBoundary from '@breakout/design-system/shared/ErrorBoundary';
import ConversationsPage from './ConversationsPage';

const ConversationsPageContainer = () => {
  return (
    <ErrorBoundary>
      <UrlDerivedDataProvider>
        <ConversationsPage />
      </UrlDerivedDataProvider>
    </ErrorBoundary>
  );
};

export default ConversationsPageContainer;
