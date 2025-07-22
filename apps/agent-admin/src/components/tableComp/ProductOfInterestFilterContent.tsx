import CommonCheckboxesFilterContent from './CommonCheckboxesFilterContent';
import { CommonFilterContentProps, FilterType } from '@meaku/core/types/admin/filters';
import FilterOptionsShimmer from '../ShimmerComponent/FilterOptionsShimmer';
import { useFilterContent } from '../../hooks/useFilterContent';

const ProductOfInterestFilterContent = ({ page, filterState, handleClosePopover }: CommonFilterContentProps) => {
  const { ProductOfInterest, ProductInterest } = FilterType;

  const isProductOfInterest = filterState === ProductOfInterest;

  const { filters, setFilter, resultantOptions, isLoading, isError, data } = useFilterContent({
    page,
    field: isProductOfInterest ? 'product_of_interest' : 'product_interest',
    enableSearch: false,
  });

  if (isLoading)
    return <FilterOptionsShimmer checkboxOrientation="left" isSearchInputShimmer={false} isSelectAllShimmer={false} />;
  if (isError) return <div>No Product data</div>;
  if (!data) return null;

  return (
    <CommonCheckboxesFilterContent
      filterState={filterState}
      keyValue={isProductOfInterest ? ProductOfInterest : ProductInterest}
      checkboxOptions={resultantOptions ?? []}
      selectedOptions={isProductOfInterest ? filters.productOfInterest : filters.productInterest}
      onSelectionChange={(value) => setFilter(page, isProductOfInterest ? ProductOfInterest : ProductInterest, value)}
      handleClosePopover={handleClosePopover}
    />
  );
};

export default ProductOfInterestFilterContent;
