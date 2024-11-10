import { FC, ReactElement } from 'react';

import PreloadContainer from './PreloadContainer';
import { ApiProvider } from './ApiProvider';
import ChatPageContent from './ChatPageContent';

const ChatPage: FC = () => {
    return (
        <PreloadContainer>
            {(props): ReactElement => (
                <ApiProvider {...props}>
                    <ChatPageContent />
                </ApiProvider>
            )}
        </PreloadContainer>
    );
};

export default ChatPage;
