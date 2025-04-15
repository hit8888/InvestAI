import UserMessageChatTail from '../../icons/user-message-chat-tail';

export const MultiSelectAnswer = ({ question, responses }: { question: string; responses: string[] }) => {
  return (
    <div className="w-full max-w-md">
      <div className="text-md mb-2 text-gray-700">{question}</div>
      <div className="ml-16 flex items-center justify-end py-4 pr-2">
        <p className="relative max-w-full rounded-2xl bg-transparent_gray_6 px-4 py-2">
          <div className="flex-col">
            <ul className="list-disc pl-5">
              {responses.map((response) => (
                <li className="mb-2">
                  <span className="text-gray-800">{response}</span>
                </li>
              ))}
            </ul>
          </div>
          <UserMessageChatTail />
        </p>
      </div>
    </div>
  );
};
