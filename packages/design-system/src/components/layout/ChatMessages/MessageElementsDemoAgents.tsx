import { MessageSenderRole, ViewType } from '@meaku/core/types/common';
import Typography from '../../Typography';
import { MessageAnalyticsEventData, WebSocketMessage } from '@meaku/core/types/webSocketData';
import MessageDataSources from './MessageDataSources';
import MessageFeedback from './MessageFeedback';
import MessageAnalytics from './MessageAnalytics';
import { getMessageTimestamp } from '@meaku/core/utils/index';
import { checkIsSalesResponseComplete, getAnalyticsEvent } from '@meaku/core/utils/messageUtils';
import { useState } from 'react';
import { FeedbackRequestPayload } from '@meaku/core/types/api/feedback_request';
import MessageItemLayout, { Gap, Padding, Orientation } from './MessageItemLayout';

interface IProps {
  viewType: ViewType;
  sessionId: string;
  invertTextColor: boolean;
  message: WebSocketMessage;
  showMessageElementForDemoAgents: boolean;
  messagesWithSameResponseId: WebSocketMessage[];
  initialFeedback: FeedbackRequestPayload | undefined;
}

const MessageElementsDemoAgents = ({
  message,
  sessionId,
  invertTextColor,
  viewType,
  initialFeedback,
  showMessageElementForDemoAgents,
  messagesWithSameResponseId,
}: IProps) => {
  const [feedback, setFeedback] = useState<FeedbackRequestPayload | undefined>(initialFeedback);

  const handleAddFeedback = (newFeedback: Partial<FeedbackRequestPayload>) => {
    const updatedFeedback = {
      ...newFeedback,
      positive_feedback: newFeedback.positive_feedback ?? false,
    };

    if (updatedFeedback.positive_feedback) {
      delete updatedFeedback.category;
    }

    setFeedback(updatedFeedback as FeedbackRequestPayload);
  };

  const handleRemoveFeedback = () => {
    setFeedback(undefined);
  };
  const timestamp = message?.timestamp;
  const formattedTimestamp = getMessageTimestamp(timestamp);

  const userMessageSameResponseIDForFeedback = messagesWithSameResponseId.find(
    (msg) => msg.role === MessageSenderRole.USER && msg.response_id === message.response_id,
  );

  const isSalesResponseComplete = checkIsSalesResponseComplete(messagesWithSameResponseId);

  const analyticsEvent = getAnalyticsEvent(messagesWithSameResponseId);
  const isAnalyticsEvent = !!analyticsEvent;

  // Check if the layout container should be shown
  const hasDocuments = (message.documents?.length ?? 0) > 0;
  const canShowFeedback = isSalesResponseComplete && !!userMessageSameResponseIDForFeedback;
  const showTimestamp = viewType !== ViewType.USER;

  const showLayoutContainer = hasDocuments || showTimestamp || canShowFeedback || isAnalyticsEvent;

  if (!showMessageElementForDemoAgents || !showLayoutContainer) return null;

  return (
    <MessageItemLayout orientation={Orientation.COLUMN} gap={Gap.MEDIUM} paddingInline={Padding.INLINE}>
      {hasDocuments && <MessageDataSources viewType={viewType} dataSources={message.documents ?? []} />}
      {showTimestamp && (
        <Typography className="w-full" variant="caption-12-medium" textColor="gray400">
          {formattedTimestamp}
        </Typography>
      )}
      {canShowFeedback && (
        <MessageFeedback
          sessionId={sessionId}
          viewType={viewType}
          message={message}
          userMessage={userMessageSameResponseIDForFeedback}
          feedback={feedback}
          onAddFeedback={handleAddFeedback}
          onRemoveFeedback={handleRemoveFeedback}
          invertTextColor={invertTextColor}
        />
      )}
      {isAnalyticsEvent && (
        <MessageAnalytics
          invertTextColor={invertTextColor}
          analytics={analyticsEvent.message.event_data as MessageAnalyticsEventData}
        />
      )}
    </MessageItemLayout>
  );
};

export default MessageElementsDemoAgents;
