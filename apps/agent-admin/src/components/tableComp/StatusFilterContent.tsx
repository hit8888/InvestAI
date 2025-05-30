import React from 'react';
import CommonCheckboxesFilterContent from './CommonCheckboxesFilterContent';
import { FilterType, CommonFilterContentProps } from '@meaku/core/types/admin/filters';
import FilterOptionsShimmer from '../ShimmerComponent/FilterOptionsShimmer';
import { useDataSourceFilterContent } from '../../hooks/useDataSourceFilterContent';

const StatusFilterContent = ({ page, filterState, handleClosePopover }: CommonFilterContentProps) => {
  const { Status } = FilterType;

  const { filters, setFilter, resultantOptions, isLoading, isError, data } = useDataSourceFilterContent({
    page,
    field: 'status',
  });

  if (isLoading) return <FilterOptionsShimmer />;
  if (isError) return <div className="p-4">No Status data</div>;
  if (!data) return null;

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
