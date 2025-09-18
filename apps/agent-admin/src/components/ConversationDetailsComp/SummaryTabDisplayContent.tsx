import SummaryTabDisplayContentShimmer from '../ShimmerComponent/SummaryTabDisplayContentShimmer';
import { useConversationDetails } from '../../context/ConversationDetailsContext';
import { generateConversationSummaryContent } from '../../utils/common';
import SummaryTabContentItem from './SummaryTabContentItem';

type IProps = {
  isLoading: boolean;
};

const SummaryTabDisplayContent = ({ isLoading }: IProps) => {
  const { conversation, chatHistory } = useConversationDetails();
  if (isLoading) {
    return <SummaryTabDisplayContentShimmer />;
  }
  if (!conversation)
    return (
      <p className="gradient-text h-screen w-full pt-10 text-center text-4xl font-normal text-gray-500">
        No Summary Data found
      </p>
    );

  const pageSummaryTabContentList = generateConversationSummaryContent(chatHistory, conversation).filter(
    (item) => item.listValue !== '-',
  );
  return (
    <div className="flex w-full flex-col items-start justify-center gap-4 py-4 pr-4">
      {pageSummaryTabContentList.map((item) => (
        <SummaryTabContentItem prospectId={conversation.prospect_id} key={item.listKey} {...item} />
      ))}
    </div>
  );
};

export default SummaryTabDisplayContent;
