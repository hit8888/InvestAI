import { useCallback, useEffect, useState } from 'react';
import ChatInput from '../ChatInput';
import AskQuestion from './AskQuestion';
import { Popover, PopoverTrigger, PopoverContent } from '@breakout/design-system/components/Popover/index';
import WaitDemoCompleteNotification from './WaitDemoCompleteNotification';
import Orb from '@breakout/design-system/components/Orb/index';
import { OrbStatusEnum } from '@meaku/core/types/config';
import RaiseHandDisabled from '@breakout/design-system/components/icons/RaiseHandDisabled';
import { nanoid } from 'nanoid';
import { useMessageStore } from '../../../../stores/useMessageStore';
import useWebSocketChat, { IWebSocketHandleMessage } from '../../../../hooks/useWebSocketChat';
import { useAnimateDifferentOrbStates } from '../../../../hooks/useAnimateDifferentOrbStates';
import { AIResponse, Message } from '@meaku/core/types/chat';
import { useIsAdmin } from '../../../../shared/UrlDerivedDataProvider';
import { DemoEvent } from '@meaku/core/types/webSocket';
import UnifiedSessionConfigResponseManager from '@meaku/core/managers/UnifiedSessionConfigResponseManager';
import ChatMessages from '../ChatMessages';
import { X } from 'lucide-react';
import useGetMessagePayload from '../../../../hooks/useGetMessagePayload';

interface IProps {
  isDemoPlaying: boolean;
  onRaiseDemoQuery: (queryRaised: boolean) => void;
  onCloseDemoChat: () => void;
}

export function DemoQuestions({ isDemoPlaying, onRaiseDemoQuery, onCloseDemoChat }: IProps) {
  const { sendMessage, lastMessage } = useWebSocketChat();

  const [isChatOpenEnabled, setShowDemoChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const isAdmin = useIsAdmin();

  const getMessagePayload = useGetMessagePayload();

  const setIsAMessageBeingProcessed = useMessageStore((state) => state.setIsAMessageBeingProcessed);

  const handleUpdateOrbState = useMessageStore((state) => state.handleUpdateOrbState); //Fix this next PR.Ideally we would not want to put anything in store for this flow

  const { handleStopOrbAnimation, handleAnimatedOrb } = useAnimateDifferentOrbStates();

  const handleToggleDemoChat = () => {
    const currentState = !isChatOpenEnabled;
    setShowDemoChat(currentState);
    if (currentState) {
      onRaiseDemoQuery(currentState);
    }
  };

  const handleCloseDemoChat = () => {
    setShowDemoChat(false);
    onRaiseDemoQuery(false);
  };

  const showPopover = !isDemoPlaying && isChatOpenEnabled;
  const showWaitDemoCompleteNotification = isDemoPlaying && isChatOpenEnabled;

  const handleSendUserMessage = useCallback(({ message, eventData }: IWebSocketHandleMessage) => {
    handleUpdateOrbState(OrbStatusEnum.thinking);

    const messageId = nanoid();
    setIsAMessageBeingProcessed(true);

    setMessages([
      ...messages,
      {
        id: nanoid(),
        role: 'user',
        message,
        documents: [],
        analytics: {},
      },
    ]);
    sendMessage(
      JSON.stringify(getMessagePayload({ message, eventType: DemoEvent.DEMO_QUESTION, eventData, messageId })),
    );
    handleAnimatedOrb(messageId);

    setIsAMessageBeingProcessed(false);
  }, []);

  useEffect(() => {
    if (!lastMessage) return;
    handleStopOrbAnimation();
    handleUpdateOrbState(OrbStatusEnum.responding);
    const response = JSON.parse(lastMessage.data) as AIResponse;
    response.showFeedbackOptions = isAdmin;
    const messageId = response.response_id; //AI response

    const existingMessageIndex = messages.findIndex((message) => message.id === messageId);

    const messageInterface = UnifiedSessionConfigResponseManager.convertServerMessageToClientMessage(response);

    const draftMessages = [...messages];

    if (existingMessageIndex !== -1) {
      draftMessages[existingMessageIndex] = {
        ...draftMessages[existingMessageIndex],
        ...messageInterface,
      };
    } else {
      draftMessages.push(messageInterface);
    }

    setMessages(draftMessages);

    if (response.is_complete) {
      setIsAMessageBeingProcessed(false);
    }
  }, [lastMessage]);

  return (
    <div className="flex w-full items-center gap-8">
      <Popover open={showPopover}>
        <PopoverTrigger asChild>
          {isChatOpenEnabled ? (
            <div
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-[50%] bg-primary/60"
              onClick={handleCloseDemoChat}
            >
              <RaiseHandDisabled height={24} width={24} color="white" />
            </div>
          ) : (
            <AskQuestion onClick={handleToggleDemoChat} />
          )}
        </PopoverTrigger>
        <PopoverContent className="flex h-[620px] w-[512px] flex-1 flex-col overflow-hidden rounded-lg bg-primary-foreground/60 backdrop-blur-lg">
          <div className="ml-2 flex items-center justify-between border-b  border-white border-opacity-60 p-2">
            <span className="text-base font-semibold text-primary">Session Questions</span>
            <div
              className="flex cursor-pointer
 items-center rounded-lg border-2 border-[rgb(var(--primary))] border-opacity-60 p-3"
              onClick={onCloseDemoChat}
            >
              <span className="text-primary">Close & Resume Demo</span>
              <X height={24} width={24} color="rgb(var(--primary)/ 0.6)" />
            </div>
          </div>
          <ChatMessages
            messages={messages}
            showArtifact={false}
            handleSendUserMessage={handleSendUserMessage}
            initialSuggestedQuestions={[]}
            allowFullWidthForMesages={true}
          />
          <ChatInput
            handleSendMessage={(message) => handleSendUserMessage({ message })}
            isAMessageBeingProcessed={false}
            messages={messages}
          />
        </PopoverContent>
      </Popover>
      {showWaitDemoCompleteNotification && <WaitDemoCompleteNotification />}
      <div className="absolute left-1/2 -translate-x-1/2">
        <Orb color={null} state={OrbStatusEnum.takingInput} />
      </div>
    </div>
  );
}
