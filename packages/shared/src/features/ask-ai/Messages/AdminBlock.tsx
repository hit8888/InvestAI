import { Message, MessageRole } from '../../../types/message';
import MessageDataSources from './MessageDataSources';
import { MessageFeedback } from './MessageFeedback';

interface AdminBlockProps {
  message: Message;
}
const AdminBlock = ({ message }: AdminBlockProps) => {
  return (
    <div className="flex flex-col gap-3 pl-10 pr-3">
      {message.role === MessageRole.AI && message.documents && message.documents.length > 0 && (
        <MessageDataSources dataSources={message.documents} />
      )}
      {message.role === MessageRole.AI &&
        (message.event_type === 'TEXT_RESPONSE' || message.event_type === 'STREAM_RESPONSE') && (
          <MessageFeedback message={message} />
        )}
    </div>
  );
};

export default AdminBlock;
