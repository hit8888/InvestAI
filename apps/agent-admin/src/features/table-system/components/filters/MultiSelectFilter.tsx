import { useCallback, useState, useEffect, useRef, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { List, type RowComponentProps } from 'react-window';
import type { FilterConfig, FilterValues } from '../../types';
import { useFilterOptions } from '../../hooks/useFilterOptions';
import ClearAllIcon from '@breakout/design-system/components/icons/clear-all-icon';
import { MultiSelectOption } from './MultiSelectOption';

interface MultiSelectFilterProps {
  config: FilterConfig;
  value: string[] | null | undefined;
  allFilters: FilterValues;
  defaultFilters?: Record<string, unknown>;
  tableData?: unknown[]; // For ID_LOOKUP filters
  filterOptionsEndpoint?: string;
  onChange: (value: string[] | null) => void;
}

/**
 * Multi-select filter component
 * Allows selecting multiple options from a list with search
 */
export const MultiSelectFilter = ({
  config,
  value,
  allFilters,
  defaultFilters = {},
  tableData = [],
  filterOptionsEndpoint,
  onChange,
}: MultiSelectFilterProps) => {
  // Optimistic local state for immediate UI updates
  const [optimisticSelections, setOptimisticSelections] = useState<string[]>(() => (Array.isArray(value) ? value : []));

  // Sync optimistic state with prop value
  useEffect(() => {
    setOptimisticSelections(Array.isArray(value) ? value : []);
  }, [value]);

  const selectedValues = optimisticSelections;

  // Fetch filter options from API
  const { filteredOptions, isLoading, isError, searchTerm, setSearchTerm, isFetching } = useFilterOptions({
    filterId: config.id,
    allFilters,
    defaultFilters,
    optionsType: config.optionsType,
    tableData,
    filterOptionsEndpoint,
    enabled: true,
  });

  const handleToggle = useCallback(
    (optionValue: string) => {
      const newValues = selectedValues.includes(optionValue)
        ? selectedValues.filter((v) => v !== optionValue)
        : [...selectedValues, optionValue];

      // Update optimistic state immediately for instant UI response
      setOptimisticSelections(newValues);

      // Update parent state (this will sync back via useEffect)
      onChange(newValues.length > 0 ? newValues : null);
    },
    [selectedValues, onChange],
  );

  const handleSelectAll = useCallback(() => {
    const allValues = filteredOptions.map((opt) => opt.value);
    setOptimisticSelections(allValues);
    onChange(allValues);
  }, [filteredOptions, onChange]);

  const handleClearAll = useCallback(() => {
    setOptimisticSelections([]);
    onChange(null);
  }, [onChange]);

  // Sort options: selected first, then unselected
  // Use useMemo to prevent unnecessary recalculations and maintain stable references
  const sortedOptions = useMemo(() => {
    if (filteredOptions.length === 0) return [];

    // Sort: selected first, then unselected
    return [...filteredOptions].sort((a, b) => {
      const aSelected = selectedValues.includes(a.value);
      const bSelected = selectedValues.includes(b.value);

      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;

      return 0;
    });
  }, [filteredOptions, selectedValues]);

  // Ref for container to measure dynamic height
  const containerRef = useRef<HTMLDivElement>(null);
  const [listHeight, setListHeight] = useState(400);

  // Use ref to store sortedOptions to prevent rowComponent from being recreated
  const sortedOptionsRef = useRef<typeof sortedOptions>(sortedOptions);
  useEffect(() => {
    sortedOptionsRef.current = sortedOptions;
  }, [sortedOptions]);

  // Calculate available height for the list dynamically
  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        const containerHeight = containerRef.current.clientHeight;
        // Account for search (68px) and footer (50px - always visible now)
        const availableHeight = containerHeight - 68 - 50;
        setListHeight(Math.max(200, availableHeight)); // Minimum 200px
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  // Memoize rowComponent callback outside conditional to satisfy React Hooks rules
  const rowComponent = useCallback(
    ({ index, style }: RowComponentProps) => {
      const option = sortedOptionsRef.current[index];
      if (!option) return <div style={style} />;

      const isSelected = selectedValues.includes(option.value);
      return (
        <div style={style}>
          <MultiSelectOption
            key={option.value}
            option={option}
            isSelected={isSelected}
            isFetching={isFetching}
            isLoading={isLoading}
            displayType={config.displayType}
            onToggle={handleToggle}
          />
        </div>
      );
    },
    [selectedValues, isFetching, isLoading, config.displayType, handleToggle],
  );

  return (
    <div ref={containerRef} className="flex h-full flex-col">
      {/* Search */}
      <div className="border-b p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`Search ${config.label.toLowerCase()}...`}
            className="w-full rounded-md border border-gray-300 py-2 pl-9 pr-9 text-sm focus:border-transparent focus:outline-none focus:ring-1 focus:ring-gray-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Options List - Virtualized */}
      <div className="flex-1 overflow-hidden px-1">
        {isLoading ? (
          <div className="space-y-1 p-2">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="flex items-center gap-3 rounded-md px-1 py-2">
                <div className="h-4 w-4 animate-pulse rounded bg-gray-100" />
                <div className="h-4 flex-1 animate-pulse rounded bg-gray-100" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="flex h-32 items-center justify-center text-sm text-red-500">Error loading options</div>
        ) : filteredOptions.length === 0 ? (
          <div className="flex h-32 items-center justify-center text-sm text-gray-500">
            {searchTerm ? 'No options match your search' : 'No options found'}
          </div>
        ) : (
          <List
            defaultHeight={listHeight}
            rowCount={sortedOptions.length}
            rowHeight={40} // Height of each option (40px + 4px spacing)
            overscanCount={10} // Render 10 extra items above/below viewport for smooth scrolling
            className="px-2"
            rowProps={{}}
            rowComponent={rowComponent}
          />
        )}
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
        <button
          onClick={handleSelectAll}
          disabled={isLoading || sortedOptions.length === 0}
          className="text-sm font-medium text-gray-900 hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
        >
          Select All
        </button>
        <button
          onClick={handleClearAll}
          disabled={selectedValues.length === 0}
          className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ClearAllIcon className="size-4" />
          Clear All
        </button>
      </div>
    </div>
  );
};
