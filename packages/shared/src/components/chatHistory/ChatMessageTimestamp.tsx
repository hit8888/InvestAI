import { Typography } from '@meaku/saral';
import { getMessageTimestamp, isHumanMessageInDashboardView } from '../../utils/common';
import { MessageViewType } from '../../utils/enum';

interface ChatMessageTimestampProps {
  timestamp?: string;
  messageViewType: MessageViewType;
}

const ChatMessageTimestamp = ({ timestamp, messageViewType }: ChatMessageTimestampProps) => {
  if (!timestamp || !isHumanMessageInDashboardView(messageViewType)) {
    return null;
  }

  const formattedTimestamp = getMessageTimestamp(timestamp);

  return (
    <Typography variant="body-small" className="w-full text-right text-muted-foreground">
      {formattedTimestamp}
    </Typography>
  );
};

export default ChatMessageTimestamp;
