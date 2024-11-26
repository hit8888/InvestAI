import { FC, ReactElement } from 'react';
import PreloadContainer from '../shared/PreloadContainer';
import { ApiProvider } from '../shared/ApiProvider';
import FeedbackAdminWithLabelConfig from './FeedbackContent';
import ErrorBoundary from '../shared/ErrorBoundary';
import UrlDerivedDataProvider from '../../shared/UrlDerivedDataProvider';

const ChatPage: FC = () => {
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

export default ChatPage;
