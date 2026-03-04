import { LucideIcon } from '@neuraltrade/saral';

interface NudgeDismissButtonProps {
  onClick: () => void;
}

const NudgeDismissButton = ({ onClick }: NudgeDismissButtonProps) => {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center cursor-pointer bg-base-foreground rounded-full"
      aria-label="Close"
    >
      <LucideIcon name="x" className="w-3 h-3" />
    </div>
  );
};

export default NudgeDismissButton;
