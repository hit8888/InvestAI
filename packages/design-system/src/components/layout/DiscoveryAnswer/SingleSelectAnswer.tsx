import UserMessageChatTail from '../../icons/user-message-chat-tail';

export const SingleSelectAnswer = ({ question, response }: { question: string; response: string }) => {
  return (
    <div className="w-full max-w-md">
      <div className="text-md mb-2 text-gray-700">{question}</div>
      <div className="ml-16 flex items-center justify-end p-2">
        <p className="relative max-w-full rounded-2xl bg-transparent_gray_6 px-4 py-2">
          <div className="flex-col">{response}</div>
          <UserMessageChatTail />
        </p>
      </div>
    </div>
  );
};
