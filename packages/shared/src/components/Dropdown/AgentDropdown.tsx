import { useEffect, useMemo, useState, useCallback } from 'react';
import { useDebouncedValue } from '@meaku/core/hooks/useDebouncedValue';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Typography,
  LucideIcon,
  cn,
} from '@meaku/saral';
import DropdownOption from './DropdownOption';
import DropdownMenuSearch from './DropdownMenuSearch';
import { useDropdownPortal } from '../../hooks/usePortal';

interface DropdownProps {
  className?: string;
  menuItemClassName?: string;
  menuGroupClassname?: string;
  dropdownOpenClassName?: string;
  options: string[];
  placeholderLabel: string;
  onCallback?: (selectedOption: string | null) => void;
  onBlur?: () => void;
  fontToShown?: string;
  showTooltipContent?: boolean;
  menuContentAlign?: 'start' | 'center' | 'end';
  menuContentSide?: 'top' | 'right' | 'bottom' | 'left';
  defaultValue?: string;
  showIcon?: boolean;
  isSearchable?: boolean;
  dropdownMenuHeader?: string;
  applyFontFamily?: boolean;
  allowDeselect?: boolean;
  searchPlaceholder?: string;
}

const AgentDropdown = ({
  className,
  menuItemClassName,
  menuGroupClassname,
  dropdownOpenClassName,
  options,
  placeholderLabel,
  onCallback,
  onBlur,
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
}: DropdownProps) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 300);

  const { portalContainer, isReady } = useDropdownPortal();

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
        onBlur={onBlur}
        className={cn(
          `text-customPrimaryText hover:bg-gray-25 inline-flex h-16 w-full
          max-w-[800px] cursor-pointer items-center justify-between
          gap-2 rounded-xl border border-gray-300 bg-white
          p-6 text-xl shadow-sm focus:outline-none`,
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
          <LucideIcon name="chevron-down" className="text-gray-900" width={'24'} height={'24'} />
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        asChild
        align={menuContentAlign}
        side={menuContentSide}
        className="dropdown-menu-content hide-scrollbar z-20 max-h-96 overflow-auto
        rounded-lg bg-white p-0 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none"
        portalContainer={isReady ? portalContainer : undefined}
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
          <DropdownMenuGroup className={cn(['max-h-[300px] overflow-y-auto', menuGroupClassname])}>
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
      <Typography variant="heading" fontWeight="semibold" className="text-gray-900">
        {title}
      </Typography>
    </div>
  );
};

export default AgentDropdown;
