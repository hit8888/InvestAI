import { DropdownMenuItem } from '@breakout/design-system/components/shadcn-ui/dropdown-menu';
import { cn } from '@breakout/design-system/lib/cn';

interface MenuOptionProps {
  menuOptionTitle: string;
  onMenuOptionClicked: () => void;
  isSelectedOption: boolean;
}

const FilterMenuOption = ({ menuOptionTitle, onMenuOptionClicked, isSelectedOption }: MenuOptionProps) => {
  return (
    <DropdownMenuItem
      key={menuOptionTitle}
      onSelect={(event) => {
        // Prevent the default selection behavior
        event.preventDefault();
        onMenuOptionClicked();
      }}
      className={cn(
        'relative flex w-full cursor-pointer select-none items-center px-4 py-2 text-sm capitalize outline-none',
        'focus:bg-gray-50 focus:text-system',
        'data-[highlighted]:bg-primary/5 data-[highlighted]:text-system',
        {
          'bg-gray-200 text-system data-[highlighted]:bg-gray-200': isSelectedOption,
          'text-gray-700 hover:bg-gray-100 data-[highlighted]:bg-gray-100': !isSelectedOption,
        },
      )}
    >
      {menuOptionTitle}
    </DropdownMenuItem>
  );
};

export default FilterMenuOption;
