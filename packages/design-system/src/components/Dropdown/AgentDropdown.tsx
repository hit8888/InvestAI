import { useEffect, useMemo, useState, useCallback } from 'react';
import { cn } from '@breakout/design-system/lib/cn';
import DropdownIcon from '@breakout/design-system/components/icons/dropdown-icon';
import { useDebouncedValue } from '@neuraltrade/core/hooks/useDebouncedValue';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from '@breakout/design-system/components/shadcn-ui/dropdown-menu';
import DropdownOption from './DropdownOption';
import DropdownMenuSearch from './DropdownMenuSearch';
import Typography from '../Typography';
import TooltipWrapper from './TooltipWrapper';

type OptionType = string | { value: string; label: string; tooltip?: string };
type OptionsType = OptionType[];

// Define the type for the options
interface DropdownProps {
  className?: string;
  menuItemClassName?: string;
  menuGroupClassname?: string;
  dropdownOpenClassName?: string;
  dropdownIconClassName?: string;
  options: OptionsType;
  placeholderLabel: string;
  onCallback?: (selectedOption: string | null) => void;
  fontToShown?: string;
  showTooltipContent?: boolean;
  menuContentAlign?: 'start' | 'center' | 'end';
  menuContentSide?: 'top' | 'right' | 'bottom' | 'left';
  defaultValue?: OptionType;
  showIcon?: boolean;
  isSearchable?: boolean;
  dropdownMenuHeader?: string;
  applyFontFamily?: boolean;
  allowDeselect?: boolean;
  searchPlaceholder?: string;
  disableTrigger?: boolean;
}

// Also Add check for is_required key
const AgentDropdown = ({
  className,
  menuItemClassName,
  menuGroupClassname,
  dropdownOpenClassName,
  dropdownIconClassName,
  options,
  placeholderLabel,
  onCallback,
  fontToShown,
  showTooltipContent = false,
  defaultValue,
  menuContentAlign = 'start',
  menuContentSide = 'bottom',
  showIcon = true,
  isSearchable = false,
  dropdownMenuHeader,
  applyFontFamily = false,
  allowDeselect = true,
  searchPlaceholder,
  disableTrigger = false,
}: DropdownProps) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 300);

  useEffect(() => {
    if (defaultValue && !selectedOption) {
      // Extract value from defaultValue regardless of its type
      const valueToSet = typeof defaultValue === 'string' ? defaultValue : defaultValue.value;
      setSelectedOption(valueToSet);
    }
  }, [defaultValue]);

  // Handle option toggle (select/deselect)
  const handleOptionClick = useCallback(
    (option: OptionType) => {
      // Get the value to compare (consistent for both string and object options)
      const optionValue = typeof option === 'string' ? option : option.value;
      const isSameOption = selectedOption === optionValue;

      if (isSameOption && !allowDeselect) {
        setIsDropdownOpen(false);
        return;
      }

      const newSelectedOption = isSameOption ? null : optionValue;
      setSelectedOption(newSelectedOption);
      onCallback?.(newSelectedOption);
      setIsDropdownOpen(false);
    },
    [onCallback, selectedOption, allowDeselect],
  );

  const clearSearchTerm = useCallback(() => {
    setSearchTerm('');
  }, []);

  // Toggle dropdown visibility
  const toggleDropdown = useCallback(() => {
    clearSearchTerm();
    setIsDropdownOpen((prevState) => !prevState);
  }, [clearSearchTerm]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const filteredOptions = useMemo(() => {
    return options.filter((option) => {
      if (typeof option === 'string') {
        return option.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      }
      return option.label.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
    });
  }, [options, debouncedSearchTerm]);

  const LabelForSelectedOption = useMemo(() => {
    const option = options.find((option) => {
      if (typeof option === 'string') {
        return option === selectedOption;
      }
      return option.value === selectedOption;
    });
    return typeof option === 'string' ? option : option?.label;
  }, [selectedOption, options]);

  return (
    <DropdownMenu open={isDropdownOpen} onOpenChange={toggleDropdown}>
      <DropdownMenuTrigger
        disabled={disableTrigger}
        className={cn(
          `inline-flex h-16 w-full max-w-[800px] cursor-pointer 
          items-center justify-between gap-2 rounded-xl 
          border border-gray-300 bg-white p-6 text-xl 
          text-customPrimaryText shadow-sm hover:bg-gray-25 focus:outline-none focus-visible:outline-none
          focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50`,
          {
            'ring-4 ring-primary/20': isDropdownOpen,
            [dropdownOpenClassName || '']: isDropdownOpen,
          },
          className,
          fontToShown,
        )}
      >
        {!selectedOption && placeholderLabel ? (
          <TooltipWrapper
            renderTrigger={
              <span className={cn('overflow-hidden truncate whitespace-nowrap text-gray-400', fontToShown)}>
                {placeholderLabel}
              </span>
            }
            tooltipContent={placeholderLabel}
            showTooltipContent={showTooltipContent}
          />
        ) : null}
        {selectedOption ? (
          <span
            className={cn('truncate', fontToShown)}
            style={{
              fontFamily: applyFontFamily ? selectedOption : undefined,
            }}
          >
            {LabelForSelectedOption}
          </span>
        ) : null}
        <span
          className={cn('h-5 w-5 text-center', {
            'rotate-0': !isDropdownOpen,
            'translate-x-1 rotate-180': isDropdownOpen,
          })}
        >
          <DropdownIcon className={cn('pb-1 text-gray-900', dropdownIconClassName)} width={'24'} height={'24'} />
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        asChild
        align={menuContentAlign}
        side={menuContentSide}
        className="dropdown-menu-content hide-scrollbar z-[2147483647] max-h-96 min-w-[6rem] overflow-auto 
        rounded-lg bg-white p-0 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none"
      >
        <div className="flex flex-col">
          {dropdownMenuHeader && <DropdownMenuHeader title={dropdownMenuHeader} />}
          {isSearchable && (
            <DropdownMenuSearch
              key="dropdown-search"
              searchTerm={searchTerm}
              handleInputChange={handleInputChange}
              clearSearchTerm={clearSearchTerm}
              placeholder={searchPlaceholder}
            />
          )}
          <DropdownMenuGroup className={cn(['max-h-[300px] w-full overflow-y-auto', menuGroupClassname])}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <DropdownOption
                  key={typeof option === 'string' ? option : option.value}
                  showIcon={showIcon}
                  showTooltipContent={showTooltipContent}
                  menuOptionTitle={typeof option === 'string' ? option : option.label}
                  applyFontFamily={applyFontFamily}
                  menuItemClassName={menuItemClassName}
                  tooltipContent={typeof option === 'string' ? option : option.tooltip}
                  onMenuOptionClicked={() => handleOptionClick(option)}
                  isSelectedOption={selectedOption === (typeof option === 'string' ? option : option.value)}
                />
              ))
            ) : (
              <DropdownMenuEmptyState />
            )}
          </DropdownMenuGroup>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const DropdownMenuEmptyState = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center p-4">
      <p className="text-gray-500">No results found</p>
    </div>
  );
};

const DropdownMenuHeader = ({ title }: { title: string }) => {
  return (
    <div className="flex items-start px-4 pt-4">
      <Typography variant="title-18" className="text-gray-900">
        {title}
      </Typography>
    </div>
  );
};

export default AgentDropdown;
