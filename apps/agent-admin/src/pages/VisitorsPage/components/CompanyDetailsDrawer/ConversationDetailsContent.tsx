import { generateConversationSummaryContent } from '../../../../utils/common';
import SummaryTabContentItem from '../../../../components/ConversationDetailsComp/SummaryTabContentItem';
import { WebSocketMessage } from '@neuraltrade/core/types/webSocketData';
import { ConversationsTableDisplayContent } from '@neuraltrade/core/types/admin/admin';
import { motion, AnimatePresence } from 'framer-motion';
import ConversationDetailsLoading from './ConversationDetailsLoading';

type ConversationDetailsContentProps = {
  chatHistory: WebSocketMessage[];
  conversation?: ConversationsTableDisplayContent | null;
  isLoading?: boolean;
};

const ConversationDetailsContent = ({
  chatHistory,
  conversation,
  isLoading = false,
}: ConversationDetailsContentProps) => {
  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="conversation-loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.05, ease: 'linear' }}
        >
          <ConversationDetailsLoading />
        </motion.div>
      ) : (
        <motion.div
          key="conversation-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.05, ease: 'linear' }}
        >
          {!conversation ? (
            <div>No conversation data found</div>
          ) : (
            <div className="flex w-full flex-col gap-4 overflow-y-auto">
              {generateConversationSummaryContent(chatHistory, conversation)
                .filter((item) => item.listKey === 'conversationLog')
                .map((item) => (
                  <SummaryTabContentItem
                    key={item.listKey}
                    {...item}
                    chatHistory={chatHistory}
                    conversation={conversation}
                  />
                ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConversationDetailsContent;
