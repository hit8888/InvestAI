import { ChatConfig } from '@meaku/core/types/config';
import ChatHeader from '@breakout/design-system/components/layout/chat-header';
import ChatInput from '@breakout/design-system/components/layout/chat-input';
import ChatMessage from '@breakout/design-system/components/layout/chat-message';
import FeedbackContainter from '@breakout/design-system/components/layout/feedback-containter';
import { useFeedbackStore } from '../../../stores/useFeedbackStore';
import useUnifiedConfigurationResponseManager from '../../../pages/shared/hooks/useUnifiedConfigurationResponseManager';

const SessionPlayback = () => {
  const activeResponseId = useFeedbackStore((state) => state.activeResponseId) ?? '';
  const setActiveResponseId = useFeedbackStore((state) => state.setActiveResponseId);

  const manager = useUnifiedConfigurationResponseManager();
  const orgName = manager?.getOrgName() ?? '';
  const isC2FO = orgName?.toLowerCase() === 'c2fo';
  const agentName = manager?.getAgentName() ?? '';
  const messages = manager?.getFormattedChatHistory({ isAdmin: true, isReadOnly: true }) ?? [];

  const activeResponse = messages.find((message) => message.id == activeResponseId);
  const isActiveResponseFeedbackNegative = activeResponse?.feedback?.positive_feedback === false;
  const showRatingOptions = isActiveResponseFeedbackNegative;
  const showRatingForm =
    activeResponse?.feedback?.positive_feedback === true ||
    (isActiveResponseFeedbackNegative && !!activeResponse?.feedback?.category);

  return (
    <>
      <ChatHeader agentName={agentName} orgName={orgName} config={ChatConfig.EMBED} />
      <ChatMessage
        agentName={agentName}
        messages={messages}
        suggestedQuestions={[]}
        handleSuggestedQuestionOnClick={() => {}}
        handleShowFeedback={(responseId) => {
          setActiveResponseId(responseId);
        }}
        activeResponseId={activeResponseId}
      />
      <FeedbackContainter
        key={activeResponseId}
        showFeedbackContainer={Boolean(activeResponseId)}
        showFeedbackRating={showRatingOptions}
        showFeedbackForm={showRatingForm}
        activeRating={activeResponse?.feedback?.category ?? ''}
        existingFeedback={activeResponse?.feedback?.remarks ?? ''}
        handleCloseFeedbackContainer={() => setActiveResponseId(null)}
        handleShareFeedback={() => {}}
        isReadOnly={true}
      />
      <ChatInput
        disclaimerText={
          isC2FO
            ? 'If the chat gets disrupted, please fill out the Contact Us form below and our team will reach out to provide continued support.'
            : ''
        }
        handleSendUserMessage={() => {}}
        isAMessageBeingProcessed={true}
        disabled={true}
      />
    </>
  );
};

export default SessionPlayback;
