import { useMemo, useState } from 'react';
import { useAllFilterStore } from '../stores/useAllFilterStore';
import { useTableStore } from '../stores/useTableStore';
import { FilterOptionsPayload } from '@meaku/core/types/admin/api';
import { getAllFilterAppliedValues, getDescendingOrderedOptions } from '../utils/common';
import useFilterOptionsDataQuery from '../queries/query/useFilterOptionsDataQuery';
import { useQueryOptions } from './useQueryOptions';
import { useDebouncedValue } from '@meaku/core/hooks/useDebouncedValue';
import { ResultantOption, FilterValues, FilterValueTypes } from '@meaku/core/types/admin/filters';
import { PaginationPageType } from '@meaku/core/types/admin/admin';

interface UseFilterContentProps {
  page: PaginationPageType;
  field: 'company' | 'country' | 'product_of_interest' | 'product_interest' | 'sdr_assignment';
  enableSearch?: boolean;
}

interface UseFilterContentReturn {
  filters: FilterValues;
  setFilter: (page: PaginationPageType, field: keyof FilterValues, value: FilterValueTypes) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  resultantOptions: ResultantOption[];
  isLoading: boolean;
  isError: boolean;
  data:
    | {
        field: string;
        values: string[];
      }
    | undefined;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearSearchTerm: () => void;
  hasSearchTermLength: boolean;
}

export const useFilterContent = ({
  page,
  field,
  enableSearch = false,
}: UseFilterContentProps): UseFilterContentReturn => {
  const [searchTerm, setSearchTerm] = useState('');

  // Store subscriptions
  const filters = useAllFilterStore((state) => state[page]);
  const setFilter = useAllFilterStore((state) => state.setFilter);
  const tableManager = useTableStore((state) => state.tableManager);

  const filtersOptionsPayload = useMemo(() => {
    return getAllFilterAppliedValues(filters, page).filter((filter) => filter.field !== field);
  }, [filters, page, field]);

  const payloadData: FilterOptionsPayload = useMemo(
    () => ({
      filters: filtersOptionsPayload,
      field,
      search: enableSearch ? searchTerm : '',
    }),
    [filtersOptionsPayload, field, searchTerm, enableSearch],
  );

  // Use debounced payload to prevent excessive API calls
  const debouncedPayloadData = useDebouncedValue(payloadData);
  const queryOptions = useQueryOptions();

  const { data, isLoading, isError } = useFilterOptionsDataQuery({
    payload: debouncedPayloadData,
    page,
    queryOptions,
  });

  const sortedItems = useMemo(() => tableManager?.getSortedItemsByKey(field) ?? [], [tableManager, field]);

  const filterValues = useMemo(() => data?.values.filter(Boolean) ?? [], [data]);

  const resultantOptions = useMemo(
    () => getDescendingOrderedOptions(enableSearch && searchTerm ? [] : sortedItems, filterValues),
    [searchTerm, sortedItems, filterValues, enableSearch],
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearSearchTerm = () => {
    setSearchTerm('');
  };

  const hasSearchTermLength = searchTerm.length > 0;

  return {
    filters,
    setFilter,
    searchTerm,
    setSearchTerm,
    resultantOptions,
    isLoading,
    isError,
    data,
    handleInputChange,
    clearSearchTerm,
    hasSearchTermLength,
  };
};
