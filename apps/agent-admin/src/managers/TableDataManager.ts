import { TableDataSchema } from '@meaku/core/types/admin/admin-table';
import {
  TableDataResponse,
  LeadsTableViewContent,
  ConversationsTableViewContent,
  PaginationData,
} from '@meaku/core/types/admin/admin';
import { PaginationDataSchema } from '@meaku/core/types/admin/api';

class TableDataManager {
  private tableData: TableDataResponse;

  constructor(tableData: TableDataResponse) {
    const validatedTableData = this.validateTableData(tableData);
    this.tableData = validatedTableData;
  }

  private validateTableData(tableData: TableDataResponse) {
    const validatedTableData = TableDataSchema.safeParse(tableData);

    if (!validatedTableData.success) {
      // console.error("Validation failed for TableDataManager:", {
      //   input: tableData,
      //   errors: validatedTableData.error.format(),
      // });
      throw new Error(validatedTableData.error.errors.map((error) => error.message).join(', '));
    }

    return validatedTableData.data;
  }

  getTableDataResults() {
    return this.tableData.results.filter(
      (item): item is LeadsTableViewContent | (ConversationsTableViewContent & { is_test?: false }) =>
        !('is_test' in item) || item.is_test === false,
    );
  }

  getSortedItemsByKey<T extends 'company' | 'country' | 'product_of_interest'>(key: T) {
    const itemCount: Record<string, number> = {};
    const filteredResults = this.getTableDataResults();

    filteredResults.forEach((item) => {
      const value = item[key as keyof typeof item]; // Explicit type assertion
      if (typeof value === 'string' && value) {
        itemCount[value] = (itemCount[value] || 0) + 1;
      }
    });

    return Object.entries(itemCount)
      .sort(([, countA], [, countB]) => countB - countA)
      .map(([item]) => item);
  }

  getPaginatedTableData(): PaginationData {
    const filteredResults = this.getTableDataResults();

    const paginationData = {
      current_page: this.tableData.current_page,
      page_size: filteredResults.length,
      total_pages: this.tableData.total_pages,
      total_records: this.tableData.total_records,
    };

    return PaginationDataSchema.parse(paginationData);
  }
}

export default TableDataManager;
