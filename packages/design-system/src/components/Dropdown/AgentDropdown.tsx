import { useEffect, useMemo, useState, useCallback } from 'react';
import { cn } from '@breakout/design-system/lib/cn';
import DropdownIcon from '@breakout/design-system/components/icons/dropdown-icon';
import { useDebouncedValue } from '@meaku/core/hooks/useDebouncedValue';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from '@breakout/design-system/components/shadcn-ui/dropdown-menu';
import DropdownOption from './DropdownOption';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../Tooltip';
import DropdownMenuSearch from './DropdownMenuSearch';
import Typography from '../Typography';

// Define the type for the options
interface DropdownProps {
  options: string[];
  placeholderLabel: string;
  onCallback?: (selectedOption: string | null) => void;
  className?: string;
  fontToShown?: string;
  showTooltipContent?: boolean;
  menuContentAlign?: 'start' | 'center' | 'end';
  menuContentSide?: 'top' | 'right' | 'bottom' | 'left';
  defaultValue?: string;
  dropdownOpenClassName?: string;
  showIcon?: boolean;
  menuItemClassName?: string;
  isSearchable?: boolean;
  dropdownMenuHeader?: string;
  applyFontFamily?: boolean;
  allowDeselect?: boolean;
  searchPlaceholder?: string;
}

// Also Add check for is_required key
const AgentDropdown = ({
  options,
  placeholderLabel,
  onCallback,
  className,
  fontToShown,
  showTooltipContent = false,
  defaultValue,
  dropdownOpenClassName,
  menuContentAlign = 'start',
  menuContentSide = 'bottom',
  showIcon = true,
  menuItemClassName,
  isSearchable = false,
  dropdownMenuHeader,
  applyFontFamily = false,
  allowDeselect = true,
  searchPlaceholder,
}: DropdownProps) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 300);

  useEffect(() => {
    if (defaultValue && !selectedOption) {
      setSelectedOption(defaultValue);
    }
  }, [defaultValue]);

  // Handle option toggle (select/deselect)
  const handleOptionClick = useCallback(
    (option: string) => {
      const isSameOption = selectedOption === option;
      if (isSameOption && !allowDeselect) {
        setIsDropdownOpen(false);
        return;
      }

      const newSelectedOption = isSameOption ? null : option;
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
    return options.filter((option) => option.toLowerCase().includes(debouncedSearchTerm.toLowerCase()));
  }, [options, debouncedSearchTerm]);

  return (
    <DropdownMenu open={isDropdownOpen} onOpenChange={toggleDropdown}>
      <DropdownMenuTrigger
        className={cn(
          `inline-flex h-16 w-full max-w-[800px] cursor-pointer 
          items-center justify-between gap-2 rounded-xl 
          border border-gray-300 bg-white p-6 text-xl 
          text-customPrimaryText shadow-sm hover:bg-gray-25 focus:outline-none`,
          {
            'ring-4 ring-primary/20': isDropdownOpen,
            [dropdownOpenClassName || '']: isDropdownOpen,
          },
          className,
          fontToShown,
        )}
      >
        {!selectedOption && placeholderLabel ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className={cn('overflow-hidden truncate whitespace-nowrap text-gray-400', fontToShown)}>
                  {placeholderLabel}
                </span>
              </TooltipTrigger>
              {showTooltipContent && (
                <TooltipContent className="bg-white">
                  <p className="text-black">{placeholderLabel}</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        ) : null}
        {selectedOption ? (
          <span
            className={cn('truncate', fontToShown)}
            style={{ fontFamily: applyFontFamily ? selectedOption : undefined }}
          >
            {selectedOption}
          </span>
        ) : null}
        <span
          className={cn('h-5 w-5 flex-shrink-0', {
            'rotate-0': !isDropdownOpen,
            'translate-x-1 translate-y-1 rotate-180': isDropdownOpen,
          })}
        >
          <DropdownIcon className="text-gray-900" width={'24'} height={'24'} />
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        asChild
        align={menuContentAlign}
        side={menuContentSide}
        className="dropdown-menu-content hide-scrollbar z-20 max-h-96 overflow-auto 
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
          <DropdownMenuGroup className="max-h-[300px] overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <DropdownOption
                  key={option}
                  showIcon={showIcon}
                  menuOptionTitle={option}
                  applyFontFamily={applyFontFamily}
                  menuItemClassName={menuItemClassName}
                  onMenuOptionClicked={() => handleOptionClick(option)}
                  isSelectedOption={selectedOption === option}
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
