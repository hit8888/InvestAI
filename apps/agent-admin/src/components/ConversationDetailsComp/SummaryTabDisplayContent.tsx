import { useConversationDetails } from '../../context/ConversationDetailsContext';
import { generateConversationSummaryContent } from '../../utils/common';
import { ConversationsTableDisplayContent } from '@meaku/core/types/admin/admin';
import { Message } from '@meaku/core/types/agent';
import SummaryTabContentItem from './SummaryTabContentItem';

const SummaryTabDisplayContent = () => {
  const { conversation, chatHistory } = useConversationDetails();
  const pageSummaryTabContentList = generateConversationSummaryContent(
    chatHistory as Message[],
    conversation as ConversationsTableDisplayContent,
  );
  return (
    <div className="flex w-full flex-col items-start justify-center gap-4 py-4 pr-4">
      {pageSummaryTabContentList.map((item) => (
        <SummaryTabContentItem key={item.listKey} {...item} />
      ))}
    </div>
  );
};

export default SummaryTabDisplayContent;
