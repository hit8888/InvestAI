import { cn } from '@breakout/design-system/lib/cn';

import { PAGINATION_ARROW_ICONS } from '../../utils/constants';

interface NavigationArrowBtnProps {
  conditionOnBtn: boolean;
  onButtonClick: () => void;
  PaginationArrow: React.FC<{ color: string }>;
}

const NavigationArrowButton = ({ conditionOnBtn, onButtonClick, PaginationArrow }: NavigationArrowBtnProps) => {
  return (
    <div
      className={cn(`flex h-9 w-9 items-center justify-center gap-2 rounded-lg border-[1.5px] p-2`, {
        'cursor-not-allowed border-gray-300': conditionOnBtn,
        'border-primary hover:bg-primary/10 focus:bg-primary/10': !conditionOnBtn,
      })}
    >
      <button
        onClick={onButtonClick}
        className={cn(`flex items-center gap-2`, {
          'cursor-not-allowed': conditionOnBtn,
        })}
        disabled={conditionOnBtn}
      >
        {/* Static Color used below ('#D0D5DD') for disable condition - which will be applicable for all clients */}
        <PaginationArrow {...PAGINATION_ARROW_ICONS} color={conditionOnBtn ? '#D0D5DD' : 'rgb(var(--primary))'} />
      </button>
    </div>
  );
};

export default NavigationArrowButton;
