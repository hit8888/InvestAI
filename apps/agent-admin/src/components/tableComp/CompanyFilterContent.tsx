import React from 'react';
import CommonCheckboxesFilterContent from './CommonCheckboxesFilterContent';
import CrossIcon from '@breakout/design-system/components/icons/cross-icon';
import Input from '@breakout/design-system/components/layout/input';
import { FilterType, CommonFilterContentProps } from '@meaku/core/types/admin/filters';
import FilterOptionsShimmer from '../ShimmerComponent/FilterOptionsShimmer';
import { useFilterContent } from '../../hooks/useFilterContent';

const CompanyFilterContent = ({ page, filterState, handleClosePopover }: CommonFilterContentProps) => {
  const { Company } = FilterType;

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
  } = useFilterContent({
    page,
    field: 'company',
    enableSearch: true,
  });

  if (isLoading) return <FilterOptionsShimmer checkboxOrientation="right" />;
  if (isError || !resultantOptions.length)
    return <p className="p-4 text-center text-sm text-gray-500"> No Company data</p>;

  return (
    <React.Fragment key={Company}>
      <div className="px-4">
        <div className="flex">
          <Input
            className="rounded-lg border border-gray-300 bg-gray-50 px-4 py-3"
            onChange={handleInputChange}
            value={searchTerm}
            maxLength={20}
            placeholder="Enter Company Name..."
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
        keyValue={Company}
        checkboxOptions={resultantOptions}
        checkboxOrientation="right"
        selectedOptions={filters.company}
        onSelectionChange={(value) => setFilter(page, Company, value)}
      />
    </React.Fragment>
  );
};

export default CompanyFilterContent;
