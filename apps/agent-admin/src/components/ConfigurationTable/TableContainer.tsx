import Typography from '@breakout/design-system/components/Typography/index';
import React, { useMemo } from 'react';
import TableShimmer from '../../components/common/TableShimmer';
import { cn } from '@breakout/design-system/lib/cn';
import Button from '@breakout/design-system/components/Button/index';
import { PlusIcon, SaveIcon } from 'lucide-react';
import DeleteIcon from '@breakout/design-system/components/icons/delete-icon';
import ResizeTextarea from '@breakout/design-system/components/TextArea/ResizeTextarea';
import Input from '@breakout/design-system/components/layout/input';
import {
  ColumnConfig,
  ConfigurationData,
  ConfigurationFormData,
  CustomRendererProps,
  isRowEmpty,
  getFilledRows,
} from './utils';
import { useFieldArray, Control, FieldErrors, Controller, useWatch } from 'react-hook-form';
import { deepCompare } from '@meaku/core/utils/index';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@breakout/design-system/components/layout/select';

interface ConfigurationTableContainerProps {
  columns: ColumnConfig[];
  isLoading?: boolean;
  control: Control<ConfigurationFormData>;
  errors: FieldErrors<ConfigurationFormData>;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  isBtnDisabled?: boolean;
  formFieldName?: string;
  isFormValid?: boolean;
  savedData?: ConfigurationData[]; // Add savedData to compare with current form values
}

