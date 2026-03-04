import { generateConversationSummaryContent } from '../../../../utils/common';
import SummaryTabContentItem from '../../../../components/ConversationDetailsComp/SummaryTabContentItem';
import { WebSocketMessage } from '@neuraltrade/core/types/webSocketData';
import { ConversationsTableDisplayContent } from '@neuraltrade/core/types/admin/admin';

type ConversationSummarySectionProps = {
  chatHistory: WebSocketMessage[];
  conversation?: ConversationsTableDisplayContent | null;
};

const IGNORE_LIST_KEYS = ['reachoutEmail', 'assignRep', 'intentScore'];

const ConversationSummarySection = ({ chatHistory, conversation }: ConversationSummarySectionProps) => {
  if (!conversation || chatHistory.length === 0) {
    return null;
  }

  const summaryItems = generateConversationSummaryContent(chatHistory, conversation).filter(
    (item) => item.listValue !== '-' && !IGNORE_LIST_KEYS.includes(item.listKey),
  );

  if (summaryItems.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      {summaryItems.map((item) => (
        <SummaryTabContentItem key={item.listKey} {...item} chatHistory={chatHistory} conversation={conversation} />
      ))}
    </div>
  );
};

export default ConversationSummarySection;
