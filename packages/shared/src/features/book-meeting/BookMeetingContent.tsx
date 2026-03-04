import { useCallback } from 'react';
import { MessageEventType, SendUserMessageParams } from '../../types/message';
import { FeatureHeader } from '../../components/FeatureHeader';
import { BookMeetingIcon } from '@neuraltrade/saral';
import { WaveLoader } from '../../components/WaveLoader';
import { useWsClient } from '../../hooks/useWsClient';
import { FeatureContentProps } from '../';
import BookMeetingFlowContainer from './components/BookMeetingFlowContainer';
import useBookMeetingContentHelper from './hooks/useBookMeetingContentHelper';
import useFeatureConfig from '../../hooks/useFeatureConfig';
import MessageErrorBoundary from '../../components/MessageErrorBoundary';
import { Markdown } from '@neuraltrade/saral';

const BookMeetingContent = ({ onClose, onExpand, isExpanded }: FeatureContentProps) => {
  const { sendUserMessage } = useWsClient();
  const featureConfig = useFeatureConfig('BOOK_MEETING');
  const description = featureConfig?.description ?? '';

  const handleSendUserMessage = useCallback(
    (data: SendUserMessageParams) => {
      sendUserMessage?.(data.message, data.overrides);
    },
    [sendUserMessage],
  );

  const { isFormDataLoading, filteredMessages, hasFilteredMessages } = useBookMeetingContentHelper({ onClose });
  const formArtifactMessage = filteredMessages.find((message) => message.event_type === MessageEventType.FORM_ARTIFACT);
  const formFilledMessage = formArtifactMessage
    ? filteredMessages.find(
        (message) =>
          message.event_type === MessageEventType.FORM_FILLED &&
          message.response_id === formArtifactMessage.response_id,
      )
    : undefined;

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
        icon={<BookMeetingIcon />}
        onClose={onClose}
        onExpand={onExpand}
        isExpanded={isExpanded}
        titleClassName="pr-20"
      />
      <div className="flex-1 flex flex-col items-center justify-center">
        <MessageErrorBoundary message={formArtifactMessage}>
          <FormArtifactMessage
            showMessage={!!(formArtifactMessage && !formFilledMessage && description)}
            description={description}
          />
          {getContent()}
        </MessageErrorBoundary>
      </div>
    </div>
  );
};

interface FormArtifactMessageProps {
  description: string;
  showMessage: boolean;
}

const FormArtifactMessage = ({ description, showMessage }: FormArtifactMessageProps) => {
  if (!showMessage) {
    return null;
  }
  return (
    <div className="w-full flex flex-col items-start justify-start p-4">
      <Markdown markdown={description} />
    </div>
  );
};

export default BookMeetingContent;
