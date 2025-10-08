import { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@breakout/design-system/lib/cn';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@breakout/design-system/components/shadcn-ui/command';
import { Badge } from '@breakout/design-system/components/layout/badge';
import Button from '@breakout/design-system/components/Button/index';
import { Check, ChevronDown, X, Plus } from 'lucide-react';
import PopoverWrapper from '../Popover/PopoverWrapper';

interface OptionType {
  value: string;
  label: string;
  isCustom?: boolean;
}

interface UseDynamicBadgeWidthResult {
  containerRef: React.RefObject<HTMLDivElement | null>;
  visibleBadges: string[];
  hiddenCount: number;
  measureBadgeWidth: (value: string, label: string) => void;
}

// Custom hook for dynamic badge width calculations
const useDynamicBadgeWidth = (selectedValues: string[]): UseDynamicBadgeWidthResult => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [badgeWidths, setBadgeWidths] = useState<Map<string, number>>(new Map());
  const [visibleBadges, setVisibleBadges] = useState<string[]>([]);
  const [hiddenCount, setHiddenCount] = useState(0);

  const measureBadgeWidth = useCallback(
    (value: string, label: string) => {
      // Skip if already measured
      if (badgeWidths.has(value)) {
        return;
      }

      // Create a temporary element to measure badge width
      const tempElement = document.createElement('div');
      tempElement.className =
        'flex items-center gap-2 rounded-full bg-gray-100 py-0.5 pl-2 pr-1 text-sm font-normal text-gray-900 absolute -left-[9999px] top-0 whitespace-nowrap';
      tempElement.innerHTML = `
      <span>${label}</span>
      <span class="flex cursor-pointer items-center justify-center rounded-full">
        <svg class="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m18 6-12 12"></path>
          <path d="m6 6 12 12"></path>
        </svg>
      </span>
    `;

      document.body.appendChild(tempElement);
      const width = tempElement.offsetWidth;
      document.body.removeChild(tempElement);

      setBadgeWidths((prev) => new Map(prev).set(value, width));
    },
    [badgeWidths],
  );

  const measureMoreBadgeWidth = useCallback((count: number) => {
    const tempElement = document.createElement('div');
    tempElement.className =
      'flex items-center gap-1 rounded-full bg-blue-50 py-0.5 px-2 text-sm font-normal text-blue-700 whitespace-nowrap absolute -left-[9999px] top-0';
    tempElement.innerHTML = `
      <svg class="h-3 w-3" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 12h14"></path>
        <path d="M12 5v14"></path>
      </svg>
      <span>${count} more</span>
    `;

    document.body.appendChild(tempElement);
    const width = tempElement.offsetWidth;
    document.body.removeChild(tempElement);

    return width;
  }, []);

  const calculateVisibleBadges = useCallback(() => {
    if (!containerRef.current || selectedValues.length === 0) {
      setVisibleBadges(selectedValues);
      setHiddenCount(0);
      return;
    }

    const containerWidth = containerRef.current.offsetWidth;
    if (containerWidth === 0) return; // Container not ready yet

    const gap = 8; // gap-2 = 8px

    let totalWidth = 0;
    let visibleCount = 0;

    // Calculate visible badges
    for (let i = 0; i < selectedValues.length; i++) {
      const value = selectedValues[i];
      const badgeWidth = badgeWidths.get(value);

      // If width not measured yet, skip this calculation cycle
      if (!badgeWidth) {
        return;
      }

      const widthWithGap = totalWidth === 0 ? badgeWidth : totalWidth + gap + badgeWidth;
      const remainingItems = selectedValues.length - i - 1;

      // Check if we need space for the "+more" button
      if (remainingItems > 0) {
        const moreButtonWidth = measureMoreBadgeWidth(remainingItems);
        if (widthWithGap + gap + moreButtonWidth > containerWidth) {
          break;
        }
      }

      if (widthWithGap <= containerWidth) {
        totalWidth = widthWithGap;
        visibleCount++;
      } else {
        break;
      }
    }

    setVisibleBadges(selectedValues.slice(0, visibleCount));
    setHiddenCount(selectedValues.length - visibleCount);
  }, [selectedValues, badgeWidths, measureMoreBadgeWidth]);

  // Reset visible badges and clean up widths when selectedValues change
  useEffect(() => {
    setVisibleBadges([]);
    setHiddenCount(0);

    // Clean up badge widths for removed items
    const currentValues = new Set(selectedValues);
    setBadgeWidths((prev) => {
      const newMap = new Map();
      prev.forEach((width, value) => {
        if (currentValues.has(value)) {
          newMap.set(value, width);
        }
      });
      return newMap;
    });
  }, [selectedValues]);

  useEffect(() => {
    calculateVisibleBadges();
  }, [calculateVisibleBadges]);

  useEffect(() => {
    const handleResize = () => calculateVisibleBadges();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [calculateVisibleBadges]);

  return {
    containerRef,
    visibleBadges,
    hiddenCount,
    measureBadgeWidth,
  };
};

// Badge renderer component with dynamic width handling
interface DynamicBadgeRendererProps {
  selectedValues: string[];
  allOptions: OptionType[];
  onRemove: (value: string, event?: React.MouseEvent) => void;
  className?: string;
}

const DynamicBadgeRenderer = ({ selectedValues, allOptions, onRemove, className }: DynamicBadgeRendererProps) => {
  const { containerRef, visibleBadges, hiddenCount, measureBadgeWidth } = useDynamicBadgeWidth(selectedValues);

  useEffect(() => {
    // Measure all badge widths immediately when selectedValues change
    selectedValues.forEach((value) => {
      const option = allOptions.find((opt) => opt.value === value);
      const displayLabel = option?.label || value;
      measureBadgeWidth(value, displayLabel);
    });
  }, [selectedValues, allOptions, measureBadgeWidth]);

  if (selectedValues.length === 0) return null;

  return (
    <div ref={containerRef} className={cn('flex items-center gap-2', className)}>
      {visibleBadges.map((value) => {
        const option = allOptions.find((opt) => opt.value === value);
        const displayLabel = option?.label || value;

        return (
          <Badge
            key={value}
            variant="outline"
            className="flex items-center gap-2 whitespace-nowrap rounded-full bg-gray-100 py-0.5 pl-2 pr-1 text-sm font-normal text-gray-900 hover:bg-gray-200"
          >
            <span>{displayLabel}</span>
            <span
              onClick={(e) => onRemove(value, e)}
              className="flex cursor-pointer items-center justify-center rounded-full hover:bg-gray-300"
            >
              <X className="h-4 w-4 text-gray-400" />
            </span>
          </Badge>
        );
      })}

      {hiddenCount > 0 && (
        <Badge
          variant="outline"
          className="flex items-center gap-1 whitespace-nowrap rounded-full bg-gray-100 py-0.5 pl-2 pr-1 text-sm font-normal text-gray-900 hover:bg-gray-200"
        >
          <Plus className="h-3 w-3" />
          <span>{hiddenCount} more</span>
        </Badge>
      )}
    </div>
  );
};

interface MultiSelectDropdownProps {
  renderValueType?: 'string' | 'badge';
  className?: string;
  options: OptionType[];
  placeholderLabel: string;
  selectedValues: string[];
  onSelectionChange: (selectedValues: string[]) => void;
  renderOptionItem: (option: OptionType) => React.ReactNode;
  label?: string;
  disabled?: boolean;
  searchable?: boolean;
  maxSelections?: number;
  emptyMessage?: string;
  showPositionArrow?: boolean;
  searchPlaceholder?: string;
  allowCustomOptions?: boolean;
  customOptionLabel?: string;
  onCustomOptionAdd?: (customOptions: OptionType[]) => void;
}

const MultiSelectDropdown = ({
  renderValueType = 'string',
  className,
  options,
  placeholderLabel,
  selectedValues,
  onSelectionChange,
  renderOptionItem,
  label,
  disabled = false,
  searchable = true,
  maxSelections = 3,
  emptyMessage = 'No options available',
  showPositionArrow = true,
  searchPlaceholder = 'Search',
  allowCustomOptions = false,
  customOptionLabel = 'Add "{searchValue}"',
  onCustomOptionAdd,
}: MultiSelectDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [customOptions, setCustomOptions] = useState<OptionType[]>([]);

  const handleSelect = (optionValue: string, isCustomOption = false) => {
    const isSelected = selectedValues.includes(optionValue);
    let newSelectedValues: string[];
    let newCustomOptions = [...customOptions];

    if (isSelected) {
      newSelectedValues = selectedValues.filter((value) => value !== optionValue);
      // If it's a custom option being deselected, remove it permanently
      if (isCustomOption) {
        newCustomOptions = customOptions.filter((option) => option.value !== optionValue);
        setCustomOptions(newCustomOptions);
        onCustomOptionAdd?.(newCustomOptions);
      }
    } else {
      if (selectedValues.length >= maxSelections) {
        return;
      }
      newSelectedValues = [...selectedValues, optionValue];
    }

    onSelectionChange(newSelectedValues);
  };

  const handleRemove = (optionValue: string, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    const newSelectedValues = selectedValues.filter((value) => value !== optionValue);
    onSelectionChange(newSelectedValues);

    // Check if this is a custom option and remove it permanently if being removed from badge
    const isCustomOption = customOptions.some((option) => option.value === optionValue);
    if (isCustomOption) {
      const newCustomOptions = customOptions.filter((option) => option.value !== optionValue);
      setCustomOptions(newCustomOptions);
      onCustomOptionAdd?.(newCustomOptions);
    }
  };

  const handleClearAll = () => {
    onSelectionChange([]);
    // Clear all custom options as well
    setCustomOptions([]);
    onCustomOptionAdd?.([]);
  };

  const handleAddCustomOption = (value: string) => {
    const trimmedValue = value.trim();
    if (!trimmedValue) return;

    const newCustomOption: OptionType = {
      value: trimmedValue,
      label: trimmedValue,
      isCustom: true,
    };

    // Check if custom option already exists
    const existsInCustom = customOptions.some((option) => option.value === trimmedValue);
    const existsInOriginal = options.some((option) => option.value === trimmedValue);

    if (existsInCustom || existsInOriginal) {
      // Just select it if it already exists
      handleSelect(trimmedValue, existsInCustom);
      return;
    }

    // Add to custom options and select it
    const newCustomOptions = [...customOptions, newCustomOption];
    setCustomOptions(newCustomOptions);
    onCustomOptionAdd?.(newCustomOptions);

    // Select the new custom option
    if (selectedValues.length < maxSelections) {
      onSelectionChange([...selectedValues, trimmedValue]);
    }

    // Clear search
    setSearchValue('');
  };

  // Combine original options with custom options
  const allOptions = useMemo(() => {
    return [...options, ...customOptions];
  }, [options, customOptions]);

  const filteredOptions = useMemo(() => {
    const filtered = searchable
      ? allOptions.filter(
          (option) =>
            option.label.toLowerCase().includes(searchValue.toLowerCase()) ||
            option.value.toLowerCase().includes(searchValue.toLowerCase()),
        )
      : allOptions;

    return filtered.sort((a, b) => {
      const aSelected = selectedValues.includes(a.value);
      const bSelected = selectedValues.includes(b.value);

      // Selected options come first
      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;

      // Within each group (selected/unselected), maintain original order
      return 0;
    });
  }, [allOptions, searchValue, selectedValues, searchable]);

  // Check if we should show the "Add custom option" button
  const shouldShowCustomOption = useMemo(() => {
    if (!allowCustomOptions || !searchable || !searchValue.trim()) {
      return false;
    }

    // Don't show if there are matching results
    if (filteredOptions.length > 0) {
      return false;
    }

    // Don't show if the search value already exists as an option or is selected
    const trimmedSearch = searchValue.trim();
    const existsInOptions = allOptions.some((option) => option.value.toLowerCase() === trimmedSearch.toLowerCase());

    return !existsInOptions;
  }, [allowCustomOptions, searchable, searchValue, filteredOptions.length, allOptions]);

  const renderSelectedValues = () => {
    if (renderValueType === 'string') {
      return selectedValues.join(', ');
    }
    return (
      <DynamicBadgeRenderer
        selectedValues={selectedValues}
        allOptions={allOptions}
        onRemove={handleRemove}
        className="flex-wrap"
      />
    );
  };

  const getTriggeredButton = () => {
    return (
      <button
        className={cn(
          'flex h-11 w-full items-center justify-between rounded-lg border border-gray-300 px-3 py-2 text-left font-normal',
          selectedValues.length === 0 && 'text-gray-400',
          className,
          isOpen && 'ring-4 ring-gray-200',
        )}
        disabled={disabled}
      >
        <div className="mr-2 min-w-0 flex-1">
          {selectedValues.length === 0 ? (
            <span className="text-sm capitalize text-gray-400">{placeholderLabel}</span>
          ) : renderValueType === 'string' ? (
            <span className="truncate text-sm capitalize">{renderSelectedValues()}</span>
          ) : (
            <div className="text-sm">{renderSelectedValues()}</div>
          )}
        </div>
        <ChevronDown className={cn('h-4 w-4 flex-shrink-0', isOpen && 'rotate-180')} />
      </button>
    );
  };

  return (
    <div className="w-full space-y-2">
      {/* Popover trigger and content */}
      <PopoverWrapper
        showPositionArrow={showPositionArrow}
        trigger={getTriggeredButton()}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      >
        <Command className="multi-select-dropdown-shadow relative z-50 w-full rounded-lg bg-white">
          {label && (
            <div className={cn('flex items-center justify-between p-4', !searchable && 'border-b')}>
              {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
              {selectedValues.length > 0 && (
                <Button
                  autoFocus={false}
                  variant="tertiary"
                  onClick={handleClearAll}
                  className="text-xs font-normal focus:ring-0"
                  disabled={disabled}
                >
                  Clear all
                </Button>
              )}
            </div>
          )}

          {/* Search input */}
          {searchable && (
            <CommandInput
              autoFocus
              className="border-gray-300 bg-gray-100 py-1 pl-2 focus:ring-2 focus:ring-gray-200"
              containerClassName="shadow-sm border-none px-4 pt-0 pb-4"
              showSearchIcon={false}
              placeholder={searchPlaceholder}
              value={searchValue}
              onValueChange={setSearchValue}
            />
          )}

          <CommandList>
            {filteredOptions.length === 0 && !shouldShowCustomOption && <CommandEmpty>{emptyMessage}</CommandEmpty>}

            <CommandGroup className="p-0">
              {/* Regular and custom options */}
              {filteredOptions.map((option) => {
                const isSelected = selectedValues.includes(option.value);
                const isDisabled = selectedValues.length >= maxSelections;
                return (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => handleSelect(option.value, option.isCustom)}
                    className={cn(
                      'group flex cursor-pointer items-center gap-2 px-4 py-3 text-sm transition-colors',
                      'hover:bg-gray-100 focus:bg-gray-100 active:bg-gray-100',
                      'focus-visible:bg-gray-100 aria-selected:bg-gray-100',
                      '[&[aria-selected=true]]:bg-gray-100 [&[data-highlighted]]:bg-gray-100',
                      'border-none outline-none focus:outline-none',
                      disabled && 'cursor-not-allowed opacity-50',
                    )}
                    disabled={disabled || (!isSelected && isDisabled)}
                  >
                    <div
                      className={cn(
                        'flex h-4 w-4 items-center justify-center rounded-sm border',
                        isSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-gray-300',
                      )}
                    >
                      {isSelected && <Check className="h-3 w-3" />}
                    </div>
                    {renderOptionItem(option)}
                  </CommandItem>
                );
              })}

              {/* Custom option creation button */}
              {shouldShowCustomOption && (
                <CommandItem
                  value={searchValue}
                  onSelect={() => handleAddCustomOption(searchValue)}
                  className={cn(
                    'group flex w-full cursor-pointer items-center gap-2 px-4 py-3 text-sm transition-colors',
                    'hover:bg-gray-50 focus:bg-gray-50 active:bg-gray-50',
                    'border-none outline-none focus:outline-none',
                    disabled && 'cursor-not-allowed opacity-50',
                  )}
                  disabled={disabled || selectedValues.length >= maxSelections}
                >
                  <Plus className="h-4 w-4" />
                  <span className="font-medium">{customOptionLabel.replace('{searchValue}', searchValue)}</span>
                </CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverWrapper>
    </div>
  );
};

export default MultiSelectDropdown;
export type { OptionType };
