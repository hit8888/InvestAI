import { MessageViewType } from '@neuraltrade/core/types/common';
import { isHumanMessageInAdminView, isHumanMessageInDashboardView } from '@neuraltrade/core/utils/messageUtils';
import Typography from '../../Typography';
import { getMessageTimestamp } from '@neuraltrade/core/utils/index';

interface ChatMessageTimestampProps {
  messageViewType: MessageViewType;
  timestamp?: string;
}

const ChatMessageTimestamp = ({ messageViewType, timestamp }: ChatMessageTimestampProps) => {
  if (!timestamp || !(isHumanMessageInDashboardView(messageViewType) || isHumanMessageInAdminView(messageViewType))) {
    return null;
  }

  const formattedTimestamp = getMessageTimestamp(timestamp);

  return (
    <Typography variant="caption-12-medium" align="right" textColor="gray400" className="w-full">
      {formattedTimestamp}
    </Typography>
  );
};

export default ChatMessageTimestamp;
