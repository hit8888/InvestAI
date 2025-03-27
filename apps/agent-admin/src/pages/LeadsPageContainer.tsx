import { EntityMetadataProvider } from '../context/EntityMetadataContext';
import UrlDerivedDataProvider from '@meaku/core/contexts/UrlDerivedDataProvider';
import LeadsPage from './LeadsPage';
import { LEAD_LABEL_UPPERCASE } from '../utils/constants';

const LeadsPageContainer = () => {
  return (
    <EntityMetadataProvider pageType={LEAD_LABEL_UPPERCASE}>
      <UrlDerivedDataProvider>
        <LeadsPage />
      </UrlDerivedDataProvider>
    </EntityMetadataProvider>
  );
};

export default LeadsPageContainer;
