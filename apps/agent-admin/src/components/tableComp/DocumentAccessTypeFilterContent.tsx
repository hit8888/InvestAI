import React from 'react';
import CommonCheckboxesFilterContent from './CommonCheckboxesFilterContent';
import { FilterType, CommonFilterContentProps } from '@meaku/core/types/admin/filters';
import FilterOptionsShimmer from '../ShimmerComponent/FilterOptionsShimmer';
import { useDataSourceFilterContent } from '../../hooks/useDataSourceFilterContent';

const DocumentAccessTypeFilterContent = ({ page, filterState, handleClosePopover }: CommonFilterContentProps) => {
  const { DocumentAccessType } = FilterType;

  const { filters, setFilter, resultantOptions, isLoading, isError } = useDataSourceFilterContent({
    page,
    field: 'documentAccessType',
    filterPayload: 'access_type',
  });

  if (isLoading) return <FilterOptionsShimmer />;
  if (isError || !resultantOptions.length)
    return <p className="p-4 text-center text-sm text-gray-500"> No Document Access Type data</p>;

  return (
    <React.Fragment key={DocumentAccessType}>
      <CommonCheckboxesFilterContent
        filterState={filterState}
        handleClosePopover={handleClosePopover}
        keyValue={DocumentAccessType}
        checkboxOptions={resultantOptions}
        selectedOptions={filters.documentAccessType}
        onSelectionChange={(value) => setFilter(page, DocumentAccessType, value)}
      />
    </React.Fragment>
  );
};

export default DocumentAccessTypeFilterContent;
