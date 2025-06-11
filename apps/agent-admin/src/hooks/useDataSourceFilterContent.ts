import { useMemo } from 'react';
import { useAllFilterStore } from '../stores/useAllFilterStore';
import { FilterOptionsPayload } from '@meaku/core/types/admin/api';
import { getAllFilterAppliedValues, getDescendingOrderedOptions } from '../utils/common';
import { useQueryOptions } from './useQueryOptions';
import useDataSourceFilterOptionsDataQuery from '../queries/query/useDataSourceFilterOptionsDataQuery';
import { FilterValues, FilterValueTypes, ResultantOption } from '@meaku/core/types/admin/filters';
import { PaginationPageType } from '@meaku/core/types/admin/admin';

interface UseDataSourceFilterContentProps {
  page: PaginationPageType;
  field: 'status' | 'sources' | 'fileType';
  filterPayload?: string;
}

interface UseDataSourceFilterContentReturn {
  filters: FilterValues;
  setFilter: (page: PaginationPageType, field: keyof FilterValues, value: FilterValueTypes) => void;
  resultantOptions: ResultantOption[];
  isLoading: boolean;
  isError: boolean;
  data:
    | {
        field: string;
        values: string[];
      }
    | undefined;
}

export const useDataSourceFilterContent = ({
  page,
  field,
  filterPayload,
}: UseDataSourceFilterContentProps): UseDataSourceFilterContentReturn => {
  // Store subscriptions
  const filters = useAllFilterStore((state) => state[page]);
  const setFilter = useAllFilterStore((state) => state.setFilter);

  const filtersOptionsPayload = useMemo(() => {
    return getAllFilterAppliedValues(filters, page).filter((filter) => filter.field !== field);
  }, [filters, page, field]);

  const payloadData: FilterOptionsPayload = useMemo(
    () => ({
      filters: filtersOptionsPayload,
      field: filterPayload || field,
      search: '',
    }),
    [filtersOptionsPayload, field, filterPayload],
  );

  const queryOptions = useQueryOptions();

  const { data, isLoading, isError } = useDataSourceFilterOptionsDataQuery({
    payload: payloadData,
    page,
    queryOptions,
  });

  const filterValues = useMemo(() => data?.values.filter(Boolean) ?? [], [data]);

  const resultantOptions = useMemo(() => getDescendingOrderedOptions([], filterValues), [filterValues]);

  return {
    filters,
    setFilter,
    resultantOptions,
    isLoading,
    isError,
    data,
  };
};
