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
import NoDataFound from '@breakout/design-system/components/layout/NoDataFound';

interface TableContentProps {
  tableData: unknown[];
  isLoading: boolean;
  totalRecords: number;
  columnHeaderData: ColumnDefinition[];
  filterContainerHeight: number;
  pageType: PaginationPageType;
  showActionItems: boolean;
}

const DataSourceTableViewContent = memo(
  ({
    isLoading,
    totalRecords,
    tableData = [],
    columnHeaderData,
    filterContainerHeight,
    pageType,
    showActionItems,
  }: TableContentProps) => {
    const { toggleDataSourcesDrawer } = useDataSourcesDrawer();
    const { results } = useDataSourceTableStore();
    const { setSortValue } = useSortFilterStore();
    const { isSidebarOpen } = useSidebar();
    const sortValue = useSortFilterStore((state) => state[pageType] as DataSourceSortValues);
    const { selectAll, deselectAll, getSelectedIds, isIdSelected, toggleSelectId } = useTableSelection();

    if (isLoading) {
      return <TableViewShimmer columnCount={4} />;
    }

    if (!totalRecords) {
      const title = `No ${pageType} added`;
      const description = `It's empty here, Time to upload ${pageType}.`;
      return <NoDataFound title={title} description={description} className="min-h-[60vh]" />;
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
        showActionItems={showActionItems}
      />
    );
  },
);

DataSourceTableViewContent.displayName = 'DataSourceTableViewContent';

export default DataSourceTableViewContent;
