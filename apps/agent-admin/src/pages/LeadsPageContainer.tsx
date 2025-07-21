import { EntityMetadataProvider } from '../context/EntityMetadataContext';
import LeadsPage from './LeadsPage';
import { LEAD_LABEL_UPPERCASE } from '../utils/constants';

const LeadsPageContainer = () => {
  return (
    <EntityMetadataProvider pageType={LEAD_LABEL_UPPERCASE}>
      <LeadsPage />
    </EntityMetadataProvider>
  );
};

export default LeadsPageContainer;
