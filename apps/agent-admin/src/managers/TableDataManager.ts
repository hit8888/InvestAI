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
      throw new Error(validatedTableData.error.errors.map((error) => error.message).join(', '));
    }

    return validatedTableData.data;
  }

  getTableDataResults(): LeadsTableViewContent[] | ConversationsTableViewContent[] {
    return this.tableData.results;
  }

  getPaginatedTableData(): PaginationData {
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
