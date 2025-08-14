import { ChevronsDown } from 'lucide-react';
import { Button } from '@meaku/saral';

export interface DownArrowButtonProps {
  show: boolean;
  onClick: () => void;
}

const DownArrowButton = ({ show, onClick }: DownArrowButtonProps) => {
  if (!show) return null;

  return (
    <div className="sticky bottom-0 left-0 flex items-center justify-start">
      <Button
        variant="secondary"
        size="icon"
        className="size-7 animate-pulse rounded-full bg-white p-1 duration-[2000ms]"
        onClick={onClick}
      >
        <ChevronsDown />
      </Button>
    </div>
  );
};

export default DownArrowButton;
