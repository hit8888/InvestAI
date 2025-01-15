import { cn } from '@breakout/design-system/lib/cn';

interface MenuOptionProps {
  menuOptionTitle: string;
  onMenuOptionClicked: () => void;
  isSelectedOption: boolean;
}

const FilterMenuOption = ({ menuOptionTitle, onMenuOptionClicked, isSelectedOption }: MenuOptionProps) => {
  return (
    <button
      key={menuOptionTitle}
      onClick={onMenuOptionClicked}
      className={cn(`block w-full px-4 py-2 text-left text-sm hover:bg-primary/10`, {
        'bg-primary/10 text-primary': isSelectedOption,
        'text-gray-700': !isSelectedOption,
      })}
      role="menuitem"
    >
      {menuOptionTitle}
    </button>
  );
};

export default FilterMenuOption;
