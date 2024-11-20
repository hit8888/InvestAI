import { FC, ReactElement } from 'react';
import ChatWithWhiteLabelConfig from './ChatPageContent';
import PreloadContainer from '../shared/PreloadContainer';
import { ApiProvider } from '../shared/ApiProvider';
import ErrorBoundary from '../shared/ErrorBoundary';

const ChatPage: FC = () => {
  return (
    <ErrorBoundary>
      <PreloadContainer>
        {(props): ReactElement => (
          <ApiProvider {...props}>
            <ChatWithWhiteLabelConfig />
          </ApiProvider>
        )}
      </PreloadContainer>
    </ErrorBoundary>
  );
};

export default ChatPage;
