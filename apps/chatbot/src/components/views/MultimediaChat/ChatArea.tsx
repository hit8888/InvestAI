import { cn } from '@breakout/design-system/lib/cn';
import ChatHeader from './ChatHeader.tsx';
import ChatMessage from './ChatMessage.tsx';
import Artifact from './Artifact.tsx';
import ChatInput from './ChatInput.tsx';
import { useMessageStore } from '../../../stores/useMessageStore.ts';
import { useArtifactStore } from '../../../stores/useArtifactStore.ts';
import useLocalStorageArtifact from '../../../hooks/useLocalStorageArtifact.tsx';
import { useEffect, useState } from 'react';

interface IProps {
  handleSendMessage: (message: string) => void;
  handleCloseChat?: () => void;
}

const ChatArea = (props: IProps) => {
  const { handleSendMessage, handleCloseChat } = props;

  const { artifact } = useLocalStorageArtifact();
  const { activeArtifactId } = artifact ?? {};

  const [showArtifact, setShowArtifact] = useState(false);

  const isArtifactMaximized = useArtifactStore((state) => state.isArtifactMaximized);
  const setIsArtifactMaximized = useArtifactStore((state) => state.setIsArtifactMaximized);

  const isAMessageBeingProcessed = useMessageStore((state) => state.isAMessageBeingProcessed);

  const messages = useMessageStore((state) => state.messages);

  const handleFinishDemo = () => {
    setIsArtifactMaximized(false);
  };

  const handleExpandWidth = () => {
    setShowArtifact(true);
  };

  useEffect(() => {
    if (showArtifact) return;

    if (activeArtifactId) {
      handleExpandWidth();
    }
  }, [activeArtifactId, showArtifact]);

  return (
    <div
      className={cn(
        'mx-auto flex w-10/12 flex-1 flex-col overflow-hidden rounded-2xl border border-gray-300 bg-white bg-opacity-50 p-2 backdrop-blur-lg transition-all duration-300 ease-in-out',
        {
          'w-full': showArtifact,
        },
      )}
    >
      <div className="flex flex-1 flex-col overflow-hidden rounded-lg bg-primary-foreground/10 bg-opacity-40 backdrop-blur-lg">
        <ChatHeader
          handlePrimaryCta={() => handleSendMessage('I want to book a demo for the product.')}
          handleCloseChat={handleCloseChat}
          handleFinishDemo={handleFinishDemo}
        />
        <div
          className={cn('flex-1 overflow-y-auto', {
            'grid grid-cols-3 gap-8': showArtifact,
          })}
        >
          {!isArtifactMaximized && <ChatMessage messages={messages} showArtifact={showArtifact} />}

          {showArtifact && <Artifact isArtifactMaximized={isArtifactMaximized} />}
        </div>
        {!isArtifactMaximized && (
          <ChatInput
            handleSendMessage={handleSendMessage}
            isAMessageBeingProcessed={isAMessageBeingProcessed}
            messages={messages}
          />
        )}
      </div>
    </div>
  );
};

export default ChatArea;
