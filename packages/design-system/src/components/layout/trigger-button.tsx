import { XIcon } from 'lucide-react';
import { memo } from 'react';
import { cn } from '../../lib/cn';
import ChatIcon from '../icons/chat';
import SuggestedQuestion from './suggested-question';

type Props = {
  isChatOpen: boolean;
  showTooltip: boolean;
  suggestedQuestions: string[];
  handleToggleChatOpenState: () => void;
  handleCloseTooltip: () => void;
  handleSuggestionsOnClick: (msg: string) => void;
};

const TriggerButton = ({
  isChatOpen,
  showTooltip,
  suggestedQuestions,
  handleToggleChatOpenState,
  handleCloseTooltip,
  handleSuggestionsOnClick,
}: Props) => {
  return (
    <div className="flex flex-col items-end justify-end overflow-hidden p-4">
      {showTooltip && (
        <div className="max-w-80">
          <div className="relative mb-4 rounded-md border bg-white p-2 text-gray-700">
            <button
              onClick={handleCloseTooltip}
              className="absolute -right-2 -top-2 flex items-center justify-center rounded-full border bg-white p-1"
            >
              <XIcon strokeWidth={2} className="right-2 top-2 h-3 w-3 cursor-pointer text-gray-700" />
            </button>

            <p className="text-sm">Hey, I am your AI Companion – Experience the Future of Interaction with me!</p>
          </div>

          <div className="mb-3 space-y-2">
            {suggestedQuestions.map((question) => (
              <SuggestedQuestion handleOnClick={handleSuggestionsOnClick} key={question} question={question} />
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handleToggleChatOpenState}
        className={cn(
          'flex items-center gap-2 rounded-full bg-gradient-to-br from-primary/70 to-primary p-2 opacity-100 transition-all duration-300 hover:opacity-80',
          {
            'w-14': isChatOpen,
            'w-44': !isChatOpen,
          },
        )}
      >
        {!isChatOpen ? (
          <>
            <div className="rounded-full bg-primary-foreground">
              <div className="rounded-full bg-primary/50 p-2">
                <ChatIcon className="h-4 w-4 text-primary-foreground" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-[15px] font-medium text-primary-foreground">
              <h3 className="text-nowrap">Let&apos;s Chat!</h3>
              <span className="animate-wave">👋</span>
            </div>
          </>
        ) : (
          <div className="rounded-full p-1">
            <XIcon strokeWidth={2} className="h-8 w-8 text-primary-foreground" />
          </div>
        )}
      </button>
    </div>
  );
};

export default memo(TriggerButton);
