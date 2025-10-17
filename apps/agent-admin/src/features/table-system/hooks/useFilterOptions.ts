import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import adminApiClient from '@meaku/core/adminHttp/client';
import { useDebouncedValue } from '@meaku/core/hooks/useDebouncedValue';
import type { FilterValues } from '../types';

interface FilterItem {
  field: string;
  operator: 'eq' | 'in' | 'contains' | 'between' | 'gt' | 'lt' | 'gte' | 'lte' | 'is_null' | 'is_not_null';
  value: string | number | boolean | string[] | number[] | null;
}

interface FilterOptionsPayload {
  field: string;
  filters: FilterItem[];
  search: string;
}

interface FilterOptionsResponse {
  field: string;
  values: string[];
}

interface UseFilterOptionsProps {
  filterId: string;
  allFilters: FilterValues;
  defaultFilters?: Record<string, unknown>;
  optionsType?: 'DIRECT' | 'ID_LOOKUP';
  tableData?: unknown[]; // For ID_LOOKUP: current table data to extract rich objects
  filterOptionsEndpoint?: string;
  enabled?: boolean;
}

interface UseFilterOptionsReturn {
  options: Array<{ value: string; label: string; metadata?: Record<string, unknown> }>;
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filteredOptions: Array<{ value: string; label: string; metadata?: Record<string, unknown> }>;
}

// Type for SDR assignment field value structure
interface SdrAssignmentValue {
  id: number;
  assigned_user?: {
    full_name?: string;
    email?: string;
    profile_picture?: string;
  };
  routing_source?: string;
}

// Type guard to check if value is SdrAssignmentValue
function isSdrAssignmentValue(value: unknown): value is SdrAssignmentValue {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const obj = value as Record<string, unknown>;
  return 'id' in obj && typeof obj.id === 'number' && 'assigned_user' in obj;
}

/**
 * Hook to fetch filter options from API
 * Based on V1's useFilterContent pattern
 */
