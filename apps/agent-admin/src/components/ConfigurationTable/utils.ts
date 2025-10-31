import { z } from 'zod';
import { Control, ControllerRenderProps, FieldError } from 'react-hook-form';

export type CommonControlsProps = {
  title: string;
  description: string;
};

// Field types supported by the configuration table
export type FieldType = 'input' | 'textarea' | 'dropdown' | 'custom';

// Dropdown option type
export type DropdownOption = {
  label: string;
  value: string;
};

// Generic configuration data type - represents a single row
// Using string for form compatibility, can be parsed/transformed as needed
export type ConfigurationData = Record<string, string>;

// Form data structure - represents the entire form with dynamic field name
export type ConfigurationFormData = Record<string, ConfigurationData[]>;

// Custom renderer props type for better type safety
// Using Omit to override the value type to be string only
export type CustomRendererProps = {
  field: Omit<ControllerRenderProps<ConfigurationFormData, `${string}.${number}.${string}`>, 'value'> & {
    value: string;
  };
  control: Control<ConfigurationFormData>;
  index: number;
  formFieldName?: string;
  error?: FieldError;
};

// Column configuration type
export type ColumnConfig = {
  key: string; // The field key in the data object
  label: string; // Column header label
  fieldType: FieldType; // Type of input field
  placeholder?: string; // Placeholder text for the field
  gridSpan?: number; // Grid column span (default: 4 for first, 7 for second, 1 for delete)
  validation?: z.ZodSchema; // Optional Zod validation schema
  dropdownOptions?: DropdownOption[]; // Options for dropdown fields
  customRenderer?: (props: CustomRendererProps) => React.ReactNode; // Custom renderer for custom field types
};

// Configuration table setup type
export type ConfigurationTableSetup<TData = ConfigurationData> = {
  columns: ColumnConfig[];
  initialEmptyRow: TData;
  formFieldName?: string; // Name of the form field array (default: 'items')
  validationSchema?: z.ZodSchema; // Form-level validation schema
  filterValidRows?: (row: TData) => boolean; // Function to filter valid rows for submission
};

// Helper function to create initial empty row from column config
export const createEmptyRow = (columns: ColumnConfig[], addDefaultRow?: ConfigurationData[]): ConfigurationData => {
  if (addDefaultRow) {
    return addDefaultRow[0];
  }
  const emptyRow: ConfigurationData = {};
  columns.forEach((col) => {
    emptyRow[col.key] = '';
  });
  return emptyRow;
};

// Helper function to check if a row is empty
export const isRowEmpty = (row: ConfigurationData | undefined, columns: ColumnConfig[]): boolean => {
  if (!row) {
    return true;
  }
  return columns.every((col) => {
    const value = row[col.key];
    return value === '' || value === null || value === undefined;
  });
};

// Helper function to filter filled rows
export const getFilledRows = (data: ConfigurationData[], columns: ColumnConfig[]): ConfigurationData[] => {
  return data.filter((row) => !isRowEmpty(row, columns));
};
