import { DataSourcePayload } from '@meaku/core/types/admin/api';
import { useFiltersContainerHeight } from '../../../hooks/useFiltersContainerHeight';
import { useEffect } from 'react';
import AllFiltersContainer from '../../../components/tableComp/AllFilters';
import { PaginationPageType } from '@meaku/core/types/admin/admin';
import { useDataSources } from '../../../context/DataSourcesContext';
import { SourcesCardTypes } from '../constants';
import ReembedBulkRowItemsButton from './ReembedBulkRowItemsButton';
import DeleteBulkRowItemsButton from './DeleteBulkRowItemsButton';

type IProps = {
  onFilterContainerHeightChange: (height: number) => void;
  payloadData: DataSourcePayload;
  page: PaginationPageType;
};

const DataSourceTableHeader = ({ onFilterContainerHeightChange, payloadData, page }: IProps) => {
  const { filtersRef, height } = useFiltersContainerHeight();
  const { selectedType } = useDataSources();

  // Notify parent component of height changes
  useEffect(() => {
    if (onFilterContainerHeightChange) {
      onFilterContainerHeightChange(height);
    }
  }, [height, onFilterContainerHeightChange]);
  return (
    <div
      ref={filtersRef}
      className="sticky top-0 z-20 flex w-full flex-1 content-end items-end justify-between self-stretch bg-white py-4"
    >
      <AllFiltersContainer page={page} payloadData={payloadData} />
      <div className="flex items-center justify-end gap-4">
        <ReembedBulkRowItemsButton selectedType={selectedType as SourcesCardTypes} />
        <DeleteBulkRowItemsButton selectedType={selectedType as SourcesCardTypes} />
      </div>
    </div>
  );
};

export default DataSourceTableHeader;
