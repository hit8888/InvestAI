import { useMemo } from 'react';
import { useAllFilterStore } from '../../stores/useAllFilterStore';
import CommonCheckboxesFilterContent from './CommonCheckboxesFilterContent';
import { CommonFilterContentProps, FilterType } from '@meaku/core/types/admin/filters';
import { FilterOptionsPayload } from '@meaku/core/types/admin/api';
import { getAllFilterAppliedValues, getDescendingOrderedOptions } from '../../utils/common';
import useFilterOptionsDataQuery from '../../queries/query/useFilterOptionsDataQuery';
import { useTableStore } from '../../stores/useTableStore';
import { useQueryOptions } from '../../hooks/useQueryOptions';
import { useDebouncedValue } from '@meaku/core/hooks/useDebouncedValue';
import FilterOptionsShimmer from '../ShimmerComponent/FilterOptionsShimmer';

const ProductOfInterestFilterContent = ({ page, filterState, handleClosePopover }: CommonFilterContentProps) => {
  const filters = useAllFilterStore();
  const tableManager = useTableStore((state) => state.tableManager);
  const { ProductOfInterest } = FilterType;

  const filtersOptionsPayload = useMemo(() => {
    return getAllFilterAppliedValues(filters[page], page).filter((filter) => filter.field !== 'product_of_interest');
  }, [filters[page], page]);

  const payloadData: FilterOptionsPayload = {
    filters: filtersOptionsPayload,
    field: 'product_of_interest',
    search: '',
  };

  // Use debounced payload to prevent excessive API calls
  const debouncedPayloadData = useDebouncedValue(payloadData);
  const queryOptions = useQueryOptions();

  const { data, isLoading, isError } = useFilterOptionsDataQuery({
    payload: debouncedPayloadData,
    page: page,
    queryOptions,
  });

  const sortedProductOfInterest: string[] = tableManager?.getSortedItemsByKey('product_of_interest') ?? [];
  const productOfInterestValues: string[] = data?.values.filter(Boolean) ?? [];

  const resultantOptions = getDescendingOrderedOptions(sortedProductOfInterest, productOfInterestValues);
  // console.log("product of interest options data", data)
  if (isLoading)
    return <FilterOptionsShimmer checkboxOrientation="left" isSearchInputShimmer={false} isSelectAllShimmer={false} />;
  if (isError) return <div>No Product data</div>;
  if (!data) return null;
  return (
    <CommonCheckboxesFilterContent
      filterState={filterState}
      keyValue={ProductOfInterest}
      checkboxOptions={resultantOptions ?? []}
      selectedOptions={filters[page].productOfInterest}
      onSelectionChange={(value) => filters.setFilter(page, ProductOfInterest, value)}
      handleClosePopover={handleClosePopover}
    />
  );
};

export default ProductOfInterestFilterContent;
