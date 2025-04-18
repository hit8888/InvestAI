interface TextBasedDiscoveryQuestionProps {
  isLastMessage: boolean;
  question: string;
}

const TextBasedDiscoveryQuestion = ({ isLastMessage, question }: TextBasedDiscoveryQuestionProps) => {
  return isLastMessage ? (
    <div className="w-full max-w-md rounded-lg bg-transparent_gray_3 p-4">
      <p className="text-md font-semibold text-customPrimaryText">{question}</p>
    </div>
  ) : (
    <div className="text-customPrimaryText">{question}</div>
  );
};

export default TextBasedDiscoveryQuestion;
