import SendIcon from '@breakout/design-system/components/icons/send';
import { useTypewriter } from '@breakout/design-system/hooks/useTypewriter';
import Input from '@breakout/design-system/components/layout/input';
import { cn } from '@breakout/design-system/lib/cn';
import { useEffect, useState } from 'react';
import useUnifiedConfigurationResponseManager from '../../../pages/shared/hooks/useUnifiedConfigurationResponseManager.ts';
import { Suggestion } from './Suggestion.tsx';
import { useMessageStore } from '../../../stores/useMessageStore.ts';
import Orb from '@breakout/design-system/components/Orb/index';
import { OrbStatusEnum } from '@meaku/core/types/config';
import useAgentbotAnalytics from '../../../hooks/useAgentbotAnalytics.tsx';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import { IWebSocketHandleMessage } from '../../../hooks/useWebSocketChat.tsx';

interface IProps {
  handleSendUserMessage: (data: IWebSocketHandleMessage) => void;
  handleOpenAgent: () => void;
  hideBottomBar: boolean;
}

const EntryPointBottomBar = ({ hideBottomBar, handleSendUserMessage, handleOpenAgent }: IProps) => {
  const initialSuggestedQuestions = useUnifiedConfigurationResponseManager().getInitialSuggestedQuestions();
  const bottomBarConfig = useUnifiedConfigurationResponseManager().getBottomBarConfig();
  const hasFirstUserMessageBeenSent = useMessageStore((state) => state.hasFirstUserMessageBeenSent);

  const [inputValue, setInputValue] = useState('');

  const { trackAgentbotEvent } = useAgentbotAnalytics();

  const showSuggestedQuestions =
    initialSuggestedQuestions.length > 0 && inputValue.length <= 0 && !hasFirstUserMessageBeenSent;

  const placeholderText = hasFirstUserMessageBeenSent
    ? (bottomBarConfig?.primary_placeholder ?? 'Have a question? Ask here')
    : (bottomBarConfig?.secondary_placeholder ?? 'Have a question? Ask here');

  const handleSuggestedQuestionOnClick = (msg: string) => {
    handleSendUserMessage({ message: msg });
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

    handleSendUserMessage({ message: trimmedInputValue });
    setInputValue('');
  };

  useEffect(() => {
    trackAgentbotEvent(ANALYTICS_EVENT_NAMES.SHOW_BOTTOM_BAR);
  }, []);

  return (
    <div
      className={cn(
        'bottom-bar-shadow absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 transform animate-gradient-rotate items-center justify-center rounded-xl bg-gradient-to-bl from-primary/90 via-transparent to-primary/90 p-0.5',
        {
          'w-10/12': !hasFirstUserMessageBeenSent,
          'w-[400px]': hasFirstUserMessageBeenSent,
          hidden: hideBottomBar,
        },
      )}
      style={{
        backgroundSize: '200% 200%',
      }}
    >
      <div className="w-full rounded-xl bg-gray-50 p-1.5">
        <form
          onSubmit={handleFormSubmission}
          className="flex items-center gap-2 rounded-xl border border-gray-100 bg-white p-[2px]"
        >
          <div className="flex-1">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className={cn(
                'h-12 w-full min-w-80 border-none text-gray-900 outline-none ring-0 placeholder:text-blueGray-400 focus:ring-0',
              )}
              placeholder={useTypewriter(placeholderText)}
            />
          </div>

          <div
            className={cn(
              'flex items-center justify-end gap-1 overflow-hidden transition-[width] duration-150 ease-in-out',
              {
                'w-0': !showSuggestedQuestions,
                'w-[710px]': showSuggestedQuestions,
              },
            )}
          >
            {showSuggestedQuestions &&
              initialSuggestedQuestions.map((question) => (
                <div key={question} className="rounded-full bg-white">
                  <Suggestion question={question} onSuggestedQuestionOnClick={handleSuggestedQuestionOnClick} />
                </div>
              ))}
          </div>

          <div className="flex items-center justify-center">
            {hasFirstUserMessageBeenSent && <Orb color="rgb(var(--primary))" state={OrbStatusEnum.waiting} />}
            {inputValue && (
              <button
                type="submit"
                className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground transition-colors duration-300 ease-in-out hover:bg-primary/80"
              >
                <SendIcon className="text-primary-foreground" />
              </button>
            )}
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
