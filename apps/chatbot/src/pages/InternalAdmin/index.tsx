import { FC, ReactElement } from 'react';
import PreloadContainer from '../shared/PreloadContainer';
import { ApiProvider } from '../shared/ApiProvider';
import InternalAdminWithWithWhiteLabelConfig from './InternalAdminContentWithWhiteLabel';

const ChatPage: FC = () => {
  return (
    <PreloadContainer>
      {(props): ReactElement => (
        <ApiProvider {...props}>
          <InternalAdminWithWithWhiteLabelConfig />
        </ApiProvider>
      )}
    </PreloadContainer>
  );
};

export default ChatPage;
