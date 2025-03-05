import useChatAgentScript from '../../hooks/useChatAgentScript';
import { getTenantFromLocalStorage, getUserEmailFromLocalStorage } from '../../utils/common';

const JoinConversationChatAreaBody = () => {
  const tenantName = getTenantFromLocalStorage();
  const userEmail = getUserEmailFromLocalStorage() || '';

  useChatAgentScript(tenantName, userEmail);
  return (
    <div className="relative z-0 h-full w-full rounded-2xl border border-gray-200">
      <div id="embedded-breakout-agent" className="relative h-full w-full"></div>
    </div>
  );
};

export default JoinConversationChatAreaBody;
