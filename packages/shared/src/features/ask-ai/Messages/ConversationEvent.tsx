import { Typography, ImageWithFallback } from '@meaku/saral';
import { Message } from '../../../types/message';

interface ConversationEventProps {
  message: Message;
}

export const ConversationEvent = ({ message }: ConversationEventProps) => {
  const isJoinSessionEvent =
    message.event_type === 'JOIN_SESSION' ||
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ((message as any).message_type === 'EVENT' && (message as any).message?.event_type === 'JOIN_SESSION');

  const isLeaveSessionEvent =
    message.event_type === 'LEAVE_SESSION' ||
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ((message as any).message_type === 'EVENT' && (message as any).message?.event_type === 'LEAVE_SESSION');

  if (!isJoinSessionEvent && !isLeaveSessionEvent) {
    return null;
  }

  // Handle both flat and nested structures
  let eventData:
    | {
        first_name?: string;
        last_name?: string;
        profile_picture?: string | null;
      }
    | undefined;

  if (message.event_type === 'JOIN_SESSION' || message.event_type === 'LEAVE_SESSION') {
    // Flat structure
    eventData = message.event_data as {
      first_name?: string;
      last_name?: string;
      profile_picture?: string | null;
    };
  } else if (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (message as any).message_type === 'EVENT' &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ((message as any).message?.event_type === 'JOIN_SESSION' ||
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (message as any).message?.event_type === 'LEAVE_SESSION')
  ) {
    // Nested structure
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    eventData = (message as any).message?.event_data as {
      first_name?: string;
      last_name?: string;
      profile_picture?: string | null;
    };
  }

  const firstName = eventData?.first_name || '';
  const userName = firstName.trim();
  const profilePicture = eventData?.profile_picture;

  // Determine the event type and message
  const isJoinEvent = isJoinSessionEvent;
  const eventMessage = isJoinEvent ? 'Joined The Chat' : 'Left The Chat';

  return (
    <div className="flex items-center justify-center py-2 text-sm text-muted-foreground w-full">
      <div className="flex items-center gap-1 w-full">
        <div className="flex-1 h-[1px] bg-muted w-full" />
        <div className="flex items-center gap-1 bg-card p-1 px-2 rounded-2xl">
          {profilePicture && (
            <div className="size-[18px] rounded-full overflow-hidden flex-shrink-0">
              <ImageWithFallback
                src={profilePicture}
                alt={`${userName}'s profile`}
                size={18}
                showOnlineIndicator={false}
              />
            </div>
          )}
          <Typography variant="body-small" className="text-muted-foreground">
            {userName} {eventMessage}
          </Typography>
        </div>
        <div className="flex-1 h-[1px] bg-muted w-full" />
      </div>
    </div>
  );
};
