import { cn } from '@breakout/design-system/lib/cn';
import ChatHeader from './ChatHeader.tsx';
import ChatMessages from './ChatMessages.tsx';
import Artifact from './Artifact.tsx';
import ChatInput from './ChatInput.tsx';
import { useMessageStore } from '../../../stores/useMessageStore.ts';
import { useArtifactStore } from '../../../stores/useArtifactStore.ts';
import { IWebSocketHandleMessage } from '../../../hooks/useWebSocketChat.tsx';
import { DemoEvent } from '@meaku/core/types/webSocket';
import { useUpdateActiveArtifactOnNewMessage } from '../../../hooks/useUpdateActiveArtifactOnNewMessage.ts';
import { Demo } from './Demo/index.tsx';
import { useDemoDetails } from '../../../hooks/useDemoDetails.ts';

interface IProps {
  handleSendMessage: (data: IWebSocketHandleMessage) => void;
  handleCloseChat?: () => void;
}

const ChatArea = ({ handleSendMessage, handleCloseChat }: IProps) => {
  useUpdateActiveArtifactOnNewMessage();
  const isMediaTakingFullWidth = useMessageStore((state) => state.isMediaTakingFullWidth);
  const setMediaTakeFullScreenWidth = useMessageStore((state) => state.setMediaTakeFullScreenWidth);
  const activeArtifact = useArtifactStore((state) => state.activeArtifact);
  const isAMessageBeingProcessed = useMessageStore((state) => state.isAMessageBeingProcessed);
  const messages = useMessageStore((state) => state.messages);

  const handleFinishDemo = () => {
    setMediaTakeFullScreenWidth(false);
    handleSendMessage({ message: '', eventType: DemoEvent.DEMO_END, eventData: {} });
  };

  const { draftDemoDetails: demoDetails, isDemoAvailable } = useDemoDetails();

  return (
    <div
      className={cn(
        'mx-auto flex w-10/12 flex-1 flex-col overflow-hidden rounded-2xl border border-primary/20 bg-white/10 p-2 backdrop-blur-lg transition-all duration-300 ease-in-out',
        {
          'w-full': activeArtifact,
        },
      )}
    >
      <div className="flex flex-1 flex-col overflow-hidden rounded-lg bg-primary-foreground/60 backdrop-blur-lg">
        <ChatHeader
          handleSendMessage={(message) => handleSendMessage({ message })}
          handleCloseChat={handleCloseChat}
          handleFinishDemo={handleFinishDemo}
        />
        <div
          className={cn('flex-1 overflow-y-auto', {
            'grid grid-cols-3 gap-8': !!activeArtifact,
          })}
        >
          {!isMediaTakingFullWidth && (
            <ChatMessages
              messages={messages}
              showArtifact={!!activeArtifact}
              handleSendUserMessage={handleSendMessage}
            />
          )}

          {!isDemoAvailable && !!activeArtifact && (
            <Artifact
              isMediaTakingFullWidth={isMediaTakingFullWidth}
              handleSendUserMessage={handleSendMessage}
              activeArtifactId={activeArtifact.artifactId}
              activeArtifactType={activeArtifact.artifactType}
            />
          )}
          <Demo
            handleFinishDemo={handleFinishDemo}
            handleSendMessage={handleSendMessage}
            isDemoAvailable={isDemoAvailable}
            demoDetails={demoDetails}
          />
        </div>
        {!isMediaTakingFullWidth && (
          <ChatInput
            handleSendMessage={(message) => handleSendMessage({ message })}
            isAMessageBeingProcessed={isAMessageBeingProcessed}
            messages={messages}
          />
        )}
      </div>
    </div>
  );
};

export default ChatArea;
