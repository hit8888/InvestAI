import { useSearchParams } from 'react-router-dom';
import { Drawer, DrawerContent } from '@breakout/design-system/components/Drawer/index';
import type { TablePageConfig } from '../types';
import { TableLoadingSkeleton } from './states/TableLoadingSkeleton';

interface GenericRowDrawerProps<TRow = unknown> {
  config: TablePageConfig<TRow>;
  getRowById: (id: string) => TRow | undefined;
  isLoadingData: boolean;
  refetch: () => void;
}

/**
 * Generic drawer for displaying row details
 * Opens via URL parameter, renders custom content component from config
 */
export const GenericRowDrawer = <TRow extends Record<string, unknown>>({
  config,
  getRowById,
  isLoadingData,
  refetch,
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
        return prev;
      },
      { replace: true },
    );
  };

  const rowData = rowId ? getRowById(rowId) : undefined;
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
        {isLoadingData ? (
          <div className="flex w-full items-center justify-center p-8">
            <TableLoadingSkeleton rows={5} />
          </div>
        ) : rowData ? (
          <DrawerContentComponent data={rowData} onClose={handleClose} refreshTable={refetch} />
        ) : (
          <div className="flex w-full items-center justify-center p-8">
            <p className="text-gray-600">Row not found</p>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
};
