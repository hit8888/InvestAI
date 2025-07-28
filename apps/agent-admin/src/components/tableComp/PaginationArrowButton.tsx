import { cn } from '@breakout/design-system/lib/cn';
import { PAGINATION_ARROW_ICONS } from '../../utils/constants';
import Button from '@breakout/design-system/components/Button/index';

interface NavigationArrowBtnProps {
  isDisabled: boolean;
  onButtonClick: () => void;
  PaginationArrow: React.FC<{ color: string }>;
}

const PaginationArrowButton = ({ isDisabled, onButtonClick, PaginationArrow }: NavigationArrowBtnProps) => {
  return (
    <Button
      onClick={onButtonClick}
      className={cn([!isDisabled && 'border border-gray-300 bg-gray-25', isDisabled && 'disabled:border-gray-200'])}
      variant="system_secondary"
      buttonStyle="icon"
      disabled={isDisabled}
    >
      {/* Static Color used below ('#D0D5DD') for disable condition - which will be applicable for all clients */}
      <PaginationArrow {...PAGINATION_ARROW_ICONS} color={isDisabled ? '#D0D5DD' : 'rgb(var(--system))'} />
    </Button>
  );
};

export default PaginationArrowButton;
