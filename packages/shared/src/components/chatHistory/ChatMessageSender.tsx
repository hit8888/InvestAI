import { isHumanMessageInDashboardView } from '../../utils/common';
import { MessageSenderRole, MessageViewType } from '../../utils/enum';
import { Typography } from '@meaku/saral';

interface ChatMessageSenderProps {
  messageViewType: MessageViewType;
  role: MessageSenderRole;
}

const ChatMessageSender = ({ role, messageViewType }: ChatMessageSenderProps) => {
  if (!isHumanMessageInDashboardView(messageViewType)) {
    return null;
  }

  return (
    <Typography variant="body-small" className="w-full self-stretch pr-2 text-muted-foreground">
      {role === MessageSenderRole.USER ? 'User' : 'Admin'}
    </Typography>
  );
};

export default ChatMessageSender;
