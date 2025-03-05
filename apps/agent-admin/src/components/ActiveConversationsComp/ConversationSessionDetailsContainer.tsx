import ActiveConvSessionDetailsIcon from '@breakout/design-system/components/icons/active-conv-session-details-icon';

type IConversationSessionDetailsContainerProps = {
  sessionDuration: string; // In minutes
  messageCount: number; // Number of messages - AI + User
};

const ConversationSessionDetailsContainer = ({
  sessionDuration,
  messageCount,
}: IConversationSessionDetailsContainerProps) => {
  return (
    <div className="flex w-full flex-1 items-center gap-4 rounded-lg bg-gray-25 p-2">
      <div className="flex items-center gap-2 self-stretch">
        <div className="flex items-center rounded-lg bg-primary/10 p-1">
          <ActiveConvSessionDetailsIcon className="h-4 w-4 text-primary" />
        </div>
        <p className="text-sm font-medium text-gray-500">Session details:</p>
      </div>
      <p className="flex-1 text-right text-base text-gray-900">{`${sessionDuration} min / ${messageCount} messages`}</p>
    </div>
  );
};

export default ConversationSessionDetailsContainer;
