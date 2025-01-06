import { Popover, PopoverContent, PopoverTrigger } from '@breakout/design-system/components/Popover/index';
import AskQuestion from './AskQuestion';
import RaiseHandDisabled from '@breakout/design-system/components/icons/RaiseHandDisabled';
import AgentMessages from '../AgentMessages';
import { X } from 'lucide-react';
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import { AIResponse, Message } from '@meaku/core/types/agent';
import { useIsAdmin } from '../../../../shared/UrlDerivedDataProvider';
import useGetMessagePayload from '../../../../hooks/useGetMessagePayload';
import { useMessageStore } from '../../../../stores/useMessageStore';
import { useAnimateDifferentOrbStates } from '../../../../hooks/useAnimateDifferentOrbStates';
import { OrbStatusEnum } from '@meaku/core/types/config';
import UnifiedSessionConfigResponseManager from '@meaku/core/managers/UnifiedSessionConfigResponseManager';
import { nanoid } from 'nanoid';
import { DemoEvent } from '@meaku/core/types/webSocket';
import useWebSocketChat, { IWebSocketHandleMessage } from '../../../../hooks/useWebSocketChat';
import AgentInput from '../AgentInput';

interface IProps {
  isAgentEnabled: boolean;
  setShowDemoAgent: Dispatch<SetStateAction<boolean>>;
  onRaiseDemoQuery: (queryRaised: boolean) => void;
  onCloseDemoAgent: () => void;
  isDemoPlaying: boolean;
}

const AskQuestionContainer = ({
  isAgentEnabled,
  setShowDemoAgent,
  onRaiseDemoQuery,
  onCloseDemoAgent,
  isDemoPlaying,
}: IProps) => {
  const { sendMessage, lastMessage } = useWebSocketChat();

  const [messages, setMessages] = useState<Message[]>([]);

  const isAdmin = useIsAdmin();

  const getMessagePayload = useGetMessagePayload();

  const setIsAMessageBeingProcessed = useMessageStore((state) => state.setIsAMessageBeingProcessed);

  const handleUpdateOrbState = useMessageStore((state) => state.handleUpdateOrbState); //Fix this next PR.Ideally we would not want to put anything in store for this flow

  const { handleStopOrbAnimation, handleAnimatedOrb } = useAnimateDifferentOrbStates();

  const handleToggleAgent = () => {
    const currentState = !isAgentEnabled;
    setShowDemoAgent(currentState);
    if (currentState) {
      onRaiseDemoQuery(currentState);
    }
  };

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

  const handleCloseAgent = () => {
    setShowDemoAgent(false);
    onRaiseDemoQuery(false);
  };

  const showPopover = !isDemoPlaying && isAgentEnabled;

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
        features: [],
      },
    ]);
    sendMessage(
      JSON.stringify(getMessagePayload({ message, eventType: DemoEvent.DEMO_QUESTION, eventData, messageId })),
    );
    handleAnimatedOrb(messageId);

    setIsAMessageBeingProcessed(false);
  }, []);

  return (
    <Popover open={showPopover}>
      <PopoverTrigger asChild>
        <div className="flex items-center justify-between">
          {isAgentEnabled ? (
            <div
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-[50%] bg-primary/60"
              onClick={handleCloseAgent}
            >
              <RaiseHandDisabled height={24} width={24} color="white" />
            </div>
          ) : (
            <div>
              <AskQuestion onClick={handleToggleAgent} />
            </div>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="text-popover-foreground relative z-50 flex h-[580px] w-[440px] flex-1 flex-col overflow-hidden  rounded-lg border bg-primary-foreground/60 px-2 py-4 shadow-md outline-none backdrop-blur-lg"
        align="start"
        side="top"
        sideOffset={10}
        alignOffset={10}
      >
        <div className="ml-2 flex items-end justify-end  p-2">
          <div
            className="flex cursor-pointer
items-center rounded-lg border-2 border-[rgb(var(--primary))] border-opacity-60 p-3"
            onClick={onCloseDemoAgent}
          >
            <span className="text-primary">Close & Resume Demo</span>
            <X height={24} width={24} color="rgb(var(--primary)/ 0.6)" />
          </div>
        </div>
        <AgentMessages
          messages={messages}
          showRightPanel={false}
          handleSendUserMessage={handleSendUserMessage}
          initialSuggestedQuestions={[]}
          allowFullWidthForText={true}
          showDemoPreQuestions={false}
        />
        <AgentInput
          handleSendMessage={(message) => handleSendUserMessage({ message })}
          isAMessageBeingProcessed={false}
          messages={messages}
        />
      </PopoverContent>
    </Popover>
  );
};

export { AskQuestionContainer };
