import { Message } from '@meaku/core/types/agent';
import { useConversationDetails } from '../../context/ConversationDetailsContext';
import AgentMessages from '@breakout/design-system/components/layout/AgentMessages';
import { OrbStatusEnum } from '@meaku/core/types/config';
import { getTenantFromLocalStorage } from '../../utils/common';
import { getTenantIdentifier } from '@meaku/core/utils/index';

const LogTabDisplayContent = () => {
  const { chatHistory, conversation } = useConversationDetails();
  const tenantName = getTenantFromLocalStorage();
  const logoURL = getTenantIdentifier()?.['logo'];
  return (
    <div className="flex max-h-[800px] w-full flex-col bg-gray-25">
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
          logoURL={logoURL}
          allowFeedback={true}
        />
      ) : (
        <p className="gradient-text mt-20 w-full text-center text-4xl font-semibold">
          There is No Log for this Session.
        </p>
      )}
    </div>
  );
};

export default LogTabDisplayContent;
