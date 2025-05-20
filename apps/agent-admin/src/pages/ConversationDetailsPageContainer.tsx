import { useMemo, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import ErrorBoundary from '@breakout/design-system/shared/ErrorBoundary';
import UrlDerivedDataProvider from '@meaku/core/contexts/UrlDerivedDataProvider';
import ConversationDetailsPage from './ConversationDetailsPage';
import { AppRoutesEnum } from '../utils/constants';
import { getDashboardBasicPathURL } from '../utils/common';

type IProps = {
  isLeadsPage: boolean;
};

const ConversationDetailsPageContainer = ({ isLeadsPage }: IProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { tenantName } = useParams();
  const isDirectAccess = useMemo(() => {
    // Check if we have any state from the previous route
    return !location.state?.from;
  }, [location.state]);

  const handleNavigationBasedOnRoute = useCallback(() => {
    const baseURL = getDashboardBasicPathURL(tenantName ?? '');
    if (isLeadsPage) {
      navigate(`${baseURL}/${AppRoutesEnum.LEADS}`);
    } else {
      navigate(`${baseURL}/${AppRoutesEnum.CONVERSATIONS}`);
    }
  }, [isLeadsPage, navigate, tenantName]);

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
