interface JoinConversationButtonProps {
  onJoinConversationClick: () => void;
}

const JoinConversationButton = ({ onJoinConversationClick }: JoinConversationButtonProps) => {
  return (
    <button
      onClick={onJoinConversationClick}
      className="rounded-lg border border-primary bg-primary px-3 py-1 text-sm font-semibold text-white ring ring-primary/50"
    >
      Join Conversation
    </button>
  );
};

export default JoinConversationButton;
