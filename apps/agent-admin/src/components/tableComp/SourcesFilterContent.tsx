import React, { useMemo } from 'react';
import CommonCheckboxesFilterContent from './CommonCheckboxesFilterContent';
import { FilterType, CommonFilterContentProps } from '@neuraltrade/core/types/admin/filters';
import FilterOptionsShimmer from '../ShimmerComponent/FilterOptionsShimmer';
import { useDataSourceFilterContent } from '../../hooks/useDataSourceFilterContent';

const SourcesFilterContent = ({ page, filterState, handleClosePopover }: CommonFilterContentProps) => {
  const { Sources } = FilterType;

  const { filters, setFilter, resultantOptions, isLoading, isError } = useDataSourceFilterContent({
    page,
    field: 'sources',
    filterPayload: 'page_type',
  });

  const transformedResultantOptions = useMemo(() => {
    return resultantOptions.map((option) => ({
      ...option,
      label: option.label.replace(/_/g, ' ').toLowerCase(),
    }));
  }, [resultantOptions]);

  if (isLoading) return <FilterOptionsShimmer />;
  if (isError || !transformedResultantOptions.length)
    return <p className="p-4 text-center text-sm text-gray-500"> No Sources data</p>;

  return (
    <React.Fragment key={Sources}>
      <CommonCheckboxesFilterContent
        filterState={filterState}
        handleClosePopover={handleClosePopover}
        keyValue={Sources}
        checkboxOptions={transformedResultantOptions}
        selectedOptions={filters.sources}
        onSelectionChange={(value) => setFilter(page, Sources, value)}
      />
    </React.Fragment>
  );
};

export default SourcesFilterContent;
