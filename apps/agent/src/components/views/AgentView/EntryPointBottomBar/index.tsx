import { cn } from '@breakout/design-system/lib/cn';
import { useEffect, useState } from 'react';
import { useMessageStore } from '../../../../stores/useMessageStore.ts';
import useAgentbotAnalytics from '@meaku/core/hooks/useAgentbotAnalytics';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import { WebSocketMessage } from '@meaku/core/types/webSocketData';
import useDynamicPlaceholder from '../../../../hooks/useDynamicPlaceholder.tsx';
import useConfigurationApiResponseManager from '@meaku/core/hooks/useConfigurationApiResponseManager';
import InputOrb from './InputOrb.tsx';
import InputWaitingOrb from './InputWaitingOrb.tsx';
import EntryPointChatInput from './EntryPointChatInput.tsx';
import EntryPointSuggestedQuestions from './EntryPointSuggestedQuestions.tsx';
import PopupWithBubblesContainer from '../EntryPopupBanner/PopupWithBubblesContainer.tsx';
import ChatInputSendButton from '@breakout/design-system/components/layout/ChatInputSendButton';

interface IProps {
  handleSendUserMessage: (data: Pick<WebSocketMessage, 'message' | 'message_type'>) => void;
  handleOpenAgent: () => void;
  hideBottomBar: boolean;
  showBubbles: boolean;
  setShowBubbles: (value: boolean) => void;
}

const EntryPointBottomBar = ({
  hideBottomBar,
  handleSendUserMessage,
  handleOpenAgent,
  showBubbles,
  setShowBubbles,
}: IProps) => {
  const configurationApiResponseManager = useConfigurationApiResponseManager();
  const initialSuggestedQuestions = configurationApiResponseManager.getInitialSuggestedQuestions();
  const { banner_config } = configurationApiResponseManager.getStyleConfig();
  const orgName = configurationApiResponseManager.getOrgName();
  const agentName = configurationApiResponseManager.getAgentName();
  const hasFirstUserMessageBeenSent = useMessageStore((state) => state.hasFirstUserMessageBeenSent);
  const placeholderText = useDynamicPlaceholder(hasFirstUserMessageBeenSent);

  const [inputValue, setInputValue] = useState('');
  const [showOrbAfterBubblesDisappear, setShowOrbAfterBubblesDisappear] = useState(!banner_config?.show_banner);

  const { trackAgentbotEvent } = useAgentbotAnalytics();

  const showSuggestedQuestions =
    initialSuggestedQuestions.length > 0 && inputValue.length <= 0 && !hasFirstUserMessageBeenSent;

  const handleSuggestedQuestionOnClick = (msg: string) => {
    handleSendUserMessage({
      message: { content: msg, event_data: {}, event_type: 'SUGGESTED_QUESTION_CLICKED' },
      message_type: 'EVENT',
    });
    trackAgentbotEvent(ANALYTICS_EVENT_NAMES.INITIAL_SUGGESTED_QUESTION_CLICKED, {
      message: msg,
      isAgentOpen: false,
      initialSuggestedQuestion: true,
    });
  };

  const handleFormSubmission = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedInputValue = inputValue.trim();
    if (trimmedInputValue.length <= 0) return;
    handleSendUserMessage({ message: { content: trimmedInputValue }, message_type: 'TEXT' });
    setInputValue('');
  };

  useEffect(() => {
    trackAgentbotEvent(ANALYTICS_EVENT_NAMES.SHOW_BOTTOM_BAR);
  }, [agentName]);

  const showBanner = banner_config?.show_banner && !hasFirstUserMessageBeenSent;

  const showOrb = !hasFirstUserMessageBeenSent && !inputValue && showOrbAfterBubblesDisappear;
  const orbConfig = configurationApiResponseManager.getOrbConfig();
  const showBouncingEffect = configurationApiResponseManager.getShowBouncingEffectOnSuggestedQuestions();
  const orbLogoUrl = orbConfig?.logo_url ?? undefined;

  return (
    <div
      className={cn(
        'bottom-bar-shadow absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 transform animate-gradient-rotate items-center justify-center rounded-2xl bg-gradient-to-bl from-primary/90 via-transparent to-primary/90 p-0.5',
        {
          'w-[calc(66.66%+110px)]': !hasFirstUserMessageBeenSent, // for longer placeholder - added extra 120px width
          'w-[400px]': hasFirstUserMessageBeenSent,
          hidden: hideBottomBar,
        },
      )}
      style={{
        backgroundSize: '200% 200%',
      }}
    >
      {showBanner ? (
        <PopupWithBubblesContainer
          orgName={orgName}
          agentName={agentName}
          showBubbles={showBubbles}
          setShowBubbles={setShowBubbles}
          setShowOrbAfterBubblesDisappear={setShowOrbAfterBubblesDisappear}
          header={banner_config?.header}
          subheader={banner_config?.subheader}
        />
      ) : null}
      <div className="w-full rounded-2xl bg-gray-50 p-2">
        <form
          onSubmit={handleFormSubmission}
          className="flex items-center gap-2 rounded-xl border border-gray-100 bg-white p-[2px]"
        >
          <div className="relative flex-1">
            <InputOrb showOrb={showOrb} orbLogoUrl={orbLogoUrl} />
            <EntryPointChatInput
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              showOrb={showOrb}
              placeholderText={placeholderText}
            />
          </div>

          <EntryPointSuggestedQuestions
            showSuggestedQuestions={showSuggestedQuestions}
            initialSuggestedQuestions={initialSuggestedQuestions}
            handleSuggestedQuestionOnClick={handleSuggestedQuestionOnClick}
            showBouncingEffect={showBouncingEffect}
          />

          <div className="flex items-center justify-center pr-2">
            {hasFirstUserMessageBeenSent && <InputWaitingOrb orbLogoUrl={orbLogoUrl} />}
            <ChatInputSendButton
              btnType="submit"
              showButton={!!inputValue}
              btnClassName="h-9 w-9 hover:bg-primary/80"
            />
          </div>
        </form>
      </div>

      {hasFirstUserMessageBeenSent && (
        <button className="absolute inset-0 rounded-xl" onClick={handleOpenAgent}></button>
      )}
    </div>
  );
};

export default EntryPointBottomBar;
