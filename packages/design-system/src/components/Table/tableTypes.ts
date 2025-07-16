import { CommonDataSourceResponse, PaginationPageType } from '@meaku/core/types/admin/admin';
import { DataSourceSortValues, SortCategory, SortOrder } from '@meaku/core/types/admin/sort';
import { Cell, Header, HeaderGroup, Row } from '@tanstack/react-table';

export type DataSourceStoreProps = {
  selectAll: () => void;
  deselectAll: () => void;
  getSelectedIds: () => number[];
  results: CommonDataSourceResponse[];
  pageType: PaginationPageType;
  setSortValue: (page: PaginationPageType, category: SortCategory, value: string | SortOrder) => void;
  sortValue: DataSourceSortValues;
};

export type CustomSingleHeaderRowItemProps = DataSourceStoreProps & {
  headerGroup: HeaderGroup<CommonDataSourceResponse>;
};

export type HeaderTitleProps = {
  header: Header<CommonDataSourceResponse, unknown>;
};

export type HeaderContentProps = DataSourceStoreProps & {
  isFirstColumn: boolean;
  header: Header<CommonDataSourceResponse, unknown>;
};

export type CustomSingleBodyRowItemProps = {
  row: Row<CommonDataSourceResponse>;
  isIdSelected: (id: number) => boolean;
  toggleSelectId: (id: number) => void;
  handleDataSourcesDrawerToggle: () => void;
  allowedToOpenDrawer: boolean;
};

export type RowCellContentProps = {
  isFirstColumn: boolean;
  cell: Cell<CommonDataSourceResponse, unknown>;
  isRowSelected: boolean;
  onToggleSelect: () => void;
};
