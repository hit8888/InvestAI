import { useEffect, useMemo, useState } from 'react';

import { useDebouncedValue } from '@meaku/core/hooks/useDebouncedValue';
import { useFormattedColumns } from '../../../hooks/useFormattedColumns';
import { usePagination } from '../../../hooks/usePagination.tsx';

import TableDataManager from '../../../managers/TableDataManager';
import TablePagination from '../../../components/tableComp/TablePagination';
import TableFiltersWithHeaderLabel from '../../../components/TableFiltersWithHeaderLabel.tsx';

import { PAGINATION_PER_PAGE_OPTIONS_FOR_VISITORS_TABLE } from '../../../utils/constants';
import {
  collectAppliedFilters,
  getAllFilterAppliedValues,
  getFormattedColumnsList,
  getMappedDataFromResponseForVisitorsTableView,
  getSortingAppliedValues,
} from '../../../utils/common';
import { getCompanyLogoSrc } from '@meaku/core/utils/index';

import { ColumnDefinition } from '@meaku/core/types/admin/admin-table';
import { VisitorsPayload } from '@meaku/core/types/admin/api';
import { VisitorsTableDisplayContent, VisitorsTableViewContent } from '@meaku/core/types/admin/admin';
import type { CompanyData } from './CompanyDetailsDrawer/types.ts';
import { mapVisitorToCompanyData } from '../utils/mapVisitorToCompanyData';
import { useSortFilterStore } from '../../../stores/useSortFilterStore.ts';
import { useAllFilterStore } from '../../../stores/useAllFilterStore.ts';
import { VISITORS_PAGE } from '@meaku/core/utils/index';
import { useTableStore } from '../../../stores/useTableStore.ts';
import { useQueryOptions } from '../../../hooks/useQueryOptions.ts';
import { useInitializeFilterPreferences } from '../../../hooks/useInitializeFilterPreferences.tsx';
import { useEntityMetadata } from '../../../context/EntityMetadataContext.tsx';
import ErrorState from '@breakout/design-system/components/layout/ErrorState';
import useVisitorsTableQuery from '../../../queries/query/useVisitorsTableQuery.tsx';
import TableViewShimmer from '../../../components/ShimmerComponent/TableViewShimmer.tsx';
import CommonTable from '@breakout/design-system/components/Table/CommonTable';
import NoDataFound from '@breakout/design-system/components/layout/NoDataFound';
import { useSidebar } from '../../../context/SidebarContext.tsx';
import { SortValues } from '@meaku/core/types/admin/sort';
import { Cell, HeaderGroup, Row } from '@tanstack/react-table';
import TableBodyRowItemHavingLogo from '@breakout/design-system/components/Table/TableBodyRowItemHavingLogo';
import CustomSingleHeaderRowItem from '@breakout/design-system/components/Table/CustomSingleHeaderRowItem';
import AssignedRepCellValue from '../../../components/tableComp/tableCellComp/AssignedRepCellValue.tsx';

type VisitorsTableContainerProps = {
  onCompanySelect?: (companyData: CompanyData) => void;
};

