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
import { useCallback, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import useResponseFeedback from "../../../hooks/mutation/useResponseFeedback";
import useInitializeSessionData from "../../../hooks/query/useInitializeSessionData";
import useLocalStorageSession from "../../../hooks/useLocalStorageSession";
import useWebSocketChat from "../../../hooks/useWebSocketChat";
import InitializeSessionResponseManager from "../../../managers/InitializeSessionResponseManager";
import { useFeedbackStore } from "../../../stores/useFeedbackStore";
import { useMessageStore } from "../../../stores/useMessageStore";
import { trackError } from "../../../utils/error";

const Feedback = () => {
  const { session, refetch: fetchSessionData } = useInitializeSessionData();
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
  const handleRemoveMessageFeedback = useMessageStore(
    (state) => state.handleRemoveMessageFeedback,
  );

  const activeResponseId =
    useFeedbackStore((state) => state.activeResponseId) ?? "";
  const setActiveResponseId = useFeedbackStore(
    (state) => state.setActiveResponseId,
  );

  const { mutateAsync: handlePostResponseFeedback } = useResponseFeedback({
    onError: (error, payload) => {
      trackError(error, {
        action: "handlePostResponseFeedback",
        sessionId: payload.sessionId,
        component: "Feedback",
      });

      toast.error("An error occurred while sharing feedback.");
      handleRemoveMessageFeedback(payload.payload.response_id);
      handleCloseFeedbackContainer();
    },
    onSuccess: (
      _data,
      { payload: { positive_feedback, category, remarks } },
    ) => {
      let isCompleteFeedback = false;

      if (positive_feedback && remarks) isCompleteFeedback = true;
      if (!positive_feedback && category && remarks) isCompleteFeedback = true;

      if (isCompleteFeedback) {
        toast.success("Thanks for your feedback!");
        setActiveResponseId(null);
      }
    },
  });

  const manager = useMemo(() => {
    if (!session) return;

    return new InitializeSessionResponseManager(session);
  }, [session]);

  const orgName = manager?.getOrgName() ?? "";
  const isC2FO = orgName?.toLowerCase() === "c2fo";
  const sessionId = manager?.getSessionId() ?? "";

  const activeResponse = messages.find(
    (message) => message.id == activeResponseId,
  );
  const isActiveResponseFeedbackNegative =
    activeResponse?.feedback?.positive_feedback === false;
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
    [session, sessionId],
  );

  const handleShareDetailedFeedback = async ({
    feedbackOption,
    feedback,
  }: DetailedFeedbackPayload) => {
    if (feedbackOption)
      handleAddMessageFeedback(activeResponseId, { category: feedbackOption });

    const response = messages.find((message) => message.id == activeResponseId);

    if (!response) {
      toast.error("An error occurred while sharing feedback.");
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

    fetchSessionData();
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
        key={activeResponseId}
        showFeedbackContainer={Boolean(activeResponseId)}
        showFeedbackRating={showRatingOptions}
        showFeedbackForm={showRatingForm}
        activeRating={activeResponse?.feedback?.category ?? ""}
        existingFeedback={activeResponse?.feedback?.remarks ?? ""}
        handleCloseFeedbackContainer={handleCloseFeedbackContainer}
        handleShareFeedback={handleShareDetailedFeedback}
      />
      <ChatInput
        disclaimerText={
          isC2FO
            ? "If the chat gets disrupted, please fill out the Contact Us form below and our team will reach out to provide continued support."
            : ""
        }
        handleChatInputOnChangeCallback={handleChatInputOnChangeCallback}
        handleSendUserMessage={handleSendUserMessage}
        isAMessageBeingProcessed={isAMessageBeingProcessed}
      />
    </>
  );
};

export default Feedback;
