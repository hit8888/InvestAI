import CopyToClipboardButton from '@breakout/design-system/components/layout/CopyToClipboardButton';
import { ActiveConversation } from '../../context/ActiveConversationsContext';
import ConversationActions from './ConversationActions';

type JoinConversationHeaderProps = {
  conversation: ActiveConversation;
};

const JoinConversationHeader = ({ conversation }: JoinConversationHeaderProps) => {
  return (
    <div className="flex w-full items-center justify-between px-4 py-2 outline-none">
      <SessionIdLabelWithCopyButton sessionId={conversation.session_id} />
      <ConversationActions conversation={conversation} />
    </div>
  );
};

const SessionIdLabelWithCopyButton = ({ sessionId }: { sessionId: string }) => {
  return (
    <div className="flex items-center justify-center gap-2 p-2">
      <span className="text-base font-semibold text-primary">Session ID</span>
      <CopyToClipboardButton
        textToCopy={sessionId}
        btnClassName="bg-primary/2.5 h-[28px] w-[28px] flex rounded-lg justify-center items-center border-none"
        copyIconClassname="text-primary h-4 w-4"
      />
    </div>
  );
};

export default JoinConversationHeader;
