import ErrorBoundary from '@breakout/design-system/shared/ErrorBoundary';
import ConversationDetailsPage from './ConversationDetailsPage';

const ConversationDetailsPageContainer = () => {
  return (
    <ErrorBoundary>
      <ConversationDetailsPage />
    </ErrorBoundary>
  );
};

export default ConversationDetailsPageContainer;
