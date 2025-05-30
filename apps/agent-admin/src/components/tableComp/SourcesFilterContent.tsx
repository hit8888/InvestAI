import React from 'react';
import CommonCheckboxesFilterContent from './CommonCheckboxesFilterContent';
import { FilterType, CommonFilterContentProps } from '@meaku/core/types/admin/filters';
import FilterOptionsShimmer from '../ShimmerComponent/FilterOptionsShimmer';
import { useDataSourceFilterContent } from '../../hooks/useDataSourceFilterContent';

const SourcesFilterContent = ({ page, filterState, handleClosePopover }: CommonFilterContentProps) => {
  const { Sources } = FilterType;

  const { filters, setFilter, resultantOptions, isLoading, isError, data } = useDataSourceFilterContent({
    page,
    field: 'sources',
    filterPayload: 'data_source_type',
  });

  if (isLoading) return <FilterOptionsShimmer />;
  if (isError) return <div className="p-4">No Sources data</div>;
  if (!data) return null;

  return (
    <React.Fragment key={Sources}>
      <CommonCheckboxesFilterContent
        filterState={filterState}
        handleClosePopover={handleClosePopover}
        keyValue={Sources}
        checkboxOptions={resultantOptions}
        selectedOptions={filters.sources}
        onSelectionChange={(value) => setFilter(page, Sources, value)}
      />
    </React.Fragment>
  );
};

export default SourcesFilterContent;