const VisitorsTableContainer = ({ onCompanySelect }: VisitorsTableContainerProps) => {
  const { entityMetadataColumnList, entityMetadataHeaderMapping, entityMetadataRelatedEntities } = useEntityMetadata();
  const { isSidebarOpen } = useSidebar();
  const { setSortValue } = useSortFilterStore();
  const sortValue = useSortFilterStore((state) => state[VISITORS_PAGE] as SortValues);
  const { currentPage, itemsPerPage, handlePageChange, handleItemsPerPageChange } = usePagination({
    pageType: VISITORS_PAGE,
  });

  useInitializeFilterPreferences(VISITORS_PAGE);

  const sortState = useSortFilterStore((state) => state.prospects);
  const filterState = useAllFilterStore((state) => state.prospects);

  const [filterContainerHeight, setFilterContainerHeight] = useState(0);

  // Reset to page 1 when filters changes
  useEffect(() => {
    const appliedFilters = collectAppliedFilters(filterState);
    if (!appliedFilters.length) {
      return;
    } else {
      handlePageChange(1);
    }
    if (!appliedFilters.length && currentPage !== 1) {
      handlePageChange(1);
    }
  }, [filterState]);

  const allAppliedFilterValues = useMemo(() => {
    return getAllFilterAppliedValues(filterState, VISITORS_PAGE);
  }, [filterState]);

  const payloadData: VisitorsPayload = useMemo(() => {
    return {
      filters: allAppliedFilterValues,
      sort: getSortingAppliedValues(sortState, VISITORS_PAGE),
      page: currentPage,
      page_size: itemsPerPage,
      search: filterState.searchTableContent,
    };
  }, [allAppliedFilterValues, sortState, currentPage, itemsPerPage, filterState.searchTableContent]);

  // Use debounced payload to prevent excessive API calls
  const debouncedPayloadData = useDebouncedValue(payloadData);
  const queryOptions = useQueryOptions();

  const { data, isLoading, isError } = useVisitorsTableQuery({
    payload: debouncedPayloadData,
    queryOptions,
  });

  const { setTableData, error: tableError } = useTableStore();

  // When data changes, update the store
  useEffect(() => {
    if (data) {
      setTableData(data);
    }
  }, [data, setTableData]);

  const tableManager = useMemo(() => {
    if (!data) return null;

    return new TableDataManager(data);
  }, [data]);

  const visitorsData: VisitorsTableDisplayContent[] = (tableManager?.getTableDataResults() ?? []).map((item) =>
    getMappedDataFromResponseForVisitorsTableView(item as VisitorsTableViewContent),
  );
  const paginatedData = tableManager?.getPaginatedTableData() ?? { total_records: 0, total_pages: 1, page_size: 0 };
  const { page_size: pageSize, total_records: totalRecords, total_pages: totalPages } = paginatedData;

  const visitorsPageColumns: ColumnDefinition[] = getFormattedColumnsList(
    entityMetadataColumnList,
    entityMetadataHeaderMapping,
  );
  const resultantVisitorsColumns = useFormattedColumns(visitorsPageColumns);

  const haveNoRecords = totalRecords === 0;

  const handleRowItemClick = (rowData: unknown) => {
    const visitorDetails = (rowData ?? {}) as VisitorsTableDisplayContent;

    const companyData = mapVisitorToCompanyData(visitorDetails);
    onCompanySelect?.(companyData);
  };

  // Define custom cell renderers for specific columns
  const customCellRenderers = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sdr_assignment: (cell: Cell<any, any>) => {
      return <AssignedRepCellValue value={cell.getContext().getValue()} />;
    },
  };

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const renderRowItem = (row: Row<any>) => {
    const logoSrc = row.original.website_url ? getCompanyLogoSrc(row.original.website_url) : '';

    return (
      <TableBodyRowItemHavingLogo
        customCellRenderers={customCellRenderers}
        logo={{ company: { src: logoSrc, placeholderText: row.original.company } }}
        row={row}
        handleRowItemClick={handleRowItemClick}
        relatedEntities={entityMetadataRelatedEntities}
        columnClassNames={{
          website_url: 'text-blue_sec-1000',
          revenue: 'max-w-[140px]',
          employee_count: 'max-w-[150px]',
        }}
      />
    );
  };

  const renderHeaderItem = (headerGroup: HeaderGroup<any>) => {
    return (
      <CustomSingleHeaderRowItem
        pageType={VISITORS_PAGE}
        setSortValue={setSortValue}
        sortValue={sortValue as SortValues}
        key={headerGroup.id}
        headerGroup={headerGroup}
        columnClassNames={{
          revenue: 'max-w-[140px]',
          employee_count: 'max-w-[150px]',
        }}
      />
    );
  };

  const renderTableContent = () => {
    if (isLoading) {
      return <TableViewShimmer />;
    }

    if (!totalRecords && filterState.searchTableContent) {
      return (
        <div className="flex w-full items-center justify-center gap-2 p-10 text-2xl font-medium text-gray-500">
          <span>No results found for </span>
          <span className="text-primary">"{filterState.searchTableContent}"</span>
          <span>- Try adjusting your search terms</span>
        </div>
      );
    }

    if (!totalRecords) {
      return (
        <NoDataFound
          className="min-h-[60vh]"
          title="No visitors yet"
          description="No visitors yet, Time to get more visitors."
        />
      );
    }

    return (
      <CommonTable
        pageType={VISITORS_PAGE}
        tabularData={visitorsData}
        columnHeaderData={resultantVisitorsColumns as ColumnDefinition[]}
        filterContainerHeight={filterContainerHeight}
        onRowItemClick={handleRowItemClick}
        isSidebarOpen={isSidebarOpen}
        setSortValue={setSortValue}
        sortValue={sortValue}
        renderRowItem={renderRowItem}
        renderHeaderItem={renderHeaderItem}
      />
    );
  };

  if (isError || tableError) {
    return <ErrorState />;
  }

  return (
    <div className="flex w-full flex-1 flex-col items-start gap-2 self-stretch">
      <div className="flex flex-1 flex-col items-start self-stretch">
        <TableFiltersWithHeaderLabel
          isLoading={isLoading}
          payloadData={debouncedPayloadData}
          disabledState={haveNoRecords}
          key={VISITORS_PAGE}
          page={VISITORS_PAGE}
          onFiltersContainerHeightChange={setFilterContainerHeight}
        />
        {renderTableContent()}
      </div>
      <TablePagination
        isLoading={isLoading}
        tableType={VISITORS_PAGE}
        paginationPerPageOptions={PAGINATION_PER_PAGE_OPTIONS_FOR_VISITORS_TABLE}
        totalPages={totalPages}
        totalItems={pageSize === 0 ? pageSize : totalRecords}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={handleItemsPerPageChange}
        handlePageChange={handlePageChange}
        currentPage={currentPage}
      />
    </div>
  );
};

export default VisitorsTableContainer;
export type { VisitorsTableContainerProps };
