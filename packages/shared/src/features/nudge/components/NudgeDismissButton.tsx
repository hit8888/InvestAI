import { Icons } from '@meaku/saral';

interface NudgeDismissButtonProps {
  onClick: () => void;
}

const NudgeDismissButton = ({ onClick }: NudgeDismissButtonProps) => {
  return (
    <div
      onClick={onClick}
      className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center cursor-pointer bg-base-foreground rounded-full"
      aria-label="Close"
    >
      <Icons.X className="w-3 h-3" />
    </div>
  );
};

export default NudgeDismissButton;
