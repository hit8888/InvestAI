import SparkleIcon from '@breakout/design-system/components/icons/sparkle';
import { cn } from '@breakout/design-system/lib/cn';

interface IProps {
  buttonText: string;
  onClick: () => void;
  isClicked?: boolean;
  isDisabled?: boolean;
}

const ActionButton = ({ buttonText, onClick, isClicked, isDisabled }: IProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'action-botton-shadow flex cursor-pointer items-center justify-center gap-2 rounded-[60px] border border-primary/30 bg-primary/5 px-4 py-2',
        {
          'border-primary/60 bg-primary/20': isClicked,
          'bg-primary/10 opacity-50': isDisabled,
        },
      )}
    >
      <div className="!h-4 !w-4">
        <SparkleIcon className="!h-4 !w-4 fill-primary/50 transition-colors duration-300 ease-in-out group-hover:fill-white" />
      </div>
      <span className="text-sm font-medium text-primary/80">{buttonText}</span>
    </div>
  );
};

export { ActionButton };
