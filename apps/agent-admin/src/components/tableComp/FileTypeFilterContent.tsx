import React from 'react';
import CommonCheckboxesFilterContent from './CommonCheckboxesFilterContent';
import { FilterType, CommonFilterContentProps } from '@meaku/core/types/admin/filters';
import FilterOptionsShimmer from '../ShimmerComponent/FilterOptionsShimmer';
import { useDataSourceFilterContent } from '../../hooks/useDataSourceFilterContent';

const FileTypeFilterContent = ({ page, filterState, handleClosePopover }: CommonFilterContentProps) => {
  const { FileType } = FilterType;

  const { filters, setFilter, resultantOptions, isLoading, isError, data } = useDataSourceFilterContent({
    page,
    field: 'fileType',
    filterPayload: 'data_source_type',
  });

  if (isLoading) return <FilterOptionsShimmer />;
  if (isError) return <div className="p-4">No File Type data</div>;
  if (!data) return null;

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
