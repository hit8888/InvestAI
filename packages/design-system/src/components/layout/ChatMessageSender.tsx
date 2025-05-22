import { MessageSenderRole, MessageViewType } from '@meaku/core/types/common';
import Typography from '../Typography';
import { isHumanMessageInDashboardView } from '@meaku/core/utils/messageUtils';

interface ChatMessageSenderProps {
  messageViewType: MessageViewType;
  role: string;
}

const ChatMessageSender = ({ messageViewType, role }: ChatMessageSenderProps) => {
  if (!isHumanMessageInDashboardView(messageViewType)) {
    return null;
  }

  return (
    <Typography variant="caption-12-medium" textColor="gray500" className="w-full self-stretch pb-2 pr-2">
      {role === MessageSenderRole.USER ? 'User' : 'Admin'}
    </Typography>
  );
};

export default ChatMessageSender;
