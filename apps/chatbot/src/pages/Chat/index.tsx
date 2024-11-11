import { FC, ReactElement } from 'react';
import ChatWithWhiteLabelConfig from './ChatPageContent';
import PreloadContainer from '../shared/PreloadContainer';
import { ApiProvider } from '../shared/ApiProvider';

const ChatPage: FC = () => {
  return (
    <PreloadContainer>
      {(props): ReactElement => (
        <ApiProvider {...props}>
          <ChatWithWhiteLabelConfig />
        </ApiProvider>
      )}
    </PreloadContainer>
  );
};

export default ChatPage;
