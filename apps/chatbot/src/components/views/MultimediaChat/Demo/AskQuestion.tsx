import RaiseHand from '@breakout/design-system/components/icons/RaiseHand';

const AskQuestion = () => {
  return (
    <div className="flex cursor-pointer items-center gap-2 rounded-[50px] px-4 py-1">
      <span className="text-sm text-primary">Ask Question</span>
      <RaiseHand height={24} width={24} color="rgba(var(--primary), 0.9)" />
    </div>
  );
};

export default AskQuestion;
