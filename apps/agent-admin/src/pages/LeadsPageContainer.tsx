import LeadsPage from './LeadsPage';

import UrlDerivedDataProvider from '@meaku/core/contexts/UrlDerivedDataProvider';

const LeadsPageContainer = () => {
  return (
    <UrlDerivedDataProvider>
      <LeadsPage />
    </UrlDerivedDataProvider>
  );
};

export default LeadsPageContainer;
