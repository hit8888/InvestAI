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
import useUnifiedConfigurationResponseManager from '../../../../pages/shared/hooks/useUnifiedConfigurationResponseManager';
import { useAnimateDifferentOrbStates } from '../../../../hooks/useAnimateDifferentOrbStates';
import { AIResponse, Message } from '@meaku/core/types/chat';
import { useIsAdmin } from '../../../../shared/UrlDerivedDataProvider';
import { DemoEvent } from '@meaku/core/types/webSocket';
import UnifiedSessionConfigResponseManager from '@meaku/core/managers/UnifiedSessionConfigResponseManager';
import ChatMessages from '../ChatMessages';

interface IProps {
  isDemoPlaying: boolean;
}

export function DemoQuestions({ isDemoPlaying }: IProps) {
  const { sendMessage, lastMessage } = useWebSocketChat();

  const [isChatOpenEnabled, setShowDemoChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const isAdmin = useIsAdmin();

  const setIsAMessageBeingProcessed = useMessageStore((state) => state.setIsAMessageBeingProcessed);

  const handleUpdateOrbState = useMessageStore((state) => state.handleUpdateOrbState); //Fix this next PR.Ideally we would not want to put anything in store for this flow

  const unifiedConfigurationResponseManager = useUnifiedConfigurationResponseManager();
  const { handleStopOrbAnimation, handleAnimatedOrb } = useAnimateDifferentOrbStates();

  const sessionId = unifiedConfigurationResponseManager.getSessionId() ?? '';

  const handleToggleDemoChat = () => {
    setShowDemoChat(!isChatOpenEnabled);
  };

  const showPopover = !isDemoPlaying && isChatOpenEnabled;
  const showWaitDemoCompleteNotification = isDemoPlaying && isChatOpenEnabled;

  const handleSendUserMessage = useCallback(async ({ message, eventData }: IWebSocketHandleMessage) => {
    handleUpdateOrbState(OrbStatusEnum.thinking);

    const messageId = nanoid();
    setIsAMessageBeingProcessed(true);

    const payload = {
      session_id: sessionId,
      message: message ?? '',
      response_id: messageId,
      event_type: DemoEvent.DEMO_QUESTION,
      event_data: eventData ?? {},
      is_admin: isAdmin,
    };

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
    sendMessage(JSON.stringify(payload));
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
              onClick={handleToggleDemoChat}
            >
              <RaiseHandDisabled height={24} width={24} color="white" />
            </div>
          ) : (
            <AskQuestion onClick={handleToggleDemoChat} />
          )}
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="flex items-center justify-between p-2">
            <span className="text-base font-semibold text-gray-700">Questions</span>
          </div>
          <ChatMessages messages={messages} showArtifact={false} handleSendUserMessage={handleSendUserMessage} />
          <ChatInput
            handleSendMessage={() => {
              handleSendUserMessage({ message: '' });
            }}
            isAMessageBeingProcessed={false}
            messages={[]}
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