const TableContainer = ({
  columns = [],
  isLoading,
  control,
  errors,
  onSubmit,
  isBtnDisabled = false,
  formFieldName = 'items',
  isFormValid = false,
  savedData = [],
}: ConfigurationTableContainerProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: formFieldName,
  });

  // Watch all form values to track changes in real-time
  const watchedItems = useWatch({
    control,
    name: formFieldName,
  });

  // Create empty row object from columns
  const createEmptyRow = (): ConfigurationData => {
    const emptyRow: ConfigurationData = {};
    columns.forEach((col) => {
      emptyRow[col.key] = '';
    });
    return emptyRow;
  };

  const handleAddRow = () => {
    // If no fields exist, add the first row
    if (fields.length === 0) {
      append(createEmptyRow());
      return;
    }

    // Check if there's any empty row
    const hasEmptyRow = fields.some((_, index) => {
      const currentValue = watchedItems?.[index];
      return isRowEmpty(currentValue, columns);
    });

    // Only add new row if no empty rows exist
    if (!hasEmptyRow) {
      append(createEmptyRow());
    }
  };

  const handleDeleteRow = (index: number) => {
    // If there's only one row and it's empty, don't delete it
    if (fields.length === 1) {
      const currentValue = watchedItems?.[index];
      if (isRowEmpty(currentValue, columns)) {
        return;
      }
    }

    if (fields.length > 1) {
      remove(index);
    } else {
      // Replace with empty row instead of removing if it's the last one
      remove(index);
      append(createEmptyRow());
    }
  };

  // Memoize button states to avoid unnecessary recalculations
  const isAddBtnDisabled = useMemo(() => {
    if (fields.length === 0) return false; // Allow adding first row

    // Disable if any row is empty
    const hasEmptyRow = fields.some((_, index) => {
      const currentValue = watchedItems?.[index];
      return isRowEmpty(currentValue, columns);
    });

    // In onTouched mode, also check form validity
    const hasValidationErrors = !isFormValid;

    return hasEmptyRow || hasValidationErrors;
  }, [fields, watchedItems, columns, errors, formFieldName, isFormValid]);

  // Single source of truth: Get error columns for a specific row
  const getRowErrorColumns = (rowIndex: number) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rowErrors = (errors as any)?.[formFieldName]?.[rowIndex];
    if (!rowErrors) return [];

    return columns.filter((col) => rowErrors[col.key]);
  };

  // Enhanced save button logic
  const isSaveButtonDisabled = useMemo(() => {
    // Basic conditions
    if (fields.length === 0 || isLoading || isBtnDisabled || !isFormValid) {
      return true;
    }

    // Case 1: Single row with empty values for both fields
    if (fields.length === 1) {
      const currentValue = watchedItems?.[0];
      if (isRowEmpty(currentValue, columns)) {
        // Allow saving if there was previously saved data (user wants to clear all data)
        // Only disable if there was no previous data (initial empty state)
        return savedData.length === 0;
      }
    }

    // Case 2: No changes when in edit mode (compare current form values with saved data)
    if (savedData.length > 0) {
      const currentValidRows = getFilledRows(watchedItems || [], columns);
      const savedValidRows = getFilledRows(savedData, columns);

      // If no changes detected, disable save button
      if (deepCompare(currentValidRows, savedValidRows)) {
        return true;
      }
    }

    return false;
  }, [fields.length, isLoading, isBtnDisabled, isFormValid, watchedItems, columns, savedData]);

  return (
    <form className="flex w-full flex-col gap-4" onSubmit={onSubmit}>
      <div className="w-full overflow-hidden rounded-lg border border-gray-300 bg-white">
        <ColumnHeader columns={columns} />

        <div className="divide-y divide-gray-200">
          {isLoading ? (
            <TableShimmer />
          ) : fields && fields.length > 0 ? (
            fields.map((field, index) => {
              const errorColumns = getRowErrorColumns(index);

              return (
                <React.Fragment key={field.id}>
                  <div key={field.id} className={cn('group grid grid-cols-12')}>
                    {columns.map((column, colIndex) => (
                      <div
                        key={column.key}
                        style={{
                          gridColumn: `span ${column.gridSpan || 4}`,
                        }}
                        className={cn('p-1', colIndex > 0 && 'border-l border-gray-200')}
                      >
                        <Controller
                          name={`${formFieldName}.${index}.${column.key}` as const}
                          control={control}
                          render={({ field: controllerField }) => (
                            <FieldRenderer
                              column={column}
                              field={controllerField}
                              control={control}
                              index={index}
                              formFieldName={formFieldName}
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                              error={(errors as any)?.[formFieldName]?.[index]?.[column.key]}
                            />
                          )}
                        />
                      </div>
                    ))}
                    <div className="col-span-1 flex items-center justify-center px-2 py-2">
                      <Button
                        type="button"
                        variant="tertiary"
                        buttonStyle="icon"
                        onClick={() => handleDeleteRow(index)}
                        className="opacity-0 group-hover:opacity-100"
                      >
                        <DeleteIcon className="h-4 w-4 text-destructive-1000" />
                      </Button>
                    </div>
                  </div>
                  {errorColumns.length > 0 && (
                    <div className="grid w-full grid-cols-12 bg-red-50 py-1">
                      {errorColumns.map((col) => (
                        <Typography
                          key={col.key}
                          style={{
                            gridColumn: `span ${col.gridSpan || 4}`,
                            paddingLeft: '8px',
                          }}
                          variant="caption-12-normal"
                          textColor="error"
                        >
                          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                          {(errors as any)?.[formFieldName]?.[index]?.[col.key]?.message}
                        </Typography>
                      ))}
                      <div className="col-span-1" />
                    </div>
                  )}
                </React.Fragment>
              );
            })
          ) : (
            <div className="flex h-32 items-center justify-center">
              <div className="text-center">
                <Typography variant="body-14" textColor="gray400">
                  No data available
                </Typography>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex w-full items-center justify-between">
        <Button
          type="button"
          disabled={isLoading || isAddBtnDisabled || isBtnDisabled}
          variant="secondary"
          buttonStyle="rightIcon"
          rightIcon={<PlusIcon className="h-4 w-4" />}
          onClick={handleAddRow}
        >
          Add
        </Button>
        {onSubmit && (
          <Button
            type="submit"
            disabled={isSaveButtonDisabled}
            variant="primary"
            buttonStyle="rightIcon"
            rightIcon={<SaveIcon className="h-4 w-4" />}
          >
            Save
          </Button>
        )}
      </div>
    </form>
  );
};

// Field renderer component that renders different field types
const FieldRenderer = ({
  column,
  field,
  control,
  index,
  error,

  ...rest
}: CustomRendererProps & {
  column: ColumnConfig;
  formFieldName?: string;
}) => {
  const baseInputClass = cn(
    'h-full w-full rounded-none border-none p-0 pl-1 font-medium placeholder:text-gray-400 focus:border-none focus:outline-none focus:ring-4 focus:ring-primary/20 focus:ring-offset-0',
    error && 'ring-2 ring-red-500',
  );

  const baseTextareaClass = cn(
    'flex w-full resize-none items-center rounded-none border-none p-0 py-2 pl-1 placeholder:text-gray-400 focus:border-none focus:outline-none focus:ring-4 focus:ring-primary/20 focus:ring-offset-0',
    error && 'ring-2 ring-red-500',
  );

  // Handler that triggers validation on change for real-time error display
  const handleChange = (value: string) => {
    field.onChange(value);
    field.onBlur(); // Trigger validation immediately
  };

  switch (column.fieldType) {
    case 'input':
      return (
        <Input
          {...field}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={column.placeholder || `Enter ${column.label}`}
          className={baseInputClass}
        />
      );

    case 'textarea':
      return (
        <ResizeTextarea
          {...field}
          onChange={(e) => handleChange(e.target.value)}
          className={baseTextareaClass}
          placeholder={column.placeholder || `Enter ${column.label}`}
          style={{
            minHeight: '100%',
          }}
        />
      );

    case 'dropdown':
      return (
        <Select
          onValueChange={(value) => {
            field.onChange(value);
            field.onBlur(); // Trigger validation immediately
          }}
          value={field.value}
        >
          <SelectTrigger
            className={cn(
              'h-full rounded-none border-none pl-1 shadow-none focus:ring-4 focus:ring-primary/20',
              error && 'ring-2 ring-red-500',
            )}
          >
            <SelectValue placeholder={column.placeholder || `Select ${column.label}`} />
          </SelectTrigger>
          <SelectContent>
            {column.dropdownOptions?.map((option) => (
              <SelectItem className="cursor-pointer hover:bg-gray-25" key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case 'custom':
      return column.customRenderer ? column.customRenderer({ field, control, index, error, ...rest }) : null;

    default:
      return (
        <Input
          {...field}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={column.placeholder || `Enter ${column.label}`}
          className={baseInputClass}
        />
      );
  }
};

const ColumnHeader = ({ columns }: { columns: ColumnConfig[] }) => {
  return (
    <div className="w-full border-b border-gray-300 bg-gray-100">
      <div className="grid w-full grid-cols-12">
        {columns.map((column, index) => (
          <div
            key={column.key}
            style={{
              gridColumn: `span ${column.gridSpan || 4}`,
            }}
            className={cn('px-2 py-2', index > 0 && 'border-l border-gray-300')}
          >
            <Typography variant="caption-12-medium" textColor="gray500">
              {column.label}
            </Typography>
          </div>
        ))}
        <div className="col-span-1 px-2 py-2">
          <Typography variant="caption-12-medium" textColor="gray500">
            {/* Empty header for delete column */}
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default TableContainer;
