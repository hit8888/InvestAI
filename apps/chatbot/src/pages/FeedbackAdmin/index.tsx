import { FC, ReactElement } from 'react';
import PreloadContainer from '../shared/PreloadContainer';
import { ApiProvider } from '../shared/ApiProvider';
import FeedbackAdminWithLabelConfig from './FeedbackContent';

const ChatPage: FC = () => {
  return (
    <PreloadContainer>
      {(props): ReactElement => (
        <ApiProvider {...props}>
          <FeedbackAdminWithLabelConfig />
        </ApiProvider>
      )}
    </PreloadContainer>
  );
};

export default ChatPage;
