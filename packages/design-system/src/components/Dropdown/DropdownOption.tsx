import { DropdownMenuItem } from '@breakout/design-system/components/shadcn-ui/dropdown-menu';
import { cn } from '@breakout/design-system/lib/cn';
import MenuOptionNotSelectedIcon from '../icons/menuoption-not-selected-icon';
import MenuOptionSelectedIcon from '../icons/menuoption-selected-icon';

interface MenuOptionProps {
  menuOptionTitle: string;
  onMenuOptionClicked: () => void;
  isSelectedOption: boolean;
}

const DropdownOption = ({ menuOptionTitle, onMenuOptionClicked, isSelectedOption }: MenuOptionProps) => {
  return (
    <DropdownMenuItem
      key={menuOptionTitle}
      onSelect={(event) => {
        // Prevent the default selection behavior
        event.preventDefault();
        onMenuOptionClicked();
      }}
      className={cn(
        'relative flex w-full cursor-pointer select-none items-center justify-start gap-4 px-4 py-3 text-left text-sm capitalize text-gray-900 outline-none',
        'focus:bg-gray-50',
        {
          'bg-gray-200 data-[highlighted]:bg-gray-200': isSelectedOption,
          'hover:bg-gray-100 data-[highlighted]:bg-gray-100': !isSelectedOption,
        },
      )}
    >
      {isSelectedOption ? (
        <MenuOptionSelectedIcon width="24" height="24" className="text-gray-900" />
      ) : (
        <MenuOptionNotSelectedIcon width="24" height="24" className="text-gray-500" />
      )}
      {menuOptionTitle}
    </DropdownMenuItem>
  );
};

export default DropdownOption;
