import { MessageViewType } from '@meaku/core/types/common';
import LeftMessageChatTail from '../../icons/left-message-chat-tail';
import RightMessageChatTail from '../../icons/right-message-chat-tail';

const ChatMessageTail = ({ messageViewType }: { messageViewType: MessageViewType }): React.ReactNode => {
  switch (messageViewType) {
    case MessageViewType.ADMIN_MESSAGE_IN_USER_VIEW:
    case MessageViewType.USER_MESSAGE_IN_ADMIN_VIEW:
      return <LeftMessageChatTail />;
    case MessageViewType.ADMIN_MESSAGE_IN_ADMIN_VIEW:
    case MessageViewType.ADMIN_MESSAGE_IN_DASHBOARD_VIEW:
    case MessageViewType.USER_MESSAGE_IN_USER_VIEW:
    case MessageViewType.USER_MESSAGE_IN_DASHBOARD_VIEW:
      return <RightMessageChatTail />;
    default:
      return null;
  }
};

export default ChatMessageTail;
