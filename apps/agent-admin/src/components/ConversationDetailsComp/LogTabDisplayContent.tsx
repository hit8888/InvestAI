import { Message } from '@meaku/core/types/agent';
import { useConversationDetails } from '../../context/ConversationDetailsContext';
import AgentMessages from '@breakout/design-system/components/layout/AgentMessages';
import { OrbStatusEnum } from '@meaku/core/types/config';
import { getTenantFromLocalStorage } from '../../utils/common';

const LogTabDisplayContent = () => {
  const { chatHistory, conversation } = useConversationDetails();
  const tenantName = getTenantFromLocalStorage();
  return (
    <div className="flex max-h-[800px] w-full flex-col">
      {chatHistory?.length && conversation?.session_id ? (
        <AgentMessages
          tenantName={tenantName}
          usingForAgent={false}
          sessionId={conversation.session_id}
          isAMessageBeingProcessed={false}
          setActiveArtifact={() => {}}
          setDemoPlayingStatus={() => {}}
          handleAddMessageFeedback={() => {}}
          handleRemoveMessageFeedback={() => {}}
          orbState={OrbStatusEnum.idle}
          messages={chatHistory as Message[]}
          showRightPanel={false}
          handleSendUserMessage={() => {}}
          initialSuggestedQuestions={[]}
          allowFullWidthForText={true}
          showDemoPreQuestions={false}
          primaryColor={'rgb(var(--primary))'}
          allowFeedback={true}
        />
      ) : (
        <p className="w-full text-center text-2xl font-semibold text-gray-900">
          There is No Log Data for this Session.
        </p>
      )}
    </div>
  );
};

export default LogTabDisplayContent;
