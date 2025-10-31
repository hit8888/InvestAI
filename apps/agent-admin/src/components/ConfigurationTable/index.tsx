import TableContainer from './TableContainer';
import TableHeader from './TableHeader';
import FilledTableData from './FilledTableData';
import ErrorState from '@breakout/design-system/components/layout/ErrorState';
import TableLoadingState from './TableLoadingState';
import {
  CommonControlsProps,
  ConfigurationData,
  ConfigurationFormData,
  ColumnConfig,
  createEmptyRow,
  getFilledRows,
  isRowEmpty,
} from './utils';
import { useEffect, useMemo, useState, useRef } from 'react';
import { deepCompare } from '@meaku/core/utils/index';
import { UseFormReturn } from 'react-hook-form';

interface ConfigurationTableProps extends CommonControlsProps {
  isLoading: boolean;
  data: ConfigurationData[];
  error: Error | null;
  columns: ColumnConfig[];
  onSave?: (data: ConfigurationData[]) => Promise<void> | void;
  isDisabled?: boolean;
  form: UseFormReturn<ConfigurationFormData>;
  formFieldName?: string;
  addDefaultRow?: ConfigurationData[];
}

const ConfigurationTable = ({
  title,
  description,
  isLoading,
  data,
  error,
  columns,
  onSave,
  isDisabled,
  form,
  formFieldName = 'items',
  addDefaultRow,
}: ConfigurationTableProps) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [savedData, setSavedData] = useState<ConfigurationData[]>([]);
  const prevDataRef = useRef<ConfigurationData[]>([]);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = form;

  // Get filtered filled rows
  const getValidRows = (rows: ConfigurationData[]): ConfigurationData[] => {
    return getFilledRows(rows, columns);
  };

  // Initialize form data when data is loaded
  useEffect(() => {
    // Only reset if data actually changed (deep comparison)
    if (deepCompare(data, prevDataRef.current)) {
      return;
    }

    prevDataRef.current = data;
    const filledRows = getValidRows(data);

    if (filledRows.length > 0) {
      const formData = { [formFieldName]: filledRows };
      reset(formData);
      setSavedData(filledRows);
    } else {
      // Reset with initial empty data if no valid rows are found
      const emptyRow = createEmptyRow(columns, addDefaultRow);
      reset({ [formFieldName]: [emptyRow] });
      setSavedData([]);
    }
  }, [data, reset, formFieldName, columns]);

  const onSubmit = async (formData: ConfigurationFormData) => {
    // Filter out empty rows (only include rows with all required fields filled)
    const validRows = getValidRows(formData[formFieldName]);

    // Compare with saved data to avoid unnecessary saves
    if (deepCompare(validRows, savedData)) {
      setIsEditMode(false);
      return;
    }

    try {
      // Call the save callback with valid rows
      await onSave?.(validRows);

      // Update saved data and form default values
      const newSavedData = validRows.length > 0 ? validRows : [];
      setSavedData(newSavedData);

      // Reset form with new defaults to update form's defaultValues
      const emptyRow = createEmptyRow(columns, addDefaultRow);
      const newFormData = {
        [formFieldName]: newSavedData.length > 0 ? newSavedData : [emptyRow],
      };
      reset(newFormData);
      setIsEditMode(false);
    } catch (err) {
      console.error('Error saving configuration:', err);
    }
  };

  const handleEdit = () => {
    setIsEditMode(true);
    // Reset form to its saved state (defaultValues)
    reset();
  };

  const hasFilledData = useMemo(
    () => savedData.length > 0 && savedData.every((row) => !isRowEmpty(row, columns)),
    [savedData, columns],
  );

  const showFilledDataView = !isEditMode && hasFilledData;

  if (isLoading) {
    return <TableLoadingState title={title} description={description} />;
  }

  if (error) {
    return <ErrorState />;
  }

  const filledRows = getValidRows(savedData);

  return (
    <div className="flex w-full flex-col items-start gap-4 self-stretch">
      <TableHeader title={title} description={description} />
      {showFilledDataView ? (
        <FilledTableData configurationData={filledRows} handleEdit={handleEdit} columns={columns} />
      ) : (
        <TableContainer
          isLoading={isLoading}
          columns={columns}
          control={control}
          errors={errors}
          onSubmit={handleSubmit(onSubmit)}
          isBtnDisabled={isDisabled}
          formFieldName={formFieldName}
          isFormValid={isValid}
          savedData={savedData}
          addDefaultRow={addDefaultRow}
        />
      )}
    </div>
  );
};

export default ConfigurationTable;
