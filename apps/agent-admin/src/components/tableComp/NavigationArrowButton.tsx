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
        'border-[#4E46DC]': !conditionOnBtn,
      })}
    >
      <button
        onClick={onButtonClick}
        className={cn(`flex items-center gap-2`, {
          'cursor-not-allowed': conditionOnBtn,
        })}
        disabled={conditionOnBtn}
      >
        <PaginationArrow {...PAGINATION_ARROW_ICONS} color={conditionOnBtn ? '#9ca3af' : '#4E46DC'} />
      </button>
    </div>
  );
};

export default NavigationArrowButton;
