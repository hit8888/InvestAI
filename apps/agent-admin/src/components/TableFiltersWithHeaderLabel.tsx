import { PageTypeProps } from '@meaku/core/types/admin/filters';
import AllFiltersContainer from './tableComp/AllFilters';
import SortFilter from './tableComp/SortFilter';

type IProps = PageTypeProps & {
  disabledState?: boolean;
};

const TableFiltersWithHeaderLabel = ({ page, disabledState }: IProps) => {
  return (
    <>
      {/* <p className="flex-1 text-2xl font-semibold text-gray-900">Table of conversations</p> */}
      <div className="sticky top-0 z-[99] flex w-full items-start justify-between self-stretch bg-white py-4">
        <AllFiltersContainer page={page} />
        <SortFilter page={page} key={page} disabledState={disabledState} />
      </div>
    </>
  );
};

export default TableFiltersWithHeaderLabel;
