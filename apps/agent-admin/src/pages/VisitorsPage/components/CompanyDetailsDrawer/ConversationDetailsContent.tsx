import { generateConversationSummaryContent } from '../../../../utils/common';
import SummaryTabContentItem from '../../../../components/ConversationDetailsComp/SummaryTabContentItem';
import { WebSocketMessage } from '@meaku/core/types/webSocketData';
import { ConversationsTableDisplayContent } from '@meaku/core/types/admin/admin';

type ConversationDetailsContentProps = {
  chatHistory: WebSocketMessage[];
  conversation?: ConversationsTableDisplayContent | null;
};

const IGNORE_LIST_KEYS = ['reachoutEmail', 'assignRep'];

const ConversationDetailsContent = ({ chatHistory, conversation }: ConversationDetailsContentProps) => {
  if (!conversation) {
    return <div>No conversation data found</div>;
  }

  const pageSummaryTabContentList = generateConversationSummaryContent(chatHistory, conversation).filter(
    (item) => item.listValue !== '-' && !IGNORE_LIST_KEYS.includes(item.listKey),
  );

  return (
    <div className="flex w-[calc(50vw-4rem)] flex-col gap-4 overflow-y-auto">
      {pageSummaryTabContentList.map((item) => (
        <SummaryTabContentItem key={item.listKey} {...item} chatHistory={chatHistory} conversation={conversation} />
      ))}
    </div>
  );
};

export default ConversationDetailsContent;
