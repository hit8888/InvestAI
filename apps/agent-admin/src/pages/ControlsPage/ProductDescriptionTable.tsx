import Typography from '@breakout/design-system/components/Typography/index';
import React, { useMemo } from 'react';
import TableShimmer from '../../components/common/TableShimmer';
import { cn } from '@breakout/design-system/lib/cn';
import Button from '@breakout/design-system/components/Button/index';
import { PlusIcon, SaveIcon } from 'lucide-react';
import DeleteIcon from '@breakout/design-system/components/icons/delete-icon';
import ResizeTextarea from '@breakout/design-system/components/TextArea/ResizeTextarea';
import Input from '@breakout/design-system/components/layout/input';
import { ProductFormData } from './utils';
import { useFieldArray, Control, FieldErrors, Controller, useWatch } from 'react-hook-form';

interface ProductDescriptionTableProps {
  columns?: string[];
  isLoading?: boolean;
  control: Control<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  isBtnDisabled?: boolean;
}

const ProductDescriptionTable = ({
  columns = [],
  isLoading,
  control,
  errors,
  onSubmit,
  isBtnDisabled,
}: ProductDescriptionTableProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'products',
  });

  // Watch all form values to track changes in real-time
  const watchedItems = useWatch({
    control,
    name: 'products',
  });

  const handleAddRow = () => {
    const hasEmptyRow = fields.some((_, index) => {
      const currentValue = watchedItems?.[index];
      return currentValue?.name === '' && currentValue?.description === '';
    });

    if (!hasEmptyRow) {
      append({
        name: '',
        description: '',
      });
    }
  };

  const handleDeleteRow = (index: number) => {
    // If there's only one row and it's empty, don't delete it
    if (fields.length === 1) {
      const currentValue = watchedItems?.[index];
      if (currentValue?.name === '' && currentValue?.description === '') {
        return;
      }
    }

    if (fields.length > 1) {
      remove(index);
    } else {
      // Replace with empty row instead of removing if it's the last one
      remove(index);
      append({ name: '', description: '' });
    }
  };

  // Memoize button states to avoid unnecessary recalculations
  const isAddBtnDisabled = useMemo(() => {
    if (fields.length === 0) return false; // Allow adding first row

    // Disable if any row is empty
    return fields.some((_, index) => {
      const currentValue = watchedItems?.[index];
      return currentValue?.name === '' && currentValue?.description === '';
    });
  }, [fields, watchedItems]);

  return (
    <form className="flex w-full flex-col gap-4" onSubmit={onSubmit}>
      <div className="w-full overflow-hidden rounded-lg border border-gray-300 bg-white">
        <ColumnHeader columns={columns} />

        <div className="divide-y divide-gray-200">
          {isLoading ? (
            <TableShimmer />
          ) : fields && fields.length > 0 ? (
            fields.map((field, index) => (
              <div key={field.id} className={cn('group grid grid-cols-12')}>
                <div className="col-span-4 p-1">
                  <Controller
                    name={`products.${index}.name` as const}
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Add Product Name"
                        className={cn(
                          'h-full w-full rounded-none border-none p-0 pb-4 pl-1 font-medium placeholder:text-gray-400 focus:border-none focus:outline-none focus:ring-4 focus:ring-primary/20 focus:ring-offset-0',
                          errors?.products?.[index]?.name && 'ring-2 ring-red-500',
                        )}
                      />
                    )}
                  />
                </div>
                <div className="col-span-7 border-l border-gray-200 p-1">
                  <Controller
                    name={`products.${index}.description` as const}
                    control={control}
                    render={({ field }) => (
                      <ResizeTextarea
                        {...field}
                        className={cn(
                          'flex w-full resize-none items-center rounded-none border-none p-0 py-2 pl-1 placeholder:text-gray-400 focus:border-none focus:outline-none focus:ring-4 focus:ring-primary/20 focus:ring-offset-0',
                          errors?.products?.[index]?.description && 'ring-2 ring-red-500',
                        )}
                        placeholder="Add Description"
                        style={{
                          minHeight: '100%',
                        }}
                      />
                    )}
                  />
                </div>
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
                {(errors?.products?.[index]?.name || errors?.products?.[index]?.description) && (
                  <div className="col-span-12 px-1 pb-2">
                    <Typography variant="caption-12-normal" textColor="error">
                      {errors?.products?.[index]?.name?.message || errors?.products?.[index]?.description?.message}
                    </Typography>
                  </div>
                )}
              </div>
            ))
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
            disabled={isLoading || isBtnDisabled}
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

const ColumnHeader = ({ columns }: { columns: string[] }) => {
  return (
    <div className="border-b border-gray-300 bg-gray-100">
      <div className="grid grid-cols-12">
        <div className="col-span-4 px-2 py-2">
          <Typography variant="caption-12-medium" textColor="gray500">
            {columns[0]}
          </Typography>
        </div>
        <div className="col-span-7 border-l border-gray-300 px-2 py-2">
          <Typography variant="caption-12-medium" textColor="gray500">
            {columns[1]}
          </Typography>
        </div>
        <div className="col-span-1 px-2 py-2">
          <Typography variant="caption-12-medium" textColor="gray500">
            {columns[2]}
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default ProductDescriptionTable;
