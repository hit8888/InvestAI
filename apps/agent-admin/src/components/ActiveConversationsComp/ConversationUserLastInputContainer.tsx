import ActiveConvStatusCircleIcon from '@breakout/design-system/components/icons/active-conv-green-circle-icon';
import ActiveConvUserDefaultIcon from '@breakout/design-system/components/icons/active-conv-user-default-icon';
import { cn } from '@breakout/design-system/lib/cn';

type IConversationUserLastInputContainerProps = {
  isTyping: boolean;
  isActive: boolean;
  timePassedAfterInactive: string; // In minutes
  userLastInput: string;
};

const ConversationUserLastInputContainer = ({
  isTyping,
  isActive,
  timePassedAfterInactive,
  userLastInput,
}: IConversationUserLastInputContainerProps) => {
  return (
    <div className="flex w-full items-start gap-3 self-stretch rounded-2xl border border-gray-200 bg-gray-50 p-3">
      <div className="relative flex h-8 w-8 items-center justify-center rounded-full border border-primary/30 bg-primary/10">
        <ActiveConvUserDefaultIcon
          className={cn('h-8 w-8', {
            'text-primary': isActive,
            'text-primary/50': !isActive,
          })}
        />
        <div
          className={cn('absolute -right-1 bottom-0 h-3 w-3 rounded-full p-0.5', {
            'bg-positive-50': isActive,
            'bg-destructive-50': !isActive,
          })}
        >
          {isActive ? (
            <ActiveConvStatusCircleIcon className="h-2 w-2 animate-pulse text-positive-1000" />
          ) : (
            <ActiveConvStatusCircleIcon className="h-2 w-2 text-destructive-1000" />
          )}
        </div>
      </div>
      <div className="flex w-full flex-1 flex-col items-start justify-center gap-1">
        <div className="flex w-full items-center justify-between">
          <p className="flex-1 text-sm font-medium text-gray-900">User’s last input:</p>
          {!isActive && (
            <div className="flex items-center justify-center gap-1 rounded-3xl bg-gray-100 px-2 py-0.5">
              <ActiveConvStatusCircleIcon className="h-2 w-2 text-gray-400" />
              <p className="text-xs font-medium text-gray-400">{timePassedAfterInactive}min ago</p>
            </div>
          )}
        </div>
        <p className="text-xs font-normal text-gray-500">{isTyping ? <TypingIndicator /> : userLastInput}</p>
      </div>
    </div>
  );
};

const TypingIndicator = () => {
  return (
    <span className="inline-flex animate-pulse items-center">
      Typing
      <span className="ml-1 inline-flex">
        <span className="animate-typing-dot3">.</span>
        <span className="animate-typing-dot2">.</span>
        <span className="animate-typing-dot1">.</span>
      </span>
    </span>
  );
};

export default ConversationUserLastInputContainer;
