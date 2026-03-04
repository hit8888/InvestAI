import { WebSocketMessage } from '@neuraltrade/core/types/webSocketData';
import { checkIsUserLeftMessage } from '@neuraltrade/core/utils/messageUtils';
import MessageItemLayout, { Alignment } from './MessageItemLayout';
import { ViewType } from '@neuraltrade/core/types/common';
import AccountOffIcon from '../../icons/account-off-icon';
import Typography from '../../Typography';
import { Link } from 'react-router-dom';
import DateUtil from '@neuraltrade/core/utils/dateUtils';

interface UserLeftInfoProps {
  message: WebSocketMessage;
  viewType: ViewType;
}

const UserLeftInfo = ({ message, viewType }: UserLeftInfoProps) => {
  const isUserLeftMessage = checkIsUserLeftMessage(message);
  const isAdminView = viewType === ViewType.ADMIN;

  if (!isUserLeftMessage) {
    return null;
  }

  return (
    <MessageItemLayout align={Alignment.CENTER}>
      <div className="flex items-center gap-4 rounded-3xl bg-transparent_gray_3 p-4">
        <AccountOffIcon />
        <div className="flex flex-col items-start gap-0.5">
          <Typography variant="label-14-semibold">
            The user left this conversation at {DateUtil.humanizeMessageTimestamp(message.timestamp)}
          </Typography>
          {isAdminView && (
            <Link to={`/conversations/${message.session_id}`}>
              <Typography variant="label-14-medium" className="text-blue_sec-1000">
                View Details
              </Typography>
            </Link>
          )}
        </div>
      </div>
    </MessageItemLayout>
  );
};

export default UserLeftInfo;
