import { useFiltersContainerHeight } from '../../../hooks/useFiltersContainerHeight';
import { useEffect } from 'react';
import AllFiltersContainer from '../../../components/tableComp/AllFilters';
import { PaginationPageType } from '@neuraltrade/core/types/admin/admin';
import { useDataSources } from '../../../context/DataSourcesContext';
import { SourcesCardTypes } from '../constants';
import ReembedBulkRowItemsButton from './ReembedBulkRowItemsButton';
import DeleteBulkRowItemsButton from './DeleteBulkRowItemsButton';
import { Skeleton } from '@breakout/design-system/components/shadcn-ui/skeleton';
import EditBulkRowItemsButton from './EditBulkRowItemsButton';
import { TOP_HEADER_CONTAINER_HEIGHT_WITH_PADDING } from '../../../utils/constants';

type IProps = {
  onFilterContainerHeightChange: (height: number) => void;
  page: PaginationPageType;
  isLoading: boolean;
  totalRecords: number;
  areFiltersApplied: boolean;
};

const DataSourceTableHeader = ({
  onFilterContainerHeightChange,
  page,
  isLoading,
  totalRecords,
  areFiltersApplied,
}: IProps) => {
  const { filtersRef, height } = useFiltersContainerHeight();
  const { selectedType } = useDataSources();

  // Notify parent component of height changes
  useEffect(() => {
    if (onFilterContainerHeightChange) {
      onFilterContainerHeightChange(height + TOP_HEADER_CONTAINER_HEIGHT_WITH_PADDING);
    }
  }, [height, onFilterContainerHeightChange]);

  if (isLoading) {
    return <DataSourceTableHeaderShimmer />;
  }

  if (!totalRecords && !areFiltersApplied) {
    return null;
  }

  return (
    <div
      ref={filtersRef}
      className="sticky z-20 flex w-full flex-1 content-end items-end justify-between self-stretch bg-white py-4"
      style={{ top: `${TOP_HEADER_CONTAINER_HEIGHT_WITH_PADDING}px` }}
    >
      <AllFiltersContainer page={page} />
      <div className="flex items-center justify-end gap-4">
        <EditBulkRowItemsButton selectedType={selectedType as SourcesCardTypes} />
        <ReembedBulkRowItemsButton selectedType={selectedType as SourcesCardTypes} />
        <DeleteBulkRowItemsButton selectedType={selectedType as SourcesCardTypes} />
      </div>
    </div>
  );
};

const DataSourceTableHeaderShimmer = () => {
  return (
    <div className="sticky top-0 z-20 flex w-full flex-1 content-end items-end justify-between self-stretch bg-white py-4">
      <div className="flex flex-1 items-center gap-4">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="flex items-center justify-end gap-4">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
};

export default DataSourceTableHeader;
