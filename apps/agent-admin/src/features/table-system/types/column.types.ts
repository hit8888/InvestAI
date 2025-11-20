/**
 * Column type categories
 */
export type ColumnType = 'PRIMARY' | 'SECONDARY';

/**
 * Cell rendering types - Based on actual table columns
 */
export type CellType =
  | 'TEXT' // Plain text (Lead Name, Lead Source, Traffic Source, Customer, Pushed to CRM)
  | 'EMAIL' // Email address (visually same as TEXT for now)
  | 'COMPANY' // Company logo + name + optional email (multi-line if needed)
  | 'DATETIME' // Relative time + absolute on hover (Last Interacted)
  | 'COLORED_TEXT' // Low/Medium/High categories with colors (Relevance, Buyer Intent)
  | 'URL' // Clickable URLs (Page Browsed, LinkedIn)
  | 'LOCATION_WITH_FLAG' // Country flag + city + country name (User Location)
  | 'SDR_ASSIGNMENT'; // SDR rep name or "Unassigned" with icon

export type LabelAssignmentType = 'NONE' | 'MAPPING' | 'NUMERIC_CONDITION';

/**
 * Entity metadata column (from backend API)
 * Supports both V1 and V2 formats
 */
export interface EntityMetadataColumn {
  // V1 Fields (always present)
  id: number;
  entity_type?: string;
  source?: string;
  key_name: string;
  display_name: string;
  column_name: string;
  description?: string;
  data_type: string;
  parent_column?: string | null;
  is_display: boolean;
  table_order: number;
  related_entities?: string[];

  // V2 Fields (optional, with fallbacks)
  column_type?: ColumnType;
  is_row_key?: boolean;
  is_sortable?: boolean;
  is_filterable?: boolean;
  filter_label?: string | null;
  filter_type?: 'MULTI_SELECT' | 'DATE_RANGE' | null;
  filter_label_icon?: string | null; // Lucide icon name
  filter_display_type?: 'default' | 'country_flag' | 'user_avatar' | 'intent_badge' | null; // How to render filter options
  filter_options_type?: 'ID_LOOKUP' | 'DIRECT' | null; // How to fetch/transform filter options
  cell_type?: CellType;
  is_visible?: boolean;
  data_lookup?: string | null;

  // Meta fields (for composite columns)
  is_meta?: boolean; // V2 field name (deprecated)
  is_metadata?: boolean; // Real API field name
  meta_reference_column?: string | null; // Column that this metadata references
  meta_reference_relation?: 'TOOLTIP' | 'LINK' | 'EMAIL' | 'LOGO' | 'NONE' | null; // How it relates to the referenced column
  tooltip_text?: string | null; // Tooltip text for the column
  is_searchable?: boolean; // Whether the column is searchable

  // Label fields
  label_prefix?: string | null;
  label_suffix?: string | null;
  label_assignment_type?: LabelAssignmentType | null;
  label_assignment_value?: Record<string, string> | Record<string, [Array<string | number>, string]> | null;
  default_label_value?: string | null;
}

/**
 * Entity metadata API response
 */
export interface EntityMetadataResponse {
  columns: EntityMetadataColumn[];
  header_mapping?: Record<string, string>;
  related_entities?: Record<string, unknown>;
}

/**
 * Transformed column definition for TanStack Table
 */
export interface TableColumnDefinition<TRow = unknown> {
  id: string;
  accessorKey: string;
  header: string;
  sortable: boolean;
  tooltipText?: string; // Tooltip for column header
  meta: {
    cellType: CellType;
    dataType: string;
    description?: string;
    isRowKey: boolean;
    isDisplay: boolean;
    keyName: string; // Original key_name for metadata lookup
  };
  // Note: TRow generic is used by consumers of this interface for type safety
  _row?: TRow; // Phantom type parameter to satisfy TypeScript
}

/**
 * Extended column definition with optional custom cell renderer
 * Used for custom tables like Members that need custom cell rendering logic
 */
export interface TableColumnDefinitionWithCustomRenderer<TRow = unknown> extends TableColumnDefinition<TRow> {
  _customCellRenderer?: (row: TRow) => React.ReactNode;
}

/**
 * Union type for column definitions - supports both standard and custom renderer columns
 */
export type ColumnDefinition<TRow = unknown> =
  | TableColumnDefinition<TRow>
  | TableColumnDefinitionWithCustomRenderer<TRow>;
