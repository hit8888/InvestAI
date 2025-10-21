import { Filter } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import * as LucideIcons from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { FilterConfig, FilterValues } from '../types';
import type { QuickFilterConfig } from '../types/filter.types';
import type { ExportFormatType } from '@meaku/core/types/admin/api';
import { SearchFilter } from './filters/SearchFilter';
import { FilterChipsList } from './filters/FilterChipsList';
import { MultiSelectFilter } from './filters/MultiSelectFilter';
import { DateRangeFilter } from './filters/DateRangeFilter';
import { ToggleFilter } from './filters/ToggleFilter';
import { GenericTableColumnManager } from './GenericTableColumnManager';
import { GenericTableExportDownload } from './GenericTableExportDownload';

interface GenericTableFiltersProps {
  filters: FilterValues;
  filterConfig: FilterConfig[];
  quickFilters?: QuickFilterConfig[];
  search: string;
  tableData?: unknown[]; // For ID_LOOKUP filters
  defaultFilters?: Record<string, unknown>;
  filterOptionsEndpoint?: string;
  onFilterChange: (key: string, value: unknown) => void;
  onSearchChange: (value: string) => void;
  onResetFilters: () => void;
  isLoadingConfig?: boolean;
  // Export configuration
  exportConfig?: {
    enabled: boolean;
    formats?: ('csv' | 'xlsx')[];
    defaultFormat?: 'csv' | 'xlsx';
    onExport: (format: ExportFormatType) => Promise<boolean>;
  };
}

/**
 * Filters toolbar with filters button, search, and column manager
 * Layout: [Filters Button + Search] --- [Column Manager]
 */
