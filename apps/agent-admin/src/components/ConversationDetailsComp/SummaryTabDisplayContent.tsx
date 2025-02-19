import { useConversationDetails } from '../../context/ConversationDetailsContext';
import { generateConversationSummaryContent } from '../../utils/common';
import SummaryTabContentItem from './SummaryTabContentItem';

const SummaryTabDisplayContent = () => {
  const { conversation, chatHistory } = useConversationDetails();
  if (!conversation)
    return (
      <p className="gradient-text h-screen w-full pt-10 text-center text-4xl font-normal text-gray-500">
        No Summary Data found
      </p>
    );

  const pageSummaryTabContentList = generateConversationSummaryContent(chatHistory, conversation);
  return (
    <div className="flex w-full flex-col items-start justify-center gap-4 py-4 pr-4">
      {pageSummaryTabContentList.map((item) => (
        <SummaryTabContentItem key={item.listKey} {...item} />
      ))}
    </div>
  );
};

export default SummaryTabDisplayContent;
