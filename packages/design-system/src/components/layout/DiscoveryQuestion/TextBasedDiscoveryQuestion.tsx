interface TextBasedDiscoveryQuestionProps {
  isLastMessage: boolean;
  question: string;
}

const TextBasedDiscoveryQuestion = ({ isLastMessage, question }: TextBasedDiscoveryQuestionProps) => {
  return isLastMessage ? (
    <p className="text-md font-semibold text-gray-800">{question}</p>
  ) : (
    <div className="text-md mb-2 text-gray-700">{question}</div>
  );
};

export default TextBasedDiscoveryQuestion;
