import React from 'react';
import CommonCheckboxesFilterContent from './CommonCheckboxesFilterContent';
import CrossIcon from '@breakout/design-system/components/icons/cross-icon';
import Input from '@breakout/design-system/components/layout/input';
import { FilterType, CommonFilterContentProps } from '@meaku/core/types/admin/filters';
import FilterOptionsShimmer from '../ShimmerComponent/FilterOptionsShimmer';
import { useFilterContent } from '../../hooks/useFilterContent';

const LocationFilterContent = ({ page, filterState, handleClosePopover }: CommonFilterContentProps) => {
  const { Location } = FilterType;

  const {
    filters,
    setFilter,
    searchTerm,
    handleInputChange,
    clearSearchTerm,
    hasSearchTermLength,
    resultantOptions,
    isLoading,
    isError,
    data,
  } = useFilterContent({
    page,
    field: 'country',
    enableSearch: true,
  });

  if (isLoading) return <FilterOptionsShimmer checkboxOrientation="right" isFlagShimmer={true} />;
  if (isError) return <div>No Location data</div>;
  if (!data) return null;

  return (
    <React.Fragment key={Location}>
      <div className="px-4">
        <div className="flex">
          <Input
            className="w-full min-w-[300px] rounded-lg border border-gray-300 bg-gray-50 px-4 py-3"
            onChange={handleInputChange}
            value={searchTerm}
            maxLength={20}
            placeholder="Enter Country Name..."
          />
          {hasSearchTermLength ? (
            <button
              type="button"
              aria-label="clear button"
              className="relative right-8 top-1.5 flex h-6 w-6 cursor-pointer items-center justify-center"
              onClick={clearSearchTerm}
            >
              <CrossIcon width={'20'} height={'20'} className="text-primary" />
            </button>
          ) : null}
        </div>
      </div>
      <CommonCheckboxesFilterContent
        filterState={filterState}
        handleClosePopover={handleClosePopover}
        keyValue={Location}
        checkboxOptions={resultantOptions}
        checkboxOrientation="right"
        selectedOptions={filters.location}
        onSelectionChange={(value) => setFilter(page, Location, value)}
      />
    </React.Fragment>
  );
};

export default LocationFilterContent;
