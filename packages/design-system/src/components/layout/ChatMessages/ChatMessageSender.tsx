import { MessageSenderRole, MessageViewType } from '@neuraltrade/core/types/common';
import Typography from '../../Typography';
import { isHumanMessageInDashboardView } from '@neuraltrade/core/utils/messageUtils';

interface ChatMessageSenderProps {
  messageViewType: MessageViewType;
  role: string;
}

const ChatMessageSender = ({ messageViewType, role }: ChatMessageSenderProps) => {
  if (!isHumanMessageInDashboardView(messageViewType)) {
    return null;
  }

  return (
    <Typography variant="caption-12-medium" textColor="gray500" className="w-full self-stretch pr-2">
      {role === MessageSenderRole.USER ? 'User' : 'Admin'}
    </Typography>
  );
};

export default ChatMessageSender;
