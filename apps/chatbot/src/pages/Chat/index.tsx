import { FC, ReactElement } from 'react';

import PreloadContainer from './PreloadContainer';
import { ApiProvider } from './ApiProvider';
import ChatWithWhiteLabelConfig from './ChatPageContent';

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
