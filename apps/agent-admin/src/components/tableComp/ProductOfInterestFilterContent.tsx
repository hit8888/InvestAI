import { useMemo } from 'react';
import { useAllFilterStore } from '../../stores/useAllFilterStore';
import CommonCheckboxesFilterContent from './CommonCheckboxesFilterContent';
import { CommonFilterContentProps, FilterType } from '@meaku/core/types/admin/filters';
import { FilterOptionsPayload } from '@meaku/core/types/admin/api';
import { getAllFilterAppliedValues, getDescendingOrderedOptions, getTenantFromLocalStorage } from '../../utils/common';
import useFilterOptionsDataQuery from '../../queries/query/useFilterOptionsDataQuery';
import { keepPreviousData } from '@tanstack/react-query';
import { useTableStore } from '../../stores/useTableStore';

const ProductOfInterestFilterContent = ({ page, filterState, handleClosePopover }: CommonFilterContentProps) => {
  const tenantName = getTenantFromLocalStorage();
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

  const { data, isLoading, isError } = useFilterOptionsDataQuery({
    payload: payloadData,
    tenantName: tenantName || '',
    page: page,
    queryOptions: {
      enabled: !!tenantName,
      placeholderData: keepPreviousData,
    },
  });

  const sortedProductOfInterest: string[] = tableManager?.getSortedItemsByKey('product_of_interest') ?? [];
  const productOfInterestValues: string[] = data?.values.filter(Boolean) ?? [];

  const resultantOptions = getDescendingOrderedOptions(sortedProductOfInterest, productOfInterestValues);
  // console.log("product of interest options data", data)
  if (!data) return null;
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>No Product data</div>;
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
