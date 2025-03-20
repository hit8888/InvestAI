import { PageTypeProps } from '@meaku/core/types/admin/filters';
import AllFiltersContainer from './tableComp/AllFilters';
import SortFilter from './tableComp/SortFilter';
import { ConversationsPayload, LeadsPayload } from '@meaku/core/types/admin/api';
import TableFiltersWithHeaderLabelShimmer from './ShimmerComponent/TableFiltersWithHeaderLabelShimmer';

type IProps = PageTypeProps & {
  disabledState?: boolean;
  isLoading: boolean;
  payloadData: ConversationsPayload | LeadsPayload;
};

const TableFiltersWithHeaderLabel = ({ page, disabledState, payloadData, isLoading }: IProps) => {
  if (isLoading) {
    return <TableFiltersWithHeaderLabelShimmer />;
  }
  return (
    <>
      <div className="sticky top-0 z-[99] flex w-full items-start justify-between self-stretch bg-white py-4">
        <AllFiltersContainer page={page} payloadData={payloadData} />
        <SortFilter page={page} key={page} disabledState={disabledState} />
      </div>
    </>
  );
};

export default TableFiltersWithHeaderLabel;
