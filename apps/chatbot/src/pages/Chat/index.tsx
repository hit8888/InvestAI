import { FC, ReactElement } from 'react';
import ChatWithWhiteLabelConfig from './ChatPageContent';
import PreloadContainer from '../shared/PreloadContainer';
import { ApiProvider } from '../shared/ApiProvider';
import ErrorBoundary from '../shared/ErrorBoundary';
import UrlDerivedDataProvider from '../../shared/UrlDerivedDataProvider';

const ChatPage: FC = () => {
  return (
    <ErrorBoundary>
      <UrlDerivedDataProvider>
        <PreloadContainer>
          {(props): ReactElement => (
            <ApiProvider {...props}>
              <ChatWithWhiteLabelConfig />
            </ApiProvider>
          )}
        </PreloadContainer>
      </UrlDerivedDataProvider>
    </ErrorBoundary>
  );
};

export default ChatPage;
