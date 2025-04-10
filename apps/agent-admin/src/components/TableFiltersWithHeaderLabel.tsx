import { PageTypeProps } from '@meaku/core/types/admin/filters';
import AllFiltersContainer from './tableComp/AllFilters';
import SortFilter from './tableComp/SortFilter';
import { ConversationsPayload, LeadsPayload } from '@meaku/core/types/admin/api';
import TableFiltersWithHeaderLabelShimmer from './ShimmerComponent/TableFiltersWithHeaderLabelShimmer';
import { useFiltersContainerHeight } from '../hooks/useFiltersContainerHeight';
import { useEffect } from 'react';

type IProps = PageTypeProps & {
  disabledState?: boolean;
  isLoading: boolean;
  payloadData: ConversationsPayload | LeadsPayload;
  onFiltersContainerHeightChange?: (height: number) => void;
};

const TableFiltersWithHeaderLabel = ({
  page,
  disabledState,
  payloadData,
  isLoading,
  onFiltersContainerHeightChange,
}: IProps) => {
  const { filtersRef, height } = useFiltersContainerHeight();

  // Notify parent component of height changes
  useEffect(() => {
    if (onFiltersContainerHeightChange) {
      onFiltersContainerHeightChange(height);
    }
  }, [height, onFiltersContainerHeightChange]);

  if (isLoading) {
    return <TableFiltersWithHeaderLabelShimmer />;
  }
  return (
    <>
      <div
        ref={filtersRef}
        className="sticky top-0 z-[99] flex w-full items-start justify-between self-stretch bg-white py-4"
      >
        <AllFiltersContainer page={page} payloadData={payloadData} />
        <SortFilter page={page} key={page} disabledState={disabledState} />
      </div>
    </>
  );
};

export default TableFiltersWithHeaderLabel;
