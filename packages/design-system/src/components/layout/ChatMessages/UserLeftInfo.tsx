import { WebSocketMessage } from '@meaku/core/types/webSocketData';
import { checkIsUserLeftMessage } from '@meaku/core/utils/messageUtils';
import MessageItemLayout, { Alignment } from './MessageItemLayout';
import { ViewType } from '@meaku/core/types/common';
import AccountOffIcon from '../../icons/account-off-icon';
import Typography from '../../Typography';
import { Link } from 'react-router-dom';

interface UserLeftInfoProps {
  message: WebSocketMessage;
  viewType: ViewType;
}

const UserLeftInfo = ({ message, viewType }: UserLeftInfoProps) => {
  const isUserLeftMessage = checkIsUserLeftMessage(message);

  // User left message is only shown in admin view
  if (viewType !== ViewType.ADMIN || !isUserLeftMessage) {
    return null;
  }

  return (
    <MessageItemLayout align={Alignment.CENTER}>
      <div className="flex items-center gap-4 rounded-3xl bg-transparent_gray_3 p-4">
        <AccountOffIcon />
        <div className="flex flex-col items-start gap-0.5">
          <Typography variant="label-16-semibold">The user has left this chat.</Typography>
          <Typography variant="body-14" color="textSecondary">
            You can find this conversation in{' '}
            <Link to="/conversations" className="text-base font-medium text-blue_sec-1000">
              All Conversations
            </Link>
          </Typography>
        </div>
      </div>
    </MessageItemLayout>
  );
};

export default UserLeftInfo;
