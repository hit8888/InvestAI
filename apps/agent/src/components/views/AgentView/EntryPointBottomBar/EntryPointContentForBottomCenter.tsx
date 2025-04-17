import { useState } from 'react';
import EntryPointSuggestedQuestions from '@breakout/design-system/components/layout/EntryPointSuggestedQuestions';
import InputOrb from '@breakout/design-system/components/layout/InputOrb';
import EntryPointChatInput from './EntryPointChatInput';
import ChatInputSendButton from '@breakout/design-system/components/layout/ChatInputSendButton';
import InputWaitingOrb from '@breakout/design-system/components/layout/InputWaitingOrb';
import { useUrlParams } from '@meaku/core/hooks/useUrlParams';
import { WebSocketMessage } from '@meaku/core/types/webSocketData';
import { EntryPointAlignmentType } from '@meaku/core/types/entryPoint';
import useConfigurationApiResponseManager from '@meaku/core/hooks/useConfigurationApiResponseManager';
import useDynamicPlaceholder from '../../../../hooks/useDynamicPlaceholder';
import { useMessageStore } from '../../../../stores/useMessageStore';
import { OrbStatusEnum } from '@meaku/core/types/config';
import { cn } from '@breakout/design-system/lib/cn';

interface IProps {
  showOrbAfterBubblesDisappear: boolean;
  entryPointAlignment: EntryPointAlignmentType;
  handleSendUserMessage: (data: Pick<WebSocketMessage, 'message' | 'message_type'>) => void;
  handleSuggestedQuestionOnClick: (question: string) => void;
}

const EntryPointContentForBottomCenter = ({
  showOrbAfterBubblesDisappear,
  entryPointAlignment,
  handleSendUserMessage,
  handleSuggestedQuestionOnClick,
}: IProps) => {
  const configurationApiResponseManager = useConfigurationApiResponseManager();
  const initialSuggestedQuestions = configurationApiResponseManager.getInitialSuggestedQuestions();
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
    setInputValue('');
  };

  const showSuggestedQuestions =
    initialSuggestedQuestions.length > 0 && inputValue.length <= 0 && !hasFirstUserMessageBeenSent;

  const showOrb = !hasFirstUserMessageBeenSent && !inputValue && showOrbAfterBubblesDisappear;

  const orbConfig = configurationApiResponseManager.getOrbConfig();
  const orbLogoUrl = orbConfig?.logo_url ?? undefined;

  return (
    <div className="w-full rounded-2xl bg-gray-50 p-2">
      <form
        onSubmit={handleFormSubmission}
        className="flex w-full items-center gap-2 rounded-xl border border-gray-100 bg-white p-[2px]"
      >
        <div className="relative flex-1">
          <InputOrb state={OrbStatusEnum.waiting} showOrb={showOrb} orbLogoUrl={orbLogoUrl} />
          <EntryPointChatInput
            shouldInputAutoFocus={isAgentOpen}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            showOrb={showOrb}
            placeholderText={placeholderTexts}
          />
        </div>

        <EntryPointSuggestedQuestions
          showSuggestedQuestions={showSuggestedQuestions}
          initialSuggestedQuestions={initialSuggestedQuestions}
          handleSuggestedQuestionOnClick={handleSuggestedQuestionOnClick}
          questionAlignment={entryPointAlignment}
        />

        <div
          className={cn('flex items-center justify-center pr-2', {
            'pr-1': !hasFirstUserMessageBeenSent,
          })}
        >
          {hasFirstUserMessageBeenSent && <InputWaitingOrb state={OrbStatusEnum.waiting} orbLogoUrl={orbLogoUrl} />}
          <ChatInputSendButton
            btnType="submit"
            showButton={!!inputValue}
            btnClassName="h-10 w-10 hover:bg-primary/80"
          />
        </div>
      </form>
    </div>
  );
};

export default EntryPointContentForBottomCenter;
