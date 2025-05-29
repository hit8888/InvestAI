import React, { useMemo } from 'react';
import { useAllFilterStore } from '../../stores/useAllFilterStore';
import CommonCheckboxesFilterContent from './CommonCheckboxesFilterContent';
import { FilterType, CommonFilterContentProps } from '@meaku/core/types/admin/filters';
import { FilterOptionsPayload } from '@meaku/core/types/admin/api';
import { getAllFilterAppliedValues, getDescendingOrderedOptions } from '../../utils/common';
import { useQueryOptions } from '../../hooks/useQueryOptions';
import FilterOptionsShimmer from '../ShimmerComponent/FilterOptionsShimmer';
import useDataSourceFilterOptionsDataQuery from '../../queries/query/useDataSourceFilterOptionsDataQuery';

const StatusFilterContent = ({ page, filterState, handleClosePopover }: CommonFilterContentProps) => {
  const filters = useAllFilterStore();
  const filtersValues = filters[page];
  const { Status } = FilterType;

  const filtersOptionsPayload = useMemo(() => {
    return getAllFilterAppliedValues(filtersValues, page).filter((filter) => filter.field !== 'status');
  }, [filtersValues, page]);

  const payloadData: FilterOptionsPayload = {
    filters: filtersOptionsPayload,
    field: 'status',
    search: '',
  };

  const queryOptions = useQueryOptions();

  const { data, isLoading, isError } = useDataSourceFilterOptionsDataQuery({
    payload: payloadData,
    page: page,
    queryOptions,
  });

  const statusValues: string[] = data?.values.filter(Boolean) ?? [];

  const resultantOptions = getDescendingOrderedOptions([], statusValues);

  if (isLoading) return <FilterOptionsShimmer />;
  if (isError) return <div className="p-4">No Status data</div>;
  if (!data) return null;
  return (
    <React.Fragment key={Status}>
      <CommonCheckboxesFilterContent
        filterState={filterState}
        handleClosePopover={handleClosePopover}
        keyValue={Status}
        checkboxOptions={resultantOptions || []}
        selectedOptions={filters[page].status}
        onSelectionChange={(value) => filters.setFilter(page, Status, value)}
      />
    </React.Fragment>
  );
};

export default StatusFilterContent;
