import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import ErrorBoundary from '@breakout/design-system/shared/ErrorBoundary';
import UrlDerivedDataProvider from '@meaku/core/contexts/UrlDerivedDataProvider';
import ConversationDetailsPage from './ConversationDetailsPage';

type IProps = {
  isLeadsPage: boolean;
};

const ConversationDetailsPageContainer = ({ isLeadsPage }: IProps) => {
  const location = useLocation();
  const isDirectAccess = useMemo(() => {
    // Check if we have any state from the previous route
    return !location.state?.from;
  }, [location.state]);

  return (
    <ErrorBoundary>
      <UrlDerivedDataProvider>
        <ConversationDetailsPage isDirectAccess={isDirectAccess} isLeadsPage={isLeadsPage} />
      </UrlDerivedDataProvider>
    </ErrorBoundary>
  );
};

export default ConversationDetailsPageContainer;
