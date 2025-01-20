import SendIcon from '@breakout/design-system/components/icons/send';
import { useTypewriter } from '@breakout/design-system/hooks/useTypewriter';
import Input from '@breakout/design-system/components/layout/input';
import { cn } from '@breakout/design-system/lib/cn';
import { useEffect, useState } from 'react';
import useUnifiedConfigurationResponseManager from '@meaku/core/hooks/useUnifiedConfigurationResponseManager';
import { Suggestion } from '@breakout/design-system/components/layout/Suggestion';
import { useMessageStore } from '../../../stores/useMessageStore.ts';
import Orb from '@breakout/design-system/components/Orb/index';
import { OrbStatusEnum } from '@meaku/core/types/config';
import useAgentbotAnalytics from '@meaku/core/hooks/useAgentbotAnalytics';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import { motion } from 'framer-motion';
import { IWebSocketHandleMessage } from '@meaku/core/types/webSocket';
import PopupWithBubblesContainer from './EntryPopupBanner/PopupWithBubblesContainer.tsx';

interface IProps {
  handleSendUserMessage: (data: IWebSocketHandleMessage) => void;
  handleOpenAgent: () => void;
  hideBottomBar: boolean;
}

const floatingAnimation = {
  initial: {
    y: 0,
    opacity: 0,
  },
  animate: {
    y: [-4, 0, -4],
    opacity: 1,
    transition: {
      y: {
        repeat: Infinity,
        duration: 2,
        ease: [0.4, 0, 0.6, 1],
        times: [0, 0.5, 1],
      },
      opacity: {
        duration: 0.8,
      },
    },
  },
};

const suggestionContainerAnimation = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const suggestionItemAnimation = {
  initial: { x: -20, opacity: 0 },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 12,
    },
  },
};

const EntryPointBottomBar = ({ hideBottomBar, handleSendUserMessage, handleOpenAgent }: IProps) => {
  const initialSuggestedQuestions = useUnifiedConfigurationResponseManager().getInitialSuggestedQuestions();
  const bottomBarConfig = useUnifiedConfigurationResponseManager().getBottomBarConfig();
  const { show_banner } = useUnifiedConfigurationResponseManager().getStyleConfig();
  const orgName = useUnifiedConfigurationResponseManager().getOrgName();
  const agentName = useUnifiedConfigurationResponseManager().getAgentName();
  const hasFirstUserMessageBeenSent = useMessageStore((state) => state.hasFirstUserMessageBeenSent);

  const [inputValue, setInputValue] = useState('');
  const [showOrbAfterBubblesDisappear, setShowOrbAfterBubblesDisappear] = useState(false);

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
          'w-8/12': !hasFirstUserMessageBeenSent,
          'w-[400px]': hasFirstUserMessageBeenSent,
          hidden: hideBottomBar,
        },
      )}
      style={{
        backgroundSize: '200% 200%',
      }}
    >
      {show_banner && !hasFirstUserMessageBeenSent ? (
        <PopupWithBubblesContainer
          orgName={orgName}
          agentName={agentName}
          setShowOrbAfterBubblesDisappear={setShowOrbAfterBubblesDisappear}
        />
      ) : null}
      <div className="w-full rounded-xl bg-gray-50 p-1.5">
        <form
          onSubmit={handleFormSubmission}
          className="flex items-center gap-2 rounded-xl border border-gray-100 bg-white p-[2px]"
        >
          <div className="relative flex-1">
            {!hasFirstUserMessageBeenSent && !inputValue && showOrbAfterBubblesDisappear && (
              <div className="absolute left-3 top-1/2 z-10 -translate-y-1/2">
                <Orb color="rgb(var(--primary))" state={OrbStatusEnum.waiting} />
              </div>
            )}
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className={cn(
                'h-12 w-full min-w-80 border-none text-gray-900 outline-none ring-0 placeholder:text-blueGray-400 focus:ring-0',
                {
                  'pl-14': !hasFirstUserMessageBeenSent && showOrbAfterBubblesDisappear,
                },
              )}
              placeholder={useTypewriter(placeholderText)}
            />
          </div>

          <motion.div variants={floatingAnimation} initial="initial" animate="animate">
            <motion.div
              variants={suggestionContainerAnimation}
              initial="initial"
              animate="animate"
              className={cn(
                'flex items-center justify-end gap-4 overflow-hidden transition-[width] duration-150 ease-in-out',
                {
                  'w-0': !showSuggestedQuestions,
                  'max-w-[800px]': showSuggestedQuestions,
                },
              )}
            >
              {showSuggestedQuestions &&
                initialSuggestedQuestions.map((question) => (
                  <motion.div key={question} variants={suggestionItemAnimation} className="rounded-full bg-white">
                    <Suggestion question={question} onSuggestedQuestionOnClick={handleSuggestedQuestionOnClick} />
                  </motion.div>
                ))}
            </motion.div>
          </motion.div>

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
