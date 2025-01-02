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
      className={cn(`block w-full px-4 py-2 text-left text-sm hover:bg-primary/60 hover:text-white`, {
        'text-primary/60': isSelectedOption,
        'text-gray-700': !isSelectedOption,
      })}
      role="menuitem"
    >
      {menuOptionTitle}
      {isSelectedOption && <span className="ml-2 text-primary/60">✔</span>}
    </button>
  );
};

export default FilterMenuOption;