export const useFilterOptions = ({
  filterId,
  allFilters,
  defaultFilters = {},
  optionsType = 'DIRECT',
  tableData = [],
  filterOptionsEndpoint = '/tenant/api/prospects/filterset/',
  enabled = true,
}: UseFilterOptionsProps): UseFilterOptionsReturn => {
  const [searchTerm, setSearchTerm] = useState('');

  // Build filters payload - include default filters + user filters (exclude current filter)
  const filtersPayload = useMemo(() => {
    const filters: FilterItem[] = [];

    // List of UI-only filter keys that are not real table columns
    const UI_ONLY_FILTERS = ['company_revealed'];

    // First, add default filters (like V1)
    Object.entries(defaultFilters)
      .filter(([field]) => !UI_ONLY_FILTERS.includes(field)) // Exclude UI-only toggle filters
      .forEach(([field, value]) => {
        if (value === null) {
          filters.push({ field, operator: 'is_not_null', value: null });
        } else if (typeof value === 'boolean') {
          filters.push({ field, operator: 'eq', value });
        } else {
          filters.push({ field, operator: 'eq', value: value as string | number });
        }
      });

    // Then, add user-applied filters (exclude current filter)
    Object.entries(allFilters)
      .filter(([key]) => key !== filterId)
      .filter(([key]) => !UI_ONLY_FILTERS.includes(key)) // Exclude UI-only toggle filters
      .filter(([key]) => !(key in defaultFilters)) // Don't duplicate default filters
      .filter(([, value]) => {
        // Include null values (for is_not_null operator)
        if (value === null) return true;
        // Exclude empty strings and empty arrays
        if (value === '') return false;
        if (Array.isArray(value) && value.length === 0) return false;
        // Include everything else
        return true;
      })
      .forEach(([field, value]) => {
        // Handle null values with is_not_null operator (V1 pattern)
        if (value === null) {
          filters.push({ field, operator: 'is_not_null', value: null });
        }
        // Array values use 'in' operator
        else if (Array.isArray(value)) {
          filters.push({ field, operator: 'in', value: value as string[] });
        }
        // Check if it's a date range object (has from/to properties)
        else if (typeof value === 'object' && value !== null && 'from' in value && 'to' in value) {
          const dateRange = value as { from: string | null; to: string | null };
          filters.push({
            field,
            operator: 'between',
            value: [dateRange.from || '', dateRange.to || ''],
          });
        }
        // Default to eq for primitives
        else {
          filters.push({ field, operator: 'eq', value: value as string | number | boolean });
        }
      });

    return filters;
  }, [allFilters, defaultFilters, filterId]);

  // Build request payload
  const payload: FilterOptionsPayload = useMemo(
    () => ({
      field: filterId,
      filters: filtersPayload,
      search: searchTerm,
    }),
    [filterId, filtersPayload, searchTerm],
  );

  // Debounce the payload to prevent excessive API calls
  const debouncedPayload = useDebouncedValue(payload, 300);

  // Fetch filter options
  const { data, isLoading, isError, isFetching } = useQuery<FilterOptionsResponse>({
    queryKey: ['filter-options', filterOptionsEndpoint, debouncedPayload],
    queryFn: async () => {
      const response = await adminApiClient.post(filterOptionsEndpoint, debouncedPayload);
      return response.data;
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Transform values to options
  const options = useMemo(() => {
    if (!data?.values) return [];

    if (optionsType === 'ID_LOOKUP') {
      // For ID_LOOKUP: API returns IDs, we need to look up rich objects from table data
      const ids = data.values.filter(Boolean).map(Number);
      const optionsMap = new Map();

      // Extract rich objects from table data
      (tableData as Array<Record<string, unknown>>).forEach((row) => {
        const fieldValue = row[filterId];

        if (isSdrAssignmentValue(fieldValue)) {
          if (ids.includes(fieldValue.id)) {
            const fullName =
              fieldValue.assigned_user?.full_name || fieldValue.assigned_user?.email || `User ${fieldValue.id}`;

            optionsMap.set(fieldValue.id, {
              value: String(fieldValue.id),
              label: fullName,
              metadata: {
                avatarUrl: fieldValue.assigned_user?.profile_picture,
                fullName: fullName,
                email: fieldValue.assigned_user?.email,
                companyLogo: fieldValue.routing_source,
                rawObject: fieldValue, // Keep full object for advanced rendering
              },
            });
          }
        }
      });

      // If no options found from lookup, create fallback options with IDs
      if (optionsMap.size === 0 && ids.length > 0) {
        return ids.map((id) => ({
          value: String(id),
          label: `User ${id}`,
          metadata: {
            fullName: `User ${id}`,
          },
        }));
      }

      return Array.from(optionsMap.values());
    }

    // DIRECT: API returns the actual values (country names, company names, etc.)
    // Sort by frequency in current table data (like V1)
    const apiValues = data.values.filter(Boolean);

    // Count occurrences in table data
    const valueCounts = new Map<string, number>();
    (tableData as Array<Record<string, unknown>>).forEach((row) => {
      const fieldValue = row[filterId];
      if (typeof fieldValue === 'string' && fieldValue) {
        valueCounts.set(fieldValue, (valueCounts.get(fieldValue) || 0) + 1);
      }
    });

    // Sort API values by frequency (most common first)
    const sortedValues = [...apiValues].sort((a, b) => {
      const countA = valueCounts.get(a) || 0;
      const countB = valueCounts.get(b) || 0;
      return countB - countA; // Descending order
    });

    return sortedValues.map((value) => ({
      value,
      label: value,
    }));
  }, [data, optionsType, tableData, filterId]);

  // Filter options based on local search
  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;
    const lowerSearch = searchTerm.toLowerCase();
    return options.filter((option) => option.label.toLowerCase().includes(lowerSearch));
  }, [options, searchTerm]);

  return {
    options,
    isLoading,
    isError,
    isFetching,
    searchTerm,
    setSearchTerm,
    filteredOptions,
  };
};
