import SendIcon from '@breakout/design-system/components/icons/send';
import SparkleIcon from '@breakout/design-system/components/icons/sparkle';
import BotIndicator from '@breakout/design-system/components/layout/bot-indicator';
import Input from '@breakout/design-system/components/layout/input';
import { cn } from '@breakout/design-system/lib/cn';
import { useEffect, useMemo, useState } from 'react';
import useUnifiedConfigurationResponseManager from '../../../pages/shared/hooks/useUnifiedConfigurationResponseManager.ts';
import { useChatStore } from '../../../stores/useChatStore.ts';

interface IProps {
  handleSendUserMessage: (message: string) => void;
  handleOpenChat: () => void;
}

const useTypewriter = (text: string, speed = 50, repeatDelay = 3000) => {
  const [index, setIndex] = useState(0);
  const displayText = useMemo(() => text.slice(0, index), [index, text]);

  useEffect(() => {
    if (index >= text.length) {
      // Wait for a delay before resetting the index to repeat the typing
      const timeoutId = setTimeout(() => {
        setIndex(0); // Reset to start the typing effect again
      }, repeatDelay);

      return () => {
        clearTimeout(timeoutId);
      };
    }

    const timeoutId = setTimeout(() => {
      setIndex((i) => i + 1); // Move to next character
    }, speed);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [index, text, speed, repeatDelay]);

  return displayText;
};

const BottomBar = (props: IProps) => {
  const { handleSendUserMessage, handleOpenChat } = props;

  const initialSuggestedQuestions = useUnifiedConfigurationResponseManager().getInitialSuggestedQuestions();
  const bottomBarConfig = useUnifiedConfigurationResponseManager().getBottomBarConfig();
  const hasFirstUserMessageBeenSent = useChatStore((state) => state.hasFirstUserMessageBeenSent);

  const [inputValue, setInputValue] = useState('');

  const showSuggestedQuestions =
    initialSuggestedQuestions.length > 0 && inputValue.length <= 0 && !hasFirstUserMessageBeenSent;

  const placeholderText = hasFirstUserMessageBeenSent
    ? (bottomBarConfig?.primary_placeholder ?? 'Have a question? Ask here')
    : (bottomBarConfig?.secondary_placeholder ?? 'Have a question? Ask here');

  const handleSuggestedQuestionOnClick = (msg: string) => {
    handleSendUserMessage(msg);
  };

  const handleFormSubmission = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedInputValue = inputValue.trim();
    if (trimmedInputValue.length <= 0) return;

    handleSendUserMessage(trimmedInputValue);
    setInputValue('');
  };

  return (
    <div
      className={cn(
        'bottom-bar-shadow absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 transform animate-gradient-rotate items-center justify-center rounded-xl bg-gradient-to-bl from-primary/90 via-transparent to-primary/90 p-0.5',
        {
          'w-10/12': !hasFirstUserMessageBeenSent,
          'w-[400px]': hasFirstUserMessageBeenSent,
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
                'w-full min-w-80 border-none text-gray-900 outline-none ring-0 placeholder:text-blueGray-400 focus:ring-0',
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
            {!inputValue &&
              initialSuggestedQuestions.map((question) => (
                <div key={question} className="rounded-full bg-white">
                  <button
                    type="button"
                    onClick={() => handleSuggestedQuestionOnClick(question)}
                    className="group flex items-center justify-center gap-1 rounded-full border-2 border-primary/10 bg-primary/15 p-2 text-primary transition-all duration-300 ease-in-out hover:bg-primary hover:text-white"
                  >
                    <SparkleIcon className="!h-4 !w-4 fill-primary/60 transition-colors duration-300 ease-in-out group-hover:fill-white/60" />
                    <span className="min-w-max text-sm font-medium">{question}</span>
                  </button>
                </div>
              ))}
          </div>

          <div className="flex items-center justify-center">
            {hasFirstUserMessageBeenSent && <BotIndicator size="md" />}
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
        <button className="absolute inset-0 rounded-xl" onClick={handleOpenChat}></button>
      )}
    </div>
  );
};

export default BottomBar;
