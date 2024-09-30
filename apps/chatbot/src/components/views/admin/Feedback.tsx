import { ChatConfig } from "@meaku/core/types/config";
import {
  DetailedFeedbackPayload,
  FeedbackEnum,
  InitialFeedbackPayload,
} from "@meaku/core/types/feedback";
import ChatHeader from "@meaku/ui/components/layout/chat-header";
import ChatInput from "@meaku/ui/components/layout/chat-input";
import ChatMessage from "@meaku/ui/components/layout/chat-message";
import FeedbackContainer from "@meaku/ui/components/layout/feedback-containter";
import { useEffect, useMemo } from "react";
import useResponseFeedback from "../../../hooks/mutation/useResponseFeedback";
import useInitializeSessionData from "../../../hooks/query/useInitializeSessionData";
import useLocalStorageSession from "../../../hooks/useLocalStorageSession";
import useWebSocketChat from "../../../hooks/useWebSocketChat";
import InitializeSessionResponseManager from "../../../managers/InitializeSessionResponseManager";
import { useFeedbackStore } from "../../../stores/useFeedbackStore";
import { useMessageStore } from "../../../stores/useMessageStore";

const Feedback = () => {
  const { session } = useInitializeSessionData();
  const { handleSendUserMessage } = useWebSocketChat();

  const { handleUpdateSessionData } = useLocalStorageSession();

  const isAMessageBeingProcessed = useMessageStore(
    (state) => state.isAMessageBeingProcessed,
  );
  const messages = useMessageStore((state) => state.messages);
  const suggestedQuestions = useMessageStore(
    (state) => state.suggestedQuestions,
  );
  const handleAddMessageFeedback = useMessageStore(
    (state) => state.handleAddMessageFeedback,
  );

  // const activeFeedbackType = useFeedbackStore(
  //   (state) => state.activeFeedbackType,
  // );
  const setActiveFeedbackType = useFeedbackStore(
    (state) => state.setActiveFeedbackType,
  );
  const activeRating = useFeedbackStore((state) => state.activeRating) ?? "";
  const setActiveRating = useFeedbackStore((state) => state.setActiveRating);
  const activeResponseId =
    useFeedbackStore((state) => state.activeResponseId) ?? "";
  const setActiveResponseId = useFeedbackStore(
    (state) => state.setActiveResponseId,
  );
  const showRatingOptions = useFeedbackStore(
    (state) => state.showRatingOptions,
  );
  const setShowRatingOptions = useFeedbackStore(
    (state) => state.setShowRatingOptions,
  );
  const showRatingForm = useFeedbackStore((state) => state.showRatingForm);
  const setShowRatingForm = useFeedbackStore(
    (state) => state.setShowRatingForm,
  );
  const handleClearFeedback = useFeedbackStore(
    (state) => state.handleClearFeedback,
  );

  const { mutateAsync: handlePostResponseFeedback } = useResponseFeedback();

  const manager = useMemo(() => {
    if (!session) return;

    return new InitializeSessionResponseManager(session);
  }, [session]);

  const orgName = manager?.getOrgName() ?? "";
  const isC2FO = orgName?.toLowerCase() === "c2fo";
  const sessionId = manager?.getSessionId() ?? "";

  const handleShareInitialFeedback = async ({
    responseId,
    feedbackType,
  }: InitialFeedbackPayload) => {
    setActiveResponseId(responseId);
    setActiveFeedbackType(feedbackType);
    handleAddMessageFeedback(responseId, {
      feedback_type: feedbackType,
      feedback: "",
    });

    switch (feedbackType) {
      case FeedbackEnum.THUMBS_UP:
        setShowRatingForm(true);
        setShowRatingOptions(false);
        break;

      case FeedbackEnum.THUMBS_DOWN:
        setShowRatingOptions(true);
        setShowRatingForm(false);
        break;
    }

    await handlePostResponseFeedback({
      sessionId,
      payload: {
        response_id: responseId,
        positive_feedback: feedbackType === FeedbackEnum.THUMBS_UP,
      },
    });
  };

  const handleShareDetailedFeedback = async ({
    feedbackOption,
    feedback,
  }: DetailedFeedbackPayload) => {
    if (feedbackOption) setActiveRating(feedbackOption);

    if (!feedback) {
      setShowRatingForm(true);
    }

    await handlePostResponseFeedback({
      sessionId,
      payload: {
        response_id: activeResponseId,
        category: feedbackOption,
        remarks: feedback,
      },
    });
  };

  const handleCloseFeedbackContainer = () => {
    setActiveResponseId(null);
    setActiveRating(null);
  };

  const handleRefreshChat = () => {
    handleUpdateSessionData({
      sessionId: undefined,
      prospectId: undefined,
    });

    window.location.reload();
  };

  // The timeout is added for the transition to complete before clearing the feedback states
  useEffect(() => {
    if (!activeResponseId) {
      setTimeout(() => {
        handleClearFeedback();
      }, 100);
    }
  }, [activeResponseId]);

  return (
    <>
      <ChatHeader
        orgName={orgName}
        config={ChatConfig.EMBED}
        showRestartButton={true}
        handleRestart={handleRefreshChat}
      />
      <ChatMessage
        messages={messages}
        suggestedQuestions={suggestedQuestions}
        activeResponseId={activeResponseId}
        handleSuggestedQuestionOnClick={handleSendUserMessage}
        handleShareInitialFeedback={handleShareInitialFeedback}
      />
      <FeedbackContainer
        showFeedbackContainer={Boolean(activeResponseId)}
        showFeedbackRating={showRatingOptions}
        showFeedbackForm={showRatingForm}
        activeRating={activeRating}
        handleCloseFeedbackContainer={handleCloseFeedbackContainer}
        handleShareFeedback={handleShareDetailedFeedback}
      />
      <ChatInput
        disclaimerText={
          isC2FO
            ? "If the chat gets disrupted, please fill out the Contact Us form below and our team will reach out to provide continued support."
            : ""
        }
        handleSendUserMessage={handleSendUserMessage}
        isAMessageBeingProcessed={isAMessageBeingProcessed}
      />
    </>
  );
};

export default Feedback;
