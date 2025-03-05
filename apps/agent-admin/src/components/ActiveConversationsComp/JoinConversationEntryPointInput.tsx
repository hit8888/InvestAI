import ActiveConvJoinButtonLining from '@breakout/design-system/components/icons/active-conv-join-button-lining';

const JoinConversationEntryPointInput = () => {
  return (
    <div
      onClick={() => {}}
      className="group relative z-50 w-full cursor-pointer rounded-2xl border border-gray-200 bg-white p-2 transition-all duration-300 hover:ring-2 hover:ring-primary"
    >
      <div
        className="relative flex h-14 items-center justify-center rounded-xl 
        border border-primary bg-primary/20 py-1 pl-2 pr-4 transition-all duration-300 
        group-hover:border-2 group-hover:border-[rgba(var(--primary-foreground)/0.24)] group-hover:bg-primary"
      >
        <ActiveConvJoinButtonLining className="absolute left-0 top-0 h-full w-full text-primary" />
        <div className="flex items-center justify-center rounded-lg px-4 py-3 text-sm font-semibold text-primary group-hover:text-white">
          Join Conversation
        </div>
      </div>
    </div>
  );
};

export default JoinConversationEntryPointInput;
