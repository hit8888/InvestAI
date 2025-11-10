import { useConversationDetails } from '../../context/ConversationDetailsContext';
import AgentMessages from '@breakout/design-system/components/layout/AgentMessages/index';
import { ViewType } from '@meaku/core/types/common';
import { OrbStatusEnum } from '@meaku/core/types/config';
import { useSessionStore } from '../../stores/useSessionStore';
import { EMPTY_ARRAY, EMPTY_FUNCTION } from '@meaku/core/constants/index';

const LogTabDisplayContent = () => {
  const { chatHistory, conversation, feedbackData } = useConversationDetails();
  const logoURL = useSessionStore((state) => state.activeTenant?.['logo']) ?? null;

  return (
    <div className="flex max-h-[900px] w-full flex-col overflow-auto bg-gray-25">
      {chatHistory?.length && conversation?.session_id ? (
        <AgentMessages
          viewType={ViewType.DASHBOARD}
          sessionId={conversation?.session_id}
          isAMessageBeingProcessed={false}
          setActiveArtifact={EMPTY_FUNCTION}
          setDemoPlayingStatus={EMPTY_FUNCTION}
          setIsArtifactPlaying={EMPTY_FUNCTION}
          orbState={OrbStatusEnum.idle}
          messages={chatHistory}
          showRightPanel={false}
          handleSendUserMessage={EMPTY_FUNCTION}
          initialSuggestedQuestions={EMPTY_ARRAY}
          allowFullWidthForText={true}
          showDemoPreQuestions={false}
          primaryColor={'rgb(var(--primary))'}
          logoURL={logoURL}
          allowFeedback={true}
          feedbackData={feedbackData}
          lastMessageResponseId={chatHistory[chatHistory.length - 1].response_id}
          orbLogoUrl={''}
          showOrbFromConfig={true}
          invertTextColor={false}
          enableScrollToBottom={false}
        />
      ) : (
        <p className="gradient-text mt-20 h-screen w-full text-center text-4xl font-semibold">
          There is No Log for this Session.
        </p>
      )}
    </div>
  );
};

export default LogTabDisplayContent;
