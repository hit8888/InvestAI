import { useConversationDetails } from '../../context/ConversationDetailsContext';
import AgentMessages from '@breakout/design-system/components/layout/AgentMessages';
import { OrbStatusEnum } from '@meaku/core/types/config';
import { getTenantIdentifier } from '@meaku/core/utils/index';

const LogTabDisplayContent = () => {
  const { chatHistory, conversation, feedbackData } = useConversationDetails();
  const logoURL = getTenantIdentifier()?.['logo'];

  return (
    <div className="flex max-h-[900px] w-full flex-col bg-gray-25">
      {chatHistory?.length && conversation?.session_id ? (
        <AgentMessages
          usingForAgent={false}
          sessionId={conversation?.session_id}
          isAMessageBeingProcessed={false}
          setActiveArtifact={() => {}}
          setDemoPlayingStatus={() => {}}
          orbState={OrbStatusEnum.idle}
          messages={chatHistory}
          showRightPanel={false}
          handleSendUserMessage={() => {}}
          initialSuggestedQuestions={[]}
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
