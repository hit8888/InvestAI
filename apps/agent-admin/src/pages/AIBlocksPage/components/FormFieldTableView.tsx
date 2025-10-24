import { GripVertical, Plus, Trash2 } from 'lucide-react';
import * as React from 'react';
import {
  Sortable,
  SortableContent,
  SortableItem,
  SortableItemHandle,
  SortableOverlay,
} from '@breakout/design-system/components/shadcn-ui/sortable';
import Button from '@breakout/design-system/components/Button/index';
import { cn } from '@breakout/design-system/lib/cn';
import Typography from '@breakout/design-system/components/Typography/index';

interface FormField {
  id: string;
  field_name: string;
  data_type: string;
  property: string;
}

interface Column {
  key: keyof Omit<FormField, 'id'>;
  label: string;
  gridSpan: number;
}

const columns: Column[] = [
  { key: 'field_name', label: 'Text Field Name', gridSpan: 3 },
  { key: 'data_type', label: 'Type', gridSpan: 3 },
  { key: 'property', label: 'Property', gridSpan: 4 },
];

export function FormFieldTableView() {
  const [fields, setFields] = React.useState<FormField[]>([
    { id: '1', field_name: 'Full Name', data_type: 'text', property: 'name' },
    { id: '2', field_name: 'Email', data_type: 'email', property: 'email' },
    { id: '3', field_name: 'Phone', data_type: 'tel', property: 'phone' },
    { id: '4', field_name: 'Company', data_type: 'text', property: 'company' },
  ]);
  const [isLoading] = React.useState(false);

  const handleDeleteRow = (index: number) => {
    setFields((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex w-full flex-col gap-2">
        <Typography variant="label-16-medium">Form Fields</Typography>
        <Sortable value={fields} onValueChange={setFields} getItemValue={(item) => item.id}>
          <div className="w-full overflow-hidden rounded-lg border border-gray-300">
            {/* Header */}
            <div className="w-full border-b border-gray-300 bg-gray-100">
              <div className="grid w-full grid-cols-12">
                {/* Drag handle column header */}
                <div className="col-span-1 px-2 py-2">
                  <Typography variant="caption-12-medium" textColor="gray500">
                    {/* Empty header for drag handle */}
                  </Typography>
                </div>
                {/* Data columns headers */}
                {columns.map((column, colIndex) => (
                  <div
                    key={column.key}
                    style={{
                      gridColumn: `span ${column.gridSpan}`,
                    }}
                    className={cn('px-2 py-2.5', 'border-gray-300', colIndex > 0 && 'border-l')}
                  >
                    <Typography variant="caption-12-medium" textColor="gray500">
                      {column.label}
                    </Typography>
                  </div>
                ))}
                {/* Delete column header */}
                <div className="col-span-1 border-gray-300 px-2 py-2">
                  <Typography variant="caption-12-medium" textColor="gray500">
                    {/* Empty header for delete column */}
                  </Typography>
                </div>
              </div>
            </div>

            {/* Body */}
            <SortableContent asChild>
              <div className="divide-y divide-gray-200 bg-white">
                {isLoading ? (
                  <div className="flex h-32 items-center justify-center">
                    <div className="text-center">
                      <Typography variant="body-14" textColor="gray400">
                        Loading...
                      </Typography>
                    </div>
                  </div>
                ) : fields && fields.length > 0 ? (
                  fields.map((field, index) => (
                    <SortableItem key={field.id} value={field.id} asChild>
                      <div className={cn('group grid grid-cols-12 hover:bg-gray-50')}>
                        {/* Drag handle column */}
                        <div className="col-span-1 flex items-center justify-center px-2 py-2">
                          <SortableItemHandle asChild>
                            <div className="cursor-grab active:cursor-grabbing">
                              <GripVertical className="h-4 w-4 text-gray-400" />
                            </div>
                          </SortableItemHandle>
                        </div>
                        {/* Data columns */}
                        {columns.map((column) => (
                          <div
                            key={column.key}
                            style={{
                              gridColumn: `span ${column.gridSpan}`,
                            }}
                            className={cn('flex items-center border-l border-gray-200 px-2 py-2')}
                          >
                            <Typography variant="body-14">{String(field[column.key])}</Typography>
                          </div>
                        ))}
                        {/* Delete column */}
                        <div className="col-span-1 flex items-center justify-center border-gray-200 px-2 py-2">
                          <Button
                            type="button"
                            variant="tertiary"
                            buttonStyle="icon"
                            onClick={() => handleDeleteRow(index)}
                            className="opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="h-4 w-4 text-destructive-1000" />
                          </Button>
                        </div>
                      </div>
                    </SortableItem>
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
            </SortableContent>
          </div>
          <SortableOverlay>
            <div className="size-full rounded-lg border border-gray-200 bg-gray-50 bg-transparent" />
          </SortableOverlay>
        </Sortable>
      </div>
      <Button
        className="w-full"
        variant="system_tertiary"
        buttonStyle="rightIcon"
        rightIcon={<Plus className="size-4" />}
      >
        Add more
      </Button>
    </div>
  );
}

export default FormFieldTableView;
