import useElementScrollIntoView from '@meaku/core/hooks/useElementScrollIntoView';
import { WebSocketMessage } from '@meaku/core/types/webSocketData';
import { CircleUserRound } from 'lucide-react';

interface AdminJoinedInfoProps {
  message: WebSocketMessage;
}

const PROFILE_ICON_WIDTH = 28;

const AdminJoinedInfo = ({ message }: AdminJoinedInfoProps) => {
  const scrollRef = useElementScrollIntoView<HTMLDivElement>();

  if (
    !message.message ||
    message.message_type !== 'EVENT' ||
    !('event_type' in message.message) ||
    message.message.event_type !== 'JOIN_SESSION'
  ) {
    return null;
  }

  const eventData = message.message.event_data;
  const fullName = `${eventData?.first_name ?? ''} ${eventData.last_name ?? ''}`.trim();
  const adminName = fullName || 'Admin';
  const profileIconUrl = eventData?.profile_picture;

  return (
    <div ref={scrollRef} className="flex justify-center py-4 pr-2">
      <div className="flex grow-0 items-center rounded-2xl bg-transparent_gray_3 p-4">
        <div className="mr-4 h-12 w-12 flex-shrink-0 overflow-hidden rounded-full">
          <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-300">
            {profileIconUrl ? <img src={profileIconUrl} /> : <CircleUserRound size={PROFILE_ICON_WIDTH} />}
          </div>
        </div>
        <h2 className="text-lg font-medium text-customPrimaryText">{adminName} Is Here to Help!</h2>
      </div>
    </div>
  );
};

export default AdminJoinedInfo;
