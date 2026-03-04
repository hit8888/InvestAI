import CommonCheckboxesFilterContent from './CommonCheckboxesFilterContent';
import { CommonFilterContentProps, FilterType } from '@neuraltrade/core/types/admin/filters';
import FilterOptionsShimmer from '../ShimmerComponent/FilterOptionsShimmer';
import { useFilterContent } from '../../hooks/useFilterContent';

const ProductOfInterestFilterContent = ({ page, filterState, handleClosePopover }: CommonFilterContentProps) => {
  const { ProductOfInterest, ProductInterest } = FilterType;

  const isProductOfInterest = filterState === ProductOfInterest;

  const { filters, setFilter, resultantOptions, isLoading, isError } = useFilterContent({
    page,
    field: isProductOfInterest ? 'product_of_interest' : 'product_interest',
    enableSearch: false,
  });

  if (isLoading)
    return <FilterOptionsShimmer checkboxOrientation="left" isSearchInputShimmer={false} isSelectAllShimmer={false} />;
  if (isError || !resultantOptions.length)
    return <p className="p-4 text-center text-sm text-gray-500"> No Product data</p>;

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
