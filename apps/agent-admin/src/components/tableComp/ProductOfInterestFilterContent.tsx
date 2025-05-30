import CommonCheckboxesFilterContent from './CommonCheckboxesFilterContent';
import { CommonFilterContentProps, FilterType } from '@meaku/core/types/admin/filters';
import FilterOptionsShimmer from '../ShimmerComponent/FilterOptionsShimmer';
import { useFilterContent } from '../../hooks/useFilterContent';

const ProductOfInterestFilterContent = ({ page, filterState, handleClosePopover }: CommonFilterContentProps) => {
  const { ProductOfInterest } = FilterType;

  const { filters, setFilter, resultantOptions, isLoading, isError, data } = useFilterContent({
    page,
    field: 'product_of_interest',
    enableSearch: false,
  });

  if (isLoading)
    return <FilterOptionsShimmer checkboxOrientation="left" isSearchInputShimmer={false} isSelectAllShimmer={false} />;
  if (isError) return <div>No Product data</div>;
  if (!data) return null;

  return (
    <CommonCheckboxesFilterContent
      filterState={filterState}
      keyValue={ProductOfInterest}
      checkboxOptions={resultantOptions ?? []}
      selectedOptions={filters.productOfInterest}
      onSelectionChange={(value) => setFilter(page, ProductOfInterest, value)}
      handleClosePopover={handleClosePopover}
    />
  );
};

export default ProductOfInterestFilterContent;
