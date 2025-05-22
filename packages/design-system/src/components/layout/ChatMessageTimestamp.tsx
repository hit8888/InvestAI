import { MessageViewType } from '@meaku/core/types/common';
import { isHumanMessageInDashboardView } from '@meaku/core/utils/messageUtils';
import Typography from '../Typography';
import { getMessageTimestamp } from '@meaku/core/utils/index';

interface ChatMessageTimestampProps {
  messageViewType: MessageViewType;
  timestamp?: string;
}

const ChatMessageTimestamp = ({ messageViewType, timestamp }: ChatMessageTimestampProps) => {
  if (!timestamp || !isHumanMessageInDashboardView(messageViewType)) {
    return null;
  }

  const formattedTimestamp = getMessageTimestamp(timestamp);

  return (
    <Typography variant="caption-12-medium" align="right" textColor="gray400" className="!-mt-4 w-full">
      {formattedTimestamp}
    </Typography>
  );
};

export default ChatMessageTimestamp;
