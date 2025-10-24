import { X } from 'lucide-react';
import type { FilterConfig, FilterValues, DateRangeValue } from '../../types';
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipTrigger,
} from '@breakout/design-system/components/Tooltip/index';

interface FilterChipsListProps {
  filters: FilterValues;
  filterConfig: FilterConfig[];
  search: string;
  tableData?: unknown[]; // For looking up user metadata
  defaultFilters?: Record<string, unknown>;
  onRemoveFilter: (key: string) => void;
  onRemoveSearch: () => void;
  onClearAll: () => void;
}

/**
 * Displays applied filters as removable chips
 */
export const FilterChipsList = ({
  filters,
  filterConfig,
  search,
  tableData = [],
  defaultFilters = {},
  onRemoveFilter,
  onRemoveSearch,
  onClearAll,
}: FilterChipsListProps) => {
  const chips: Array<{
    key: string;
    filterLabel: string; // Display name like "Assigned Rep", "Company", etc.
    label: string;
    remainingItems?: string[]; // For showing in tooltip
    userMetadata?: Array<{ id: string; fullName: string; avatarUrl?: string }>; // For user avatars
    onRemove: () => void;
  }> = [];
  const defaultFilterKeys = new Set(Object.keys(defaultFilters));

  // Helper to look up user metadata from table data
  const getUserMetadata = (filterKey: string, userIds: string[]) => {
    const metadata: Array<{ id: string; fullName: string; avatarUrl?: string }> = [];

    (tableData as Array<Record<string, unknown>>).forEach((row) => {
      const fieldValue = row[filterKey];
      if (fieldValue && typeof fieldValue === 'object' && 'id' in fieldValue && 'assigned_user' in fieldValue) {
        const sdrData = fieldValue as {
          id: number;
          assigned_user?: { full_name?: string; email?: string; profile_picture?: string };
        };
        const userId = String(sdrData.id);
        if (userIds.includes(userId)) {
          metadata.push({
            id: userId,
            fullName: sdrData.assigned_user?.full_name || sdrData.assigned_user?.email || `User ${userId}`,
            avatarUrl: sdrData.assigned_user?.profile_picture,
          });
        }
      }
    });

    return metadata;
  };

  // Helper to format date from YYYY-MM-DD to MMM DD, YYYY
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
  };

  // Add search chip
  if (search) {
    chips.push({
      key: 'search',
      filterLabel: 'Search',
      label: `"${search}"`,
      onRemove: onRemoveSearch,
    });
  }

  // Add filter chips
  Object.entries(filters).forEach(([key, value]) => {
    // Skip empty values
    if (value === null || value === undefined || value === '') {
      return;
    }

    // Skip if this is a default filter with the same value as default
    if (defaultFilterKeys.has(key) && defaultFilters[key] === value) {
      return;
    }

    const config = filterConfig.find((f) => f.id === key);
    const filterLabel = config?.label || key;

    // Handle toggle filters
    // if (config?.type === 'toggle') {
    //   // Don't show chips for toggle filters with default values (they're always visible in the filter list)
    //   return;
    // }

    // Handle date range
    if (typeof value === 'object' && 'from' in value && 'to' in value) {
      const dateRange = value as DateRangeValue;
      if (dateRange.from || dateRange.to) {
        // Format dates as MMM DD, YYYY
        const formattedDates = [
          dateRange.from ? formatDate(dateRange.from) : null,
          dateRange.to ? formatDate(dateRange.to) : null,
        ].filter(Boolean);
        const rangeText = formattedDates.join(' to ');

        chips.push({
          key,
          filterLabel: 'Date', // Show "Date" instead of "Date Range"
          label: rangeText,
          onRemove: () => onRemoveFilter(key),
        });
      }
    }
    // Handle arrays (multi-select)
    else if (Array.isArray(value)) {
      if (value.length > 0) {
        // Check if this is a user_avatar filter (like sdr_assignment)
        const isUserAvatarFilter = config?.displayType === 'user_avatar';

        if (isUserAvatarFilter) {
          // Get user metadata for all selected IDs
          const userIds = value.map(String);
          const userMetadata = getUserMetadata(key, userIds);

          chips.push({
            key,
            filterLabel,
            label: '', // Will show avatars instead
            userMetadata,
            onRemove: () => onRemoveFilter(key),
          });
        } else {
          // Standard multi-select display
          let displayValue: string;
          let remainingItems: string[] | undefined;

          if (value.length <= 2) {
            displayValue = value.join(', ');
          } else {
            // Show first 2 items, rest in tooltip
            displayValue = value.slice(0, 2).join(', ');
            remainingItems = value.slice(2); // All remaining items for tooltip
          }

          chips.push({
            key,
            filterLabel,
            label: displayValue,
            remainingItems,
            onRemove: () => onRemoveFilter(key),
          });
        }
      }
    }
    // Handle primitives
    else {
      chips.push({
        key,
        filterLabel,
        label: typeof value === 'boolean' ? (value ? 'On' : 'Off') : String(value),
        onRemove: () => onRemoveFilter(key),
      });
    }
  });

  if (chips.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      {chips.map((chip) => (
        <div key={chip.key} className="flex items-center gap-2 rounded-md border py-1 pl-3 pr-1 text-sm text-gray-800">
          <span className="font-medium">{chip.filterLabel}:</span>

          {/* Show user avatars if available */}
          {chip.userMetadata && chip.userMetadata.length > 0 ? (
            <div className="flex items-center gap-1.5">
              {chip.userMetadata.slice(0, 2).map((user) => (
                <div key={user.id} className="flex items-center gap-1.5">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.fullName}
                      className="h-5 w-5 flex-shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-gray-200">
                      <span className="text-[10px] font-medium text-gray-600">
                        {user.fullName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <span className="text-xs">{user.fullName}</span>
                </div>
              ))}

              {/* Show +n more pill for additional users */}
              {chip.userMetadata.length > 2 && (
                <TooltipProvider delayDuration={200}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="inline-flex cursor-default items-center rounded-full bg-gray-800 px-2 py-0.5 text-xs font-medium text-white">
                        +{chip.userMetadata.length - 2} more
                      </span>
                    </TooltipTrigger>
                    <TooltipPortal>
                      <TooltipContent side="top" className="max-w-xs bg-primaryV2 text-primaryV2-foreground">
                        <div className="space-y-2">
                          {chip.userMetadata.slice(2).map((user) => (
                            <div key={user.id} className="flex items-center gap-2">
                              {user.avatarUrl ? (
                                <img
                                  src={user.avatarUrl}
                                  alt={user.fullName}
                                  className="h-5 w-5 flex-shrink-0 rounded-full object-cover"
                                />
                              ) : (
                                <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-gray-700">
                                  <span className="text-[10px] font-medium text-white">
                                    {user.fullName.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              )}
                              <span className="text-xs">{user.fullName}</span>
                            </div>
                          ))}
                        </div>
                      </TooltipContent>
                    </TooltipPortal>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          ) : (
            <>
              <span>{chip.label}</span>

              {/* Show +n more pill with tooltip for regular items */}
              {chip.remainingItems && chip.remainingItems.length > 0 && (
                <TooltipProvider delayDuration={200}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="inline-flex cursor-default items-center rounded-full bg-gray-800 px-2 py-0.5 text-xs font-medium text-white">
                        +{chip.remainingItems.length} more
                      </span>
                    </TooltipTrigger>
                    <TooltipPortal>
                      <TooltipContent side="top" className="max-w-xs bg-primaryV2 text-primaryV2-foreground">
                        <div className="space-y-1">
                          {chip.remainingItems.map((item, index) => (
                            <div key={index} className="text-xs">
                              {item}
                            </div>
                          ))}
                        </div>
                      </TooltipContent>
                    </TooltipPortal>
                  </Tooltip>
                </TooltipProvider>
              )}
            </>
          )}

          <button
            onClick={chip.onRemove}
            className="rounded-full p-1.5 hover:bg-gray-100 hover:text-black"
            aria-label={`Remove filter: ${chip.label}`}
          >
            <X className="size-4" />
          </button>
        </div>
      ))}
      {chips.length > 1 && (
        <button onClick={onClearAll} className="text-sm text-gray-800 hover:text-gray-700 hover:underline">
          Clear all
        </button>
      )}
    </div>
  );
};
