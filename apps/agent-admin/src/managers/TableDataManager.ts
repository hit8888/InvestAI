import { TableDataSchema } from '@meaku/core/types/admin/admin-table';
import { TableDataResponse, PaginationData } from '@meaku/core/types/admin/admin';
import { PaginationDataSchema } from '@meaku/core/types/admin/api';

type Result<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

/**
 * This is a TableDataManager that helps us manage the response for the Table Data API.
 * This has been made into a single manager to avoid code duplication and to make the code more maintainable.
 */

class TableDataManager {
  private tableData: TableDataResponse | null = null;
  private error: string | null = null;

  constructor(tableData: TableDataResponse) {
    const result = this.validateTableData(tableData);

    if (result.success && result.data) {
      this.tableData = result.data;
    } else {
      this.error = result.error || 'Failed to validate table data';
    }
  }

  private validateTableData(tableData: TableDataResponse): Result<TableDataResponse> {
    const validatedTableData = TableDataSchema.safeParse(tableData);

    if (!validatedTableData.success) {
      // console.error('Validation failed for TableDataManager:', {
      //   input: tableData,
      //   errors: validatedTableData.error,
      // });
      return {
        success: false,
        error: validatedTableData.error.errors.map((error) => error.message).join(', '),
      };
    }

    return {
      success: true,
      data: validatedTableData.data,
    };
  }

  hasError(): boolean {
    return this.error !== null;
  }

  getError(): string | null {
    return this.error;
  }

  getTableDataResults() {
    if (!this.tableData) {
      return [];
    }
    return this.tableData.results;
  }

  getSortedItemsByKey<T extends 'company' | 'country' | 'product_of_interest'>(key: T) {
    if (!this.tableData) {
      return [];
    }

    const itemCount: Record<string, number> = {};

    this.tableData.results.forEach((item) => {
      const value = item[key as keyof typeof item];
      if (typeof value === 'string' && value) {
        itemCount[value] = (itemCount[value] || 0) + 1;
      }
    });

    return Object.entries(itemCount)
      .sort(([, countA], [, countB]) => countB - countA)
      .map(([item]) => item);
  }

  getPaginatedTableData(): PaginationData | null {
    if (!this.tableData) {
      return null;
    }

    const paginationData = {
      current_page: this.tableData.current_page,
      page_size: this.tableData.page_size,
      total_pages: this.tableData.total_pages,
      total_records: this.tableData.total_records,
    };

    return PaginationDataSchema.parse(paginationData);
  }
}

export default TableDataManager;
