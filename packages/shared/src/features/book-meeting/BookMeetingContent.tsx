import { useCallback } from 'react';
import { SendUserMessageParams } from '../../types/message';
import { FeatureHeader } from '../../components/FeatureHeader';
import { PhoneCall } from 'lucide-react';
import { WaveLoader } from '../../components/WaveLoader';
import { useWsClient } from '../../hooks/useWsClient';
import { FeatureContentProps } from '../';
import BookMeetingFlowContainer from './components/BookMeetingFlowContainer';
import useBookMeetingContentHelper from './hooks/useBookMeetingContentHelper';

const BookMeetingContent = ({ onClose, onExpand, isExpanded }: FeatureContentProps) => {
  const { sendUserMessage } = useWsClient();

  const handleSendUserMessage = useCallback(
    (data: SendUserMessageParams) => {
      sendUserMessage?.(data.message, data.overrides);
    },
    [sendUserMessage],
  );

  const { isFormDataLoading, filteredMessages, hasFilteredMessages } = useBookMeetingContentHelper({ onClose });

  const getContent = () => {
    // Show loading while fetching form data
    if (isFormDataLoading || !hasFilteredMessages) {
      return (
        <div className="flex h-full w-full items-center justify-center p-4">
          <WaveLoader />
        </div>
      );
    }

    return (
      <BookMeetingFlowContainer
        onExpand={onExpand!}
        messages={filteredMessages}
        handleSendUserMessage={handleSendUserMessage}
      />
    );
  };

  return (
    <div className="h-full min-h-[300px] w-full flex flex-col rounded-[20px] border border-border-dark !bg-white">
      <FeatureHeader
        title="Book a Call"
        welcomeMessage={''}
        icon={<PhoneCall className="h-5 w-5" />}
        onClose={onClose}
        onExpand={onExpand}
        isExpanded={isExpanded}
      />
      <div className="flex-1 flex items-center justify-center">{getContent()}</div>
    </div>
  );
};

export default BookMeetingContent;
