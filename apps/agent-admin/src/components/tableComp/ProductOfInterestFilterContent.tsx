import { useMemo } from 'react';
import { useAllFilterStore } from '../../stores/useAllFilterStore';
import CommonCheckboxesFilterContent from './CommonCheckboxesFilterContent';
import { PageTypeProps } from '../../utils/admin-types';
import { FilterType } from '@meaku/core/types/admin/filters';
import { FilterOptionsPayload } from '@meaku/core/types/admin/api';
import { getAllFilterAppliedValues, getTenantFromLocalStorage } from '../../utils/common';
import useFilterOptionsDataQuery from '../../queries/query/useFilterOptionsDataQuery';
import { keepPreviousData } from '@tanstack/react-query';

const ProductOfInterestFilterContent = ({
  page,
  handleClosePopover,
}: PageTypeProps & { handleClosePopover: () => void }) => {
  const tenantName = getTenantFromLocalStorage();
  const filters = useAllFilterStore();
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
  // console.log("product of interest options data", data)
  if (!data) return null;
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>No Product data</div>;
  return (
    <CommonCheckboxesFilterContent
      keyValue={ProductOfInterest}
      checkboxOptions={
        data?.values.filter(Boolean).map((value) => ({
          value: value,
          label: value,
        })) || []
      }
      selectedOptions={filters[page].productOfInterest}
      onSelectionChange={(value) => filters.setFilter(page, ProductOfInterest, value)}
      handleClosePopover={handleClosePopover}
    />
  );
};

export default ProductOfInterestFilterContent;
