import { useCallback } from 'react';
import { MessageEventType, SendUserMessageParams } from '../../types/message';
import { FeatureHeader } from '../../components/FeatureHeader';
import { BookMeetingIcon, Typography } from '@meaku/saral';
import { WaveLoader } from '../../components/WaveLoader';
import { useWsClient } from '../../hooks/useWsClient';
import { FeatureContentProps } from '../';
import BookMeetingFlowContainer from './components/BookMeetingFlowContainer';
import useBookMeetingContentHelper from './hooks/useBookMeetingContentHelper';
import useFeatureConfig from '../../hooks/useFeatureConfig';
import MessageErrorBoundary from '../../components/MessageErrorBoundary';

const BookMeetingContent = ({ onClose, onExpand, isExpanded }: FeatureContentProps) => {
  const { sendUserMessage } = useWsClient();
  const featureConfig = useFeatureConfig('BOOK_MEETING');
  const headerTitle = featureConfig?.module_configs?.header ?? '';
  const subHeaderTitle = featureConfig?.module_configs?.sub_header ?? '';

  const handleSendUserMessage = useCallback(
    (data: SendUserMessageParams) => {
      sendUserMessage?.(data.message, data.overrides);
    },
    [sendUserMessage],
  );

  const { isFormDataLoading, filteredMessages, hasFilteredMessages } = useBookMeetingContentHelper({ onClose });
  const formArtifactMessage = filteredMessages.find((message) => message.event_type === MessageEventType.FORM_ARTIFACT);

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
      />
      <div className="flex-1 flex flex-col items-center justify-center">
        <MessageErrorBoundary message={formArtifactMessage}>
          <FormArtifactMessage
            showMessage={!!(formArtifactMessage && headerTitle && subHeaderTitle)}
            headerTitle={headerTitle}
            subHeaderTitle={subHeaderTitle}
          />
          {getContent()}
        </MessageErrorBoundary>
      </div>
    </div>
  );
};

interface FormArtifactMessageProps {
  headerTitle: string;
  subHeaderTitle: string;
  showMessage: boolean;
}

const FormArtifactMessage = ({ headerTitle, subHeaderTitle, showMessage }: FormArtifactMessageProps) => {
  if (!showMessage) {
    return null;
  }
  return (
    <div className="flex flex-col p-4 gap-4 items-start justify-start">
      <Typography variant="heading" fontWeight="semibold">
        {headerTitle}
      </Typography>
      <Typography variant="body" className="text-gray-400">
        {subHeaderTitle}
      </Typography>
    </div>
  );
};

export default BookMeetingContent;
