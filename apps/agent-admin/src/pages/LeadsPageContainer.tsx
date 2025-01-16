import LeadsPage from './LeadsPage';

import UrlDerivedDataProvider from '@meaku/core/contexts/UrlDerivedDataProvider';
import ErrorBoundary from '@breakout/design-system/shared/ErrorBoundary';

const LeadsPageContainer = () => {
  return (
    <ErrorBoundary>
      <UrlDerivedDataProvider>
        <LeadsPage />
      </UrlDerivedDataProvider>
    </ErrorBoundary>
  );
};

export default LeadsPageContainer;
