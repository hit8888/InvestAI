import React from 'react';
import { ColumnDefinition } from '@meaku/core/types/admin/admin-table';
import TableViewShimmer from '../ShimmerComponent/TableViewShimmer';
import { useDataSourceTableStore } from '../../stores/useDataSourceTableStore';
import CommonTable from '@breakout/design-system/components/Table/CommonTable';
import { useSidebar } from '../../context/SidebarContext';
import { PaginationPageType } from '@meaku/core/types/admin/admin';
import { useSortFilterStore } from '../../stores/useSortFilterStore';
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

const DataSourceTableViewContent: React.FC<TableContentProps> = ({
  isLoading,
  totalRecords,
  tableData = [],
  columnHeaderData,
  filterContainerHeight,
  pageType,
}) => {
  const { selectAll, deselectAll, getSelectedIds, results, isIdSelected, toggleSelectId } = useDataSourceTableStore();
  const { setSortValue } = useSortFilterStore();
  const { isSidebarOpen } = useSidebar();

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
      isSidebarOpen={isSidebarOpen}
    />
  );
};

export default DataSourceTableViewContent;