export const GenericTableFilters = ({
  filters,
  filterConfig,
  quickFilters = [],
  search,
  tableData = [],
  defaultFilters = {},
  filterOptionsEndpoint,
  onFilterChange,
  onSearchChange,
  onResetFilters,
  isLoadingConfig = false,
  exportConfig,
}: GenericTableFiltersProps) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const filtersPopoverRef = useRef<HTMLDivElement>(null);

  // Keep all filters together - toggles will be rendered inline
  const allFilters = filterConfig;

  // Close popovers on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filtersPopoverRef.current && !filtersPopoverRef.current.contains(event.target as Node)) {
        setIsFiltersOpen(false);
        setActiveFilter(null); // Reset active filter when closing
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Count regular filters (excluding default filters with default values)
  const defaultFilterKeys = new Set(Object.keys(defaultFilters || {}));
  const regularFiltersCount = Object.keys(filters).filter((key) => {
    const value = filters[key];

    // Skip empty values
    if (value == null || value === '' || (Array.isArray(value) && value.length === 0)) {
      return false;
    }

    // Skip if this is a default filter with the same value as default
    if (defaultFilterKeys.has(key) && defaultFilters[key] === value) {
      return false;
    }

    return true;
  }).length;

  // Include search in total count if it has a value
  const appliedFiltersCount = regularFiltersCount + (search.trim() ? 1 : 0);

  // Helper to get icon component from name
  const getIconComponent = (iconName?: string) => {
    if (!iconName) return Filter;
    const IconComponent = (LucideIcons as unknown as Record<string, typeof Filter>)[iconName];
    return IconComponent || Filter;
  };

  // Handle filter click
  const handleFilterClick = (filterId: string) => {
    setActiveFilter(filterId);
  };

  // Handle back to filters list
  const handleBackToFilters = () => {
    setActiveFilter(null);
  };

  // Get active filter config
  const activeFilterConfig = activeFilter ? allFilters.find((f) => f.id === activeFilter) : null;

  if (isLoadingConfig) {
    return (
      <div className="mb-4">
        <div className="flex animate-pulse items-center justify-between">
          <div className="h-10 w-64 rounded bg-gray-200"></div>
          <div className="h-10 w-64 rounded bg-gray-200"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4">
      {/* Filters toolbar */}
      <div className="flex items-center justify-between gap-4">
        {/* Left side: Filters button + Quick filters + Filter chips */}
        <div className="flex items-center gap-3">
          {/* Filters popover button */}
          <div className="relative" ref={filtersPopoverRef}>
            <button
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium text-gray-700 transition-colors ${
                isFiltersOpen
                  ? 'border-gray-500 bg-white hover:bg-gray-50'
                  : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <Filter className="h-4 w-4" />
              Filters
              {appliedFiltersCount > 0 && (
                <span className="flex size-5 items-center justify-center rounded-full bg-primaryV2 pr-0.5 text-xs font-semibold text-primaryV2-foreground">
                  {appliedFiltersCount}
                </span>
              )}
            </button>

            {isFiltersOpen && allFilters.length > 0 && (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95, height: 'auto' }}
                animate={{ opacity: 1, scale: 1, height: 'auto' }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                className={`absolute left-0 z-50 mt-6 overflow-hidden rounded-xl bg-white shadow-lg ${activeFilterConfig?.type === 'date-range' ? 'w-[680px]' : 'w-[350px]'}`}
              >
                {/* Header */}
                {activeFilter && (
                  <div className="border-b border-gray-200 px-4 py-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleBackToFilters}
                          className="flex items-center text-gray-600 hover:text-gray-900"
                        >
                          <LucideIcons.ChevronLeft className="h-4 w-4" />
                        </button>
                        <h3 className="text-sm font-semibold text-gray-900">
                          {activeFilterConfig ? activeFilterConfig.label : null}
                        </h3>
                      </div>
                      {activeFilter && (
                        <button
                          onClick={() => {
                            setIsFiltersOpen(false);
                            setActiveFilter(null);
                          }}
                          className="flex items-center text-gray-400 hover:text-gray-600"
                        >
                          <LucideIcons.X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Content */}
                <AnimatePresence mode="wait">
                  {!activeFilter ? (
                    // Filters List
                    <motion.div
                      key="filters-list"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.15 }}
                    >
                      <div className="max-h-96 overflow-y-auto p-2">
                        <div className="flex flex-col gap-2">
                          {allFilters.map((filter) => {
                            const IconComponent = getIconComponent(filter.icon);
                            const filterValue = filters[filter.id];

                            // Handle toggle filters differently
                            if (filter.type === 'toggle') {
                              // Use defaultValue from config if filterValue is not set
                              const defaultValue = filter.defaultValue !== undefined ? filter.defaultValue : true;
                              const isEnabled =
                                filterValue !== undefined && filterValue !== null
                                  ? filterValue !== false
                                  : defaultValue !== false;
                              const displayText = isEnabled ? 'On' : 'Off';
                              return (
                                <div
                                  key={filter.id}
                                  className="flex items-center justify-between gap-3 rounded-md bg-white px-4 py-3 text-gray-900"
                                >
                                  <div className="flex items-center gap-3">
                                    <IconComponent className="size-5 flex-shrink-0 stroke-[1.5]" />
                                    <span className="text-xs">{filter.label}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-600">{displayText}</span>
                                    <ToggleFilter
                                      config={filter}
                                      value={isEnabled}
                                      onChange={(value) => onFilterChange(filter.id, value)}
                                    />
                                  </div>
                                </div>
                              );
                            }

                            // Regular filters
                            const isApplied =
                              filterValue != null &&
                              filterValue !== '' &&
                              !(Array.isArray(filterValue) && (filterValue as unknown[]).length === 0);

                            // Get display text for the filter
                            let displayText = 'Any';
                            if (Array.isArray(filterValue) && filterValue.length > 0) {
                              displayText = `${filterValue.length} selected`;
                            } else if (isApplied) {
                              // Handle date range objects
                              if (
                                typeof filterValue === 'object' &&
                                filterValue !== null &&
                                'from' in filterValue &&
                                'to' in filterValue
                              ) {
                                const dateRange = filterValue as { from: string | null; to: string | null };
                                if (dateRange.from || dateRange.to) {
                                  // Format dates as MMM DD, YYYY
                                  const formatShortDate = (dateString: string): string => {
                                    const date = new Date(dateString);
                                    return date.toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: '2-digit',
                                      year: 'numeric',
                                    });
                                  };
                                  const formattedDates = [
                                    dateRange.from ? formatShortDate(dateRange.from) : null,
                                    dateRange.to ? formatShortDate(dateRange.to) : null,
                                  ].filter(Boolean);
                                  displayText = formattedDates.join(' - ');
                                }
                              } else {
                                displayText = String(filterValue);
                              }
                            }

                            return (
                              <div
                                key={filter.id}
                                onClick={() => handleFilterClick(filter.id)}
                                className="flex cursor-pointer items-center justify-between gap-3 rounded-md bg-white px-4 py-3 text-gray-900 transition-colors hover:bg-gray-50"
                              >
                                <div className="flex items-center gap-3">
                                  <IconComponent className="size-5 flex-shrink-0 stroke-[1.5]" />
                                  <span className="text-xs">{filter.label}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-600">{displayText}</span>
                                  {displayText !== 'Any' && <div className="size-1.5 rounded-full bg-green-500" />}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    // Active Filter Component
                    <motion.div
                      key="active-filter"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.15 }}
                      className="flex h-[400px] flex-col"
                    >
                      {activeFilterConfig?.type === 'multi-select' && activeFilter && (
                        <MultiSelectFilter
                          config={activeFilterConfig}
                          value={filters[activeFilter] as string[] | null | undefined}
                          allFilters={filters}
                          defaultFilters={defaultFilters}
                          tableData={tableData}
                          filterOptionsEndpoint={filterOptionsEndpoint}
                          onChange={(value) => onFilterChange(activeFilter, value)}
                        />
                      )}
                      {activeFilterConfig?.type === 'date-range' && activeFilter && (
                        <DateRangeFilter
                          config={activeFilterConfig}
                          value={filters[activeFilter] as { from: string | null; to: string | null } | null | undefined}
                          onChange={(value) => onFilterChange(activeFilter, value)}
                          onBack={handleBackToFilters}
                          onApply={() => {
                            setIsFiltersOpen(false);
                            setActiveFilter(null);
                          }}
                        />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </div>

          {/* Quick filter buttons */}
          {quickFilters.map((quickFilter) => {
            // Check if filter is active - must check key existence for null values
            const isActive =
              quickFilter.filterField in filters && filters[quickFilter.filterField] === quickFilter.filterValue;

            return (
              <button
                key={quickFilter.id}
                onClick={() => {
                  if (isActive) {
                    // Remove filter by setting to undefined (removes key from state)
                    onFilterChange(quickFilter.filterField, undefined);
                  } else {
                    // Apply filter
                    onFilterChange(quickFilter.filterField, quickFilter.filterValue);
                  }
                }}
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'border bg-gray-800 text-white hover:bg-gray-700'
                    : 'border-dashed-wide-dark bg-gray-50 text-gray-600 hover:text-gray-800'
                }`}
              >
                {quickFilter.label}
              </button>
            );
          })}

          {/* Filter chips */}
          {(appliedFiltersCount > 0 || search) && (
            <FilterChipsList
              filters={filters}
              filterConfig={filterConfig}
              search={search}
              tableData={tableData}
              defaultFilters={defaultFilters}
              onRemoveFilter={(key) => {
                // For toggle filters, reset to their default value instead of removing
                const filterConfigItem = filterConfig.find((f) => f.id === key);
                if (filterConfigItem?.type === 'toggle' && filterConfigItem.defaultValue !== undefined) {
                  onFilterChange(key, filterConfigItem.defaultValue);
                } else {
                  // Use undefined to completely remove the filter from state and URL
                  onFilterChange(key, undefined);
                }
              }}
              onRemoveSearch={() => onSearchChange('')}
              onClearAll={onResetFilters}
            />
          )}
        </div>

        {/* Right side: Search + Export + Column manager */}
        <div className="flex items-center gap-3">
          {/* Search filter - inline with Filters button */}
          <SearchFilter value={search} onChange={onSearchChange} placeholder="Search..." />
          {/* Export/Download button */}
          {exportConfig?.enabled && (
            <GenericTableExportDownload
              formats={exportConfig.formats}
              defaultFormat={exportConfig.defaultFormat}
              onExport={exportConfig.onExport}
            />
          )}
          {/* Column manager */}
          <GenericTableColumnManager />
        </div>
      </div>
    </div>
  );
};
