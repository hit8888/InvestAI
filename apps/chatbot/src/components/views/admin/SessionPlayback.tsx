import { ChatConfig } from "@meaku/core/types/config";
import ChatHeader from "@meaku/ui/components/layout/chat-header";
import ChatInput from "@meaku/ui/components/layout/chat-input";
import ChatMessage from "@meaku/ui/components/layout/chat-message";
import FeedbackContainter from "@meaku/ui/components/layout/feedback-containter";
import { useMemo } from "react";
import useInitializeSessionData from "../../../hooks/query/useInitializeSessionData";
import UnifiedResponseManager from "../../../managers/UnifiedResponseManager";
import { useAdminStore } from "../../../stores/useAdminStore";
import { useFeedbackStore } from "../../../stores/useFeedbackStore";

const SessionPlayback = () => {
  const sessionId = useAdminStore((state) => state.sessionId) ?? "";
  const prospectId = useAdminStore((state) => state.prospectId) ?? "";

  const activeResponseId =
    useFeedbackStore((state) => state.activeResponseId) ?? "";
  const setActiveResponseId = useFeedbackStore(
    (state) => state.setActiveResponseId,
  );

  const { session, isError, isFetching } = useInitializeSessionData({
    ignoreUpdatingLocalStorage: true,
    sessionId,
    prospectId,
  });

  const manager = useMemo(() => {
    if (!session) return;

    return new UnifiedResponseManager(session);
  }, [session]);

  const orgName = manager?.getOrgName() ?? "";
  const isC2FO = orgName?.toLowerCase() === "c2fo";
  const agentName = manager?.getAgentName() ?? "";
  const messages =
    manager?.getFormattedChatHistory({ isAdmin: true, isReadOnly: true }) ?? [];

  const activeResponse = messages.find(
    (message) => message.id == activeResponseId,
  );
  const isActiveResponseFeedbackNegative =
    activeResponse?.feedback?.positive_feedback === false;
  const showRatingOptions = isActiveResponseFeedbackNegative;
  const showRatingForm =
    activeResponse?.feedback?.positive_feedback === true ||
    (isActiveResponseFeedbackNegative && !!activeResponse?.feedback?.category);

  if (isError || isFetching) {
    return <></>;
  }

  return (
    <>
      <ChatHeader
        agentName={agentName}
        orgName={orgName}
        config={ChatConfig.EMBED}
      />
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
        activeRating={activeResponse?.feedback?.category ?? ""}
        existingFeedback={activeResponse?.feedback?.remarks ?? ""}
        handleCloseFeedbackContainer={() => setActiveResponseId(null)}
        handleShareFeedback={() => {}}
        isReadOnly={true}
      />
      <ChatInput
        disclaimerText={
          isC2FO
            ? "If the chat gets disrupted, please fill out the Contact Us form below and our team will reach out to provide continued support."
            : ""
        }
        handleSendUserMessage={() => {}}
        isAMessageBeingProcessed={true}
        disabled={true}
      />
    </>
  );
};

export default SessionPlayback;
