import { useState } from 'react';
import EntryPointSuggestedQuestions from '@breakout/design-system/components/layout/EntryPointSuggestedQuestions';
import InputOrb from '@breakout/design-system/components/layout/InputOrb';
import EntryPointChatInput from './EntryPointChatInput';
import ChatInputSendButton from '@breakout/design-system/components/layout/ChatInputSendButton';
import InputWaitingOrb from '@breakout/design-system/components/layout/InputWaitingOrb';
import { useUrlParams } from '@meaku/core/hooks/useUrlParams';
import { WebSocketMessage } from '@meaku/core/types/webSocketData';
import { EntryPointAlignmentType } from '@meaku/core/types/entryPoint';
import useValuesFromConfigApi from '../../../../hooks/useValuesFromConfigApi';
import useDynamicPlaceholder from '../../../../hooks/useDynamicPlaceholder';
import { useMessageStore } from '../../../../stores/useMessageStore';
import { OrbStatusEnum } from '@meaku/core/types/config';
import { cn } from '@breakout/design-system/lib/cn';
import useAgentbotAnalytics from '@meaku/core/hooks/useAgentbotAnalytics';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';

interface IProps {
  showOrbAfterBubblesDisappear: boolean;
  entryPointAlignment: EntryPointAlignmentType;
  handleSendUserMessage: (data: Pick<WebSocketMessage, 'message' | 'message_type'>) => void;
  handleSuggestedQuestionOnClick: (question: string) => void;
  isMobile: boolean;
}

const EntryPointContentForBottomCenter = ({
  showOrbAfterBubblesDisappear,
  entryPointAlignment,
  handleSendUserMessage,
  handleSuggestedQuestionOnClick,
  isMobile,
}: IProps) => {
  const { trackAgentbotEvent } = useAgentbotAnalytics();
  const { initialSuggestedQuestions, invertTextColor, orbLogoUrl, showOrb } = useValuesFromConfigApi();
  const hasFirstUserMessageBeenSent = useMessageStore((state) => state.hasFirstUserMessageBeenSent);
  const placeholderTexts = useDynamicPlaceholder(hasFirstUserMessageBeenSent);

  const [inputValue, setInputValue] = useState('');

  const { getParam } = useUrlParams();
  const isAgentOpen = getParam('isAgentOpen') === 'true';

  const handleFormSubmission = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedInputValue = inputValue.trim();
    if (trimmedInputValue.length <= 0) return;
    handleSendUserMessage({ message: { content: trimmedInputValue }, message_type: 'TEXT' });
    trackAgentbotEvent(ANALYTICS_EVENT_NAMES.ENTRY_CLICKED_FIRST_TIME, { isAgentOpen: false });
    setInputValue('');
  };

  const showSuggestedQuestions =
    initialSuggestedQuestions.length > 0 && inputValue.length <= 0 && !hasFirstUserMessageBeenSent;

  const showRightSideOrb = hasFirstUserMessageBeenSent && !isMobile; // only in desktop
  const showLeftSideOrb = (hasFirstUserMessageBeenSent && isMobile) || !hasFirstUserMessageBeenSent; // Mobile - always, Desktop - only if no user message been sent

  const displayOrb = showLeftSideOrb && !inputValue && showOrbAfterBubblesDisappear;

  return (
    <div className="w-full rounded-2xl bg-gray-50 p-1">
      <form
        onSubmit={handleFormSubmission}
        className={cn([
          'flex w-full items-center gap-2 rounded-xl border border-gray-100 bg-white p-[2px]',
          isMobile && 'border-gray-300',
        ])}
      >
        <div className="relative flex-1">
          <InputOrb
            state={OrbStatusEnum.waiting}
            showOrbFromConfig={showOrb}
            showOrb={displayOrb}
            orbLogoUrl={orbLogoUrl}
            showThreeStar={isMobile}
          />
          <EntryPointChatInput
            shouldInputAutoFocus={isAgentOpen}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            showOrb={displayOrb}
            placeholderText={placeholderTexts}
          />
        </div>

        {!isMobile && (
          <EntryPointSuggestedQuestions
            showSuggestedQuestions={showSuggestedQuestions}
            initialSuggestedQuestions={initialSuggestedQuestions}
            handleSuggestedQuestionOnClick={handleSuggestedQuestionOnClick}
            questionAlignment={entryPointAlignment}
            invertTextColor={invertTextColor}
          />
        )}

        <div
          className={cn('flex items-center justify-center pr-2', {
            'pr-1': !showRightSideOrb,
          })}
        >
          {showRightSideOrb && (
            <InputWaitingOrb
              showThreeStar={isMobile}
              showOrb={showOrb}
              state={OrbStatusEnum.waiting}
              orbLogoUrl={orbLogoUrl}
            />
          )}
          <ChatInputSendButton
            btnType="submit"
            showButton={!!inputValue}
            invertTextColor={invertTextColor}
            btnClassName="h-10 w-10 hover:bg-primary/80"
          />
        </div>
      </form>
    </div>
  );
};

export default EntryPointContentForBottomCenter;
