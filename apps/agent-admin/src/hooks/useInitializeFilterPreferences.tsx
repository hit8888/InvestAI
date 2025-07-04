import { useEffect } from 'react';
import { useSortFilterStore } from '../stores/useSortFilterStore';
import { useAllFilterStore } from '../stores/useAllFilterStore';
import useFilterPreferencesQuery from '../queries/query/useFilterPreferencesQuery';
import { useQueryOptions } from './useQueryOptions';
import { getSortValuesFromSortItems } from '../utils/common.ts';
import { MainPageType } from '@meaku/core/types/admin/admin';
import { PageTypeToTableName } from '@meaku/core/utils/index';

export const useInitializeFilterPreferences = (page: MainPageType) => {
  const { initializeSortValues } = useSortFilterStore();
  const { initializeFilterValues } = useAllFilterStore();
  const queryOptions = useQueryOptions();

  // Fetch filter preferences
  const { data } = useFilterPreferencesQuery({
    tableName: PageTypeToTableName[page],
    queryOptions,
  });

  // Apply filter preferences
  useEffect(() => {
    const filters = data?.filter_data?.filters;
    const sortData = data?.filter_data?.sort;
    if (filters && filters.length > 0) {
      initializeFilterValues(page, filters);
    }
    if (sortData) {
      const sortValues = getSortValuesFromSortItems(sortData);
      initializeSortValues(page, sortValues);
    }
  }, [data]);
};
