import ErrorBoundary from '@breakout/design-system/shared/ErrorBoundary';
import InsightsPage from './InsightsPage';

const InsightsPageContainer = () => {
  return (
    <ErrorBoundary>
      <InsightsPage />
    </ErrorBoundary>
  );
};

export default InsightsPageContainer;
