import { useSearchParams } from 'react-router-dom';
import { Drawer, DrawerContent } from '@breakout/design-system/components/Drawer/index';
import type { TablePageConfig } from '../types';
import { X, AlertCircle } from 'lucide-react';

interface GenericRowDrawerProps<TRow = unknown> {
  config: TablePageConfig<TRow>;
  getRowById: (id: string) => TRow | undefined;
  isTableLoading: boolean;
  refetch: () => void;
  rowKeyColumn: string; // The field name used as row ID (e.g., 'prospect_id', 'id')
}

/**
 * Error state component for drawer when row is not found
 */
const RowNotFoundContent = ({ onClose, rowId }: { onClose: () => void; rowId: string }) => (
  <div className="flex h-full w-full select-text flex-col rounded-bl-2xl rounded-tl-2xl bg-white">
    {/* Header with close button */}
    <div className="flex justify-end px-3 pt-3">
      <button
        onClick={onClose}
        className="flex h-6 w-6 items-center justify-center rounded hover:bg-gray-100"
        aria-label="Close drawer"
      >
        <X className="h-4 w-4 text-gray-400" />
      </button>
    </div>

    {/* Error content */}
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 pb-16">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
        <AlertCircle className="h-8 w-8 text-red-600" />
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900">Row Not Found</h3>
        <p className="mt-2 text-sm text-gray-600">
          The requested row with ID <span className="font-mono text-gray-900">{rowId}</span> could not be found.
        </p>
        <p className="mt-1 text-sm text-gray-500">It may have been deleted or the link is invalid.</p>
      </div>
    </div>
  </div>
);

/**
 * Generic drawer for displaying row details
 * Opens via URL parameter, renders custom content component from config
 */
export const GenericRowDrawer = <TRow extends Record<string, unknown>>({
  config,
  getRowById,
  isTableLoading,
  refetch,
  rowKeyColumn,
}: GenericRowDrawerProps<TRow>) => {
  const [searchParams, setSearchParams] = useSearchParams();

  if (!config.drawer.enabled) {
    return null;
  }

  const rowId = searchParams.get(config.drawer.urlParam);
  const isOpen = !!rowId;

  const handleClose = () => {
    setSearchParams(
      (prev) => {
        prev.delete(config.drawer.urlParam);
        // Also clear the panel parameter if it exists
        prev.delete('panel');
        return prev;
      },
      { replace: true },
    );
  };

  // Try to get row from table cache first
  let rowData = rowId ? getRowById(rowId) : undefined;

  // If not in cache, create minimal object with just the ID
  // This allows drawer to fetch its own data (V1 behavior)
  // The drawer will show loading shimmer via isTableLoading prop
  if (!rowData && rowId) {
    rowData = { [rowKeyColumn]: rowId } as TRow;
  }

  const DrawerContentComponent = config.drawer.component;

  // Determine drawer width styling
  const isHalfWidth = config.drawer.width === '50vw';
  const drawerClassName = `z-[1001] ml-auto flex h-screen flex-row justify-end gap-4 rounded-none border-none ${isHalfWidth ? 'w-1/2' : ''}`;
  const drawerStyle = !isHalfWidth ? { width: config.drawer.width } : undefined;

  if (!isOpen) {
    return null;
  }

  return (
    <Drawer
      open={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open) {
          handleClose();
        }
      }}
      direction="right"
      modal={true}
      shouldScaleBackground={false}
    >
      <DrawerContent className={drawerClassName} style={drawerStyle} data-vaul-no-drag>
        {rowData ? (
          <DrawerContentComponent
            data={rowData}
            onClose={handleClose}
            refreshTable={refetch}
            isTableLoading={isTableLoading}
            {...(config.drawer.props || {})}
          />
        ) : (
          <RowNotFoundContent onClose={handleClose} rowId={rowId!} />
        )}
      </DrawerContent>
    </Drawer>
  );
};
