import MessagesContainer from './components/MessagesContainer';
import { MessageEventType, SendUserMessageParams } from '../../types/message';
import { FeatureHeader } from '../../components/FeatureHeader';
import { PhoneCall } from 'lucide-react';
import { Icons } from '@meaku/saral';
import { WaveLoader } from '../../components/WaveLoader';
import { useCommandBarStore } from '../../stores';
import { useWsClient } from '../../hooks/useWsClient';
import { FeatureContentProps } from '../';
import useSessionDataQuery from '../../network/http/queries/useSessionDataQuery';
import { useEffect } from 'react';

const BOOK_MEETING_INITIAL_MESSAGE_LIMIT = 1;

const BookMeetingContent = ({ onClose, onExpand, isExpanded }: FeatureContentProps) => {
  const { sendUserMessage } = useWsClient();
  const { messages, sessionData } = useCommandBarStore();

  useSessionDataQuery({}, { enabled: true });

  const bookMeetingEventMessageResponseId = messages.find(
    (message) => message.event_type === MessageEventType.BOOK_MEETING,
  )?.response_id;
  const messagesByResponseId = messages.filter((message) => message.response_id === bookMeetingEventMessageResponseId);

  const handleSendUserMessage = (data: SendUserMessageParams) => {
    sendUserMessage?.(data.message, data.overrides);
  };

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

  useEffect(() => {
    if (!sessionData) {
      return;
    }

    const isBookMeetingEventPresent = messages.some(
      (message) =>
        message.event_type === MessageEventType.BOOK_MEETING ||
        message.event_type === MessageEventType.FORM_ARTIFACT ||
        message.event_type === MessageEventType.CALENDAR_ARTIFACT,
    );

    if (!isBookMeetingEventPresent) {
      sendUserMessage('', {
        event_type: MessageEventType.BOOK_MEETING,
      });
    }
  }, [messages, sendUserMessage, sessionData]);

  return (
    <div className="h-full min-h-[400px] w-full flex-col space-y-1 rounded-lg border border-border bg-white shadow-lg">
      <FeatureHeader
        title="Book a Call"
        welcomeMessage={''}
        icon={<PhoneCall className="h-5 w-5" />}
        onClose={onClose}
        onExpand={onExpand}
        isExpanded={isExpanded}
      />
      {!sessionData ? (
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
