import { memo } from 'react';
import { ColumnDefinition } from '@meaku/core/types/admin/admin-table';
import TableViewShimmer from '../ShimmerComponent/TableViewShimmer';
import { useDataSourceTableStore, useTableSelection } from '../../stores/useDataSourceTableStore';
import CommonTable from '@breakout/design-system/components/Table/CommonTable';
import { useSidebar } from '../../context/SidebarContext';
import { PaginationPageType } from '@meaku/core/types/admin/admin';
import { useSortFilterStore } from '../../stores/useSortFilterStore';
import { DataSourceSortValues } from '@meaku/core/types/admin/sort';
import { useDataSourcesDrawer } from '../../context/DataSourcesDrawerContext';

interface TableContentProps {
  tableData: unknown[];
  isLoading: boolean;
  totalRecords: number;
  columnHeaderData: ColumnDefinition[];
  filterContainerHeight: number;
  pageType: PaginationPageType;
}

const DEFAULT_LOADING_ROW_COUNT = 10;
const DEFAULT_LOADING_COLUMNS_COUNT = 4;

const DataSourceTableViewContent = memo(
  ({
    isLoading,
    totalRecords,
    tableData = [],
    columnHeaderData,
    filterContainerHeight,
    pageType,
  }: TableContentProps) => {
    const { toggleDataSourcesDrawer } = useDataSourcesDrawer();
    const { results } = useDataSourceTableStore();
    const { setSortValue } = useSortFilterStore();
    const { isSidebarOpen } = useSidebar();
    const sortValue = useSortFilterStore((state) => state[pageType] as DataSourceSortValues);
    const { selectAll, deselectAll, getSelectedIds, isIdSelected, toggleSelectId } = useTableSelection();

    if (isLoading) {
      return <TableViewShimmer columnCount={DEFAULT_LOADING_COLUMNS_COUNT} rowCount={DEFAULT_LOADING_ROW_COUNT} />;
    }

    if (!totalRecords) {
      return <p className="w-full text-center text-2xl font-semibold text-gray-900">{`No ${pageType} added`}</p>;
    }

    return (
      <CommonTable
        key={pageType}
        tabularData={tableData}
        columnHeaderData={columnHeaderData}
        filterContainerHeight={filterContainerHeight}
        pageType={pageType}
        selectAll={selectAll}
        deselectAll={deselectAll}
        getSelectedIds={getSelectedIds}
        isIdSelected={isIdSelected}
        toggleSelectId={toggleSelectId}
        results={results}
        setSortValue={setSortValue}
        sortValue={sortValue}
        isSidebarOpen={isSidebarOpen}
        toggleDataSourcesDrawer={toggleDataSourcesDrawer}
      />
    );
  },
);

DataSourceTableViewContent.displayName = 'DataSourceTableViewContent';

export default DataSourceTableViewContent;
