import React from 'react';
import CommonCheckboxesFilterContent from './CommonCheckboxesFilterContent';
import { FilterType, CommonFilterContentProps } from '@neuraltrade/core/types/admin/filters';
import FilterOptionsShimmer from '../ShimmerComponent/FilterOptionsShimmer';
import { useDataSourceFilterContent } from '../../hooks/useDataSourceFilterContent';

const FileTypeFilterContent = ({ page, filterState, handleClosePopover }: CommonFilterContentProps) => {
  const { FileType } = FilterType;

  const { filters, setFilter, resultantOptions, isLoading, isError } = useDataSourceFilterContent({
    page,
    field: 'fileType',
    filterPayload: 'data_source_type',
  });

  if (isLoading) return <FilterOptionsShimmer />;
  if (isError || !resultantOptions.length)
    return <p className="p-4 text-center text-sm text-gray-500"> No File Type data</p>;

  return (
    <React.Fragment key={FileType}>
      <CommonCheckboxesFilterContent
        filterState={filterState}
        handleClosePopover={handleClosePopover}
        keyValue={FileType}
        checkboxOptions={resultantOptions}
        selectedOptions={filters.fileType}
        onSelectionChange={(value) => setFilter(page, FileType, value)}
      />
    </React.Fragment>
  );
};

export default FileTypeFilterContent;
