/**
 * Sort direction
 */
export type SortOrder = 'asc' | 'desc';

/**
 * Sort state
 */
export interface SortState {
  field: string;
  order: SortOrder;
}

/**
 * Table data response from API
 */
export interface TableResponse<TRow = unknown> {
  results: TRow[];
  current_page: number;
  page_size: number;
  total_pages: number;
  total_records: number;
}

/**
 * Table data request payload
 */
export interface TableRequestPayload {
  filters: unknown[]; // Page-specific filter format
  sort: Array<{ field: string; order: SortOrder }>;
  page: number;
  page_size: number;
  search: string;
}
