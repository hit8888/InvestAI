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
        'relative flex w-full cursor-pointer select-none items-center px-4 py-2 text-sm outline-none',
        'focus:bg-primary/5 focus:text-primary', // Add focus styles
        'data-[highlighted]:bg-primary/5 data-[highlighted]:text-primary', // Add highlighted state styles
        {
          'bg-primary/10 text-primary': isSelectedOption,
          'text-gray-700': !isSelectedOption,
          'hover:bg-primary/10': !isSelectedOption,
        },
      )}
    >
      {menuOptionTitle}
    </DropdownMenuItem>
  );
};

export default FilterMenuOption;
