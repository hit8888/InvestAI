import { ChevronsDown } from 'lucide-react';
import Button from '../../Button';
import { DownArrowButtonProps } from './types';

const DownArrowButton = ({ show, onClick }: DownArrowButtonProps) => {
  if (!show) return null;

  return (
    <div className="sticky bottom-0 left-0 flex items-center justify-start">
      <Button
        variant="secondary"
        buttonStyle="icon"
        className="duration-[2000ms] size-7 animate-pulse rounded-full bg-white p-1"
        onClick={onClick}
      >
        <ChevronsDown />
      </Button>
    </div>
  );
};

export default DownArrowButton;
