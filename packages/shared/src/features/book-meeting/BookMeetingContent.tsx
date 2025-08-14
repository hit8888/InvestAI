import MessagesContainer from './components/MessagesContainer';
import { SendUserMessageParams, Message, MessageEventType } from '../../types/message';
import { FeatureHeader } from '../../components/FeatureHeader';
import { PhoneCall } from 'lucide-react';
import { Icons } from '@meaku/saral';
import { WaveLoader } from '../../components/WaveLoader';

const BOOK_MEETING_INITIAL_MESSAGE_LIMIT = 1;

type BookMeetingContentProps = {
  messages: Message[];
  handleSendUserMessage: (data: SendUserMessageParams) => void;
  onClose: () => void;
  onExpand: () => void;
  isInitialising: boolean;
};

const BookMeetingContent = ({
  messages,
  handleSendUserMessage,
  onClose,
  onExpand,
  isInitialising,
}: BookMeetingContentProps) => {
  const bookMeetingEventMessageResponseId = messages.find(
    (message) => message.event_type === MessageEventType.BOOK_MEETING,
  )?.response_id;
  const messagesByResponseId = messages.filter((message) => message.response_id === bookMeetingEventMessageResponseId);

  const getContent = () => {
    if (messagesByResponseId.length === BOOK_MEETING_INITIAL_MESSAGE_LIMIT) {
      return (
        <div className="flex h-full w-full items-center justify-center p-4">
          <WaveLoader />
        </div>
      );
    }
    return (
      <MessagesContainer
        messages={messagesByResponseId}
        enableScrollToBottom={true}
        handleSendUserMessage={handleSendUserMessage}
      />
    );
  };
  return (
    <div className="h-full min-h-[400px] w-full flex-col space-y-1 rounded-lg border border-border bg-white shadow-lg">
      <FeatureHeader
        title="Book a Call"
        welcomeMessage={''}
        icon={<PhoneCall className="h-5 w-5" />}
        onClose={onClose}
        onExpand={onExpand}
      />
      {isInitialising ? (
        <div className="flex h-full w-full items-center justify-center gap-3 p-4">
          <Icons.CircleDashed className="h-5 w-5 animate-spin text-primary" />
          <p className="text-base text-muted-foreground">Initialising...</p>
        </div>
      ) : (
        getContent()
      )}
    </div>
  );
};

export default BookMeetingContent;
