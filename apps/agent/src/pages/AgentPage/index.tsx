import { FC, ReactElement } from 'react';
import AgentWithWhiteLabelConfig from './AgentPageContent';
import PreloadContainer from '../shared/PreloadContainer';
import { ApiProvider } from '../shared/ApiProvider';
import ErrorBoundary from '@breakout/design-system/shared/ErrorBoundary';
import UrlDerivedDataProvider from '@meaku/core/contexts/UrlDerivedDataProvider';

const AgentPage: FC = () => {
  return (
    <ErrorBoundary>
      <UrlDerivedDataProvider>
        <PreloadContainer>
          {(props): ReactElement => (
            <ApiProvider {...props}>
              <AgentWithWhiteLabelConfig />
            </ApiProvider>
          )}
        </PreloadContainer>
      </UrlDerivedDataProvider>
    </ErrorBoundary>
  );
};

export default AgentPage;
