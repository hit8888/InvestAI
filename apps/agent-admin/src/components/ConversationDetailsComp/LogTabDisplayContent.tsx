import { Message } from '@meaku/core/types/agent';
import { useConversationDetails } from '../../context/ConversationDetailsContext';
import AgentMessage from '@breakout/design-system/components/layout/agent-message';

const LogTabDisplayContent = () => {
  const { chatHistory } = useConversationDetails();
  return (
    <div className="flex max-h-[800px] w-full flex-col">
      {chatHistory?.length ? (
        <AgentMessage
          forAgentChatbot={false}
          agentName={'agentName'}
          messages={chatHistory as Message[]}
          suggestedQuestions={[]}
          handleSuggestedQuestionOnClick={() => {}}
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
