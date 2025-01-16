import { FC, ReactElement } from 'react';
import PreloadContainer from '../shared/PreloadContainer';
import { ApiProvider } from '../shared/ApiProvider';
import FeedbackAdminWithLabelConfig from './FeedbackContent';
import ErrorBoundary from '@breakout/design-system/shared/ErrorBoundary';
import UrlDerivedDataProvider from '@meaku/core/contexts/UrlDerivedDataProvider';

const AgentPage: FC = () => {
  return (
    <ErrorBoundary>
      <UrlDerivedDataProvider>
        <PreloadContainer>
          {(props): ReactElement => (
            <ApiProvider {...props}>
              <FeedbackAdminWithLabelConfig />
            </ApiProvider>
          )}
        </PreloadContainer>
      </UrlDerivedDataProvider>
    </ErrorBoundary>
  );
};

export default AgentPage;
