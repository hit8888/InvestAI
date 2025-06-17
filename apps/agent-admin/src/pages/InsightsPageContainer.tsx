import UrlDerivedDataProvider from '@meaku/core/contexts/UrlDerivedDataProvider';
import ErrorBoundary from '@breakout/design-system/shared/ErrorBoundary';
import { EntityMetadataProvider } from '../context/EntityMetadataContext';
import { INSIGHT_LABEL } from '../utils/constants';
import InsightsPage from './InsightsPage';

const InsightsPageContainer = () => {
  return (
    <ErrorBoundary>
      <EntityMetadataProvider pageType={INSIGHT_LABEL}>
        <UrlDerivedDataProvider>
          <InsightsPage />
        </UrlDerivedDataProvider>
      </EntityMetadataProvider>
    </ErrorBoundary>
  );
};

export default InsightsPageContainer;
