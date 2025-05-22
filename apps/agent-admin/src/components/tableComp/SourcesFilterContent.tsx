import React, { useMemo } from 'react';
import { useAllFilterStore } from '../../stores/useAllFilterStore';
import CommonCheckboxesFilterContent from './CommonCheckboxesFilterContent';
import { FilterType, CommonFilterContentProps } from '@meaku/core/types/admin/filters';
import { FilterOptionsPayload } from '@meaku/core/types/admin/api';
import { getAllFilterAppliedValues, getDescendingOrderedOptions } from '../../utils/common';
import { useQueryOptions } from '../../hooks/useQueryOptions';
import FilterOptionsShimmer from '../ShimmerComponent/FilterOptionsShimmer';
import useDataSourceFilterOptionsDataQuery from '../../queries/query/useDataSourceFilterOptionsDataQuery';

const SourcesFilterContent = ({ page, filterState, handleClosePopover }: CommonFilterContentProps) => {
  const filters = useAllFilterStore();
  const filtersValues = filters[page];
  const { Sources } = FilterType;

  const filtersOptionsPayload = useMemo(() => {
    return getAllFilterAppliedValues(filtersValues, page).filter((filter) => filter.field !== 'sources');
  }, [filtersValues, page]);

  const payloadData: FilterOptionsPayload = {
    filters: filtersOptionsPayload,
    field: 'data_source_name',
    search: '',
  };

  const queryOptions = useQueryOptions();

  const { data, isLoading, isError } = useDataSourceFilterOptionsDataQuery({
    payload: payloadData,
    page: page,
    queryOptions,
  });

  const sourceValues: string[] = data?.values.filter(Boolean) ?? [];

  const resultantOptions = getDescendingOrderedOptions([], sourceValues);

  if (isLoading) return <FilterOptionsShimmer checkboxOrientation="right" />;
  if (isError) return <div className="p-4">No Sources data</div>;
  if (!data) return null;
  return (
    <React.Fragment key={Sources}>
      <CommonCheckboxesFilterContent
        filterState={filterState}
        handleClosePopover={handleClosePopover}
        keyValue={Sources}
        checkboxOptions={resultantOptions || []}
        checkboxOrientation="right"
        selectedOptions={filters[page].sources}
        onSelectionChange={(value) => filters.setFilter(page, Sources, value)}
      />
    </React.Fragment>
  );
};

export default SourcesFilterContent;
