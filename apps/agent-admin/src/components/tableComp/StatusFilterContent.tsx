import React from 'react';
import CommonCheckboxesFilterContent from './CommonCheckboxesFilterContent';
import { FilterType, CommonFilterContentProps } from '@neuraltrade/core/types/admin/filters';
import FilterOptionsShimmer from '../ShimmerComponent/FilterOptionsShimmer';
import { useDataSourceFilterContent } from '../../hooks/useDataSourceFilterContent';

const StatusFilterContent = ({ page, filterState, handleClosePopover }: CommonFilterContentProps) => {
  const { Status } = FilterType;

  const { filters, setFilter, resultantOptions, isLoading, isError } = useDataSourceFilterContent({
    page,
    field: 'status',
  });

  if (isLoading) return <FilterOptionsShimmer />;
  if (isError || !resultantOptions.length)
    return <p className="p-4 text-center text-sm text-gray-500"> No Status data</p>;

  return (
    <React.Fragment key={Status}>
      <CommonCheckboxesFilterContent
        filterState={filterState}
        handleClosePopover={handleClosePopover}
        keyValue={Status}
        checkboxOptions={resultantOptions}
        selectedOptions={filters.status}
        onSelectionChange={(value) => setFilter(page, Status, value)}
      />
    </React.Fragment>
  );
};

export default StatusFilterContent;
