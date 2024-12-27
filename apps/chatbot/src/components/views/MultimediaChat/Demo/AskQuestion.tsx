import RaiseHand from '@breakout/design-system/components/icons/RaiseHand';

interface IProps {
  onClick: () => void;
}

const AskQuestion = ({ onClick }: IProps) => {
  return (
    <div
      className="flex cursor-pointer items-center gap-2 rounded-[50px] bg-primary/10 py-1 pl-1 pr-4"
      onClick={onClick}
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-[50%] bg-white">
        <RaiseHand height={24} width={24} color="rgb(var(--primary)/ 0.9)" />
      </div>
      <span className="text-sm text-primary">Ask Question</span>
    </div>
  );
};

export default AskQuestion;
