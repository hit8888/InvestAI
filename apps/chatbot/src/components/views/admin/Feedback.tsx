import { ChatConfig } from '@meaku/core/types/config';
import { DetailedFeedbackPayload, FeedbackEnum, InitialFeedbackPayload } from '@meaku/core/types/feedback';
import ChatHeader from '@breakout/design-system/components/layout/chat-header';
import ChatInput from '@breakout/design-system/components/layout/chat-input';
import ChatMessage from '@breakout/design-system/components/layout/chat-message';
import FeedbackContainer from '@breakout/design-system/components/layout/feedback-containter';
import { useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';
import useResponseFeedback from '@meaku/core/queries/mutation/useResponseFeedback';

import useLocalStorageSession from '../../../hooks/useLocalStorageSession';
import useWebSocketChat from '../../../hooks/useWebSocketChat';
import { useFeedbackStore } from '../../../stores/useFeedbackStore';
import { useMessageStore } from '../../../stores/useMessageStore';
import { trackError } from '../../../utils/error';
import useUnifiedConfigurationResponseManager from '../../../pages/shared/hooks/useUnifiedConfigurationResponseManager';
import { ApiProviderContext } from '../../../pages/shared/ApiProvider/Context';
import { useContextSelector } from 'use-context-selector';

const Feedback = () => {
  const sessionQuery = useContextSelector(ApiProviderContext, (state) => state.sessionQuery);

  const { handleSendUserMessage } = useWebSocketChat();

  const { handleUpdateSessionData } = useLocalStorageSession();
  const unifiedConfigurationResponseManager = useUnifiedConfigurationResponseManager();

  const isAMessageBeingProcessed = useMessageStore((state) => state.isAMessageBeingProcessed);
  const messages = useMessageStore((state) => state.messages);
  const initialSuggestedQuestions = unifiedConfigurationResponseManager.getInitialSuggestedQuestions({
    isAdmin: false,
    isReadOnly: false,
  });

  const handleAddMessageFeedback = useMessageStore((state) => state.handleAddMessageFeedback);
  const handleRemoveMessageFeedback = useMessageStore((state) => state.handleRemoveMessageFeedback);

  const activeResponseId = useFeedbackStore((state) => state.activeResponseId) ?? '';
  const setActiveResponseId = useFeedbackStore((state) => state.setActiveResponseId);

  const { mutateAsync: handlePostResponseFeedback } = useResponseFeedback({
    onError: (error, payload) => {
      trackError(error, {
        action: 'handlePostResponseFeedback',
        sessionId: payload.sessionId,
        component: 'Feedback',
      });

      toast.error('An error occurred while sharing feedback.');
      handleRemoveMessageFeedback(payload.payload.response_id);
      handleCloseFeedbackContainer();
    },
    onSuccess: (_data, { payload: { positive_feedback, category, remarks } }) => {
      let isCompleteFeedback = false;

      if (positive_feedback && remarks) isCompleteFeedback = true;
      if (!positive_feedback && category && remarks) isCompleteFeedback = true;

      if (isCompleteFeedback) {
        toast.success('Thanks for your feedback!');
        setActiveResponseId(null);
      }
    },
  });

  const manager = useUnifiedConfigurationResponseManager();
  const orgName = manager.getOrgName() ?? '';
  const sessionId = manager.getSessionId() ?? '';
  const configuration = manager.getConfig();
  const disclaimerText = configuration?.body.disclaimer_message ?? '';
  const agentName = manager.getAgentName() ?? '';

  const activeResponse = messages.find((message) => message.id == activeResponseId);
  const isActiveResponseFeedbackNegative = activeResponse?.feedback?.positive_feedback === false;
  const showRatingOptions = isActiveResponseFeedbackNegative;
  const showRatingForm =
    activeResponse?.feedback?.positive_feedback === true ||
    (isActiveResponseFeedbackNegative && !!activeResponse?.feedback?.category);

  const handleShareInitialFeedback = useCallback(
    async ({ responseId, feedbackType }: InitialFeedbackPayload) => {
      setActiveResponseId(responseId);
      handleAddMessageFeedback(responseId, {
        positive_feedback: feedbackType === FeedbackEnum.THUMBS_UP,
      });

      await handlePostResponseFeedback({
        sessionId,
        payload: {
          response_id: responseId,
          positive_feedback: feedbackType === FeedbackEnum.THUMBS_UP,
        },
      });
    },
    [sessionId],
  );

  const handleShareDetailedFeedback = async ({ feedbackOption, feedback }: DetailedFeedbackPayload) => {
    if (feedbackOption) handleAddMessageFeedback(activeResponseId, { category: feedbackOption });

    const response = messages.find((message) => message.id == activeResponseId);

    if (!response) {
      toast.error('An error occurred while sharing feedback.');
      return;
    }

    handleAddMessageFeedback(activeResponseId, {
      positive_feedback: response.feedback?.positive_feedback ?? false,
      category: feedbackOption,
      remarks: feedback,
    });

    await handlePostResponseFeedback({
      sessionId,
      payload: {
        response_id: activeResponseId,
        positive_feedback: response.feedback?.positive_feedback ?? false,
        category: feedbackOption,
        remarks: feedback,
      },
    });
  };

  const handleCloseFeedbackContainer = () => {
    setActiveResponseId(null);
  };

  const handleRefreshChat = () => {
    handleUpdateSessionData({
      sessionId: undefined,
      prospectId: undefined,
    });

    window.location.reload();
  };

  const handleChatInputOnChangeCallback = () => {
    if (sessionId) return;
    sessionQuery.refetch();
  };

  const handleCopySession = () => {
    try {
      const prospectId = manager.getProspectId();
      const hashedSessionData = `${sessionId}|${prospectId}`;

      navigator.clipboard.writeText(hashedSessionData);
      toast.success('Session hash copied.');
    } catch (error) {
      trackError(error, {
        action: 'handleCopySessionHash',
        component: 'Feedback',
      });

      toast.error('An error occurred while copying session hash to clipboard.');
    }
  };

  // The timeout is added for the transition to complete before clearing the feedback states
  useEffect(() => {
    if (!activeResponseId) {
      setTimeout(() => {
        setActiveResponseId(null);
      }, 100);
    }
  }, [activeResponseId]);

  return (
    <>
      <ChatHeader
        agentName={agentName}
        orgName={orgName}
        config={ChatConfig.EMBED}
        showRestartButton={true}
        handleRestart={handleRefreshChat}
        handleCopySession={handleCopySession}
      />
      <ChatMessage
        agentName={agentName}
        messages={messages}
        suggestedQuestions={initialSuggestedQuestions}
        activeResponseId={activeResponseId}
        handleSuggestedQuestionOnClick={handleSendUserMessage}
        handleShareInitialFeedback={handleShareInitialFeedback}
      />
      <FeedbackContainer
        key={activeResponseId}
        showFeedbackContainer={Boolean(activeResponseId)}
        showFeedbackRating={showRatingOptions}
        showFeedbackForm={showRatingForm}
        activeRating={activeResponse?.feedback?.category ?? ''}
        existingFeedback={activeResponse?.feedback?.remarks ?? ''}
        handleCloseFeedbackContainer={handleCloseFeedbackContainer}
        handleShareFeedback={handleShareDetailedFeedback}
      />
      <ChatInput
        disclaimerText={disclaimerText}
        handleChatInputOnChangeCallback={handleChatInputOnChangeCallback}
        handleSendUserMessage={handleSendUserMessage}
        isAMessageBeingProcessed={isAMessageBeingProcessed}
      />
    </>
  );
};

export default Feedback;
