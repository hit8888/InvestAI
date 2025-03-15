import { useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ErrorBoundary from '@breakout/design-system/shared/ErrorBoundary';
import UrlDerivedDataProvider from '@meaku/core/contexts/UrlDerivedDataProvider';
import ConversationDetailsPage from './ConversationDetailsPage';
import { AppRoutesEnum } from '../utils/constants';

type IProps = {
  isLeadsPage: boolean;
};

const ConversationDetailsPageContainer = ({ isLeadsPage }: IProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isDirectAccess = useMemo(() => {
    // Check if we have any state from the previous route
    return !location.state?.from;
  }, [location.state]);

  const handleNavigationBasedOnRoute = useCallback(() => {
    if (isLeadsPage) {
      navigate(AppRoutesEnum.LEADS);
    } else {
      navigate(AppRoutesEnum.CONVERSATIONS);
    }
  }, [isLeadsPage, navigate]);

  return (
    <ErrorBoundary>
      <UrlDerivedDataProvider>
        <ConversationDetailsPage
          handleNavigateBasedOnRoute={handleNavigationBasedOnRoute}
          isDirectAccess={isDirectAccess}
          isLeadsPage={isLeadsPage}
        />
      </UrlDerivedDataProvider>
    </ErrorBoundary>
  );
};

export default ConversationDetailsPageContainer;
