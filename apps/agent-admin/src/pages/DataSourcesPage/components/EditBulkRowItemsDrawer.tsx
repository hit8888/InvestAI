import { Drawer, DrawerContent, DrawerOverlay } from '@breakout/design-system/components/Drawer/index';
import EditBulkRowItemsDrawerContentContainer from './EditBulkRowItemsDrawerContentContainer';
import { DialogDescription, DialogTitle } from '@breakout/design-system/components/layout/dialog';

type EditBulkRowItemsDrawerProps = {
  open: boolean;
  onClose: () => void;
};

const EditBulkRowItemsDrawer = ({ open, onClose }: EditBulkRowItemsDrawerProps) => {
  return (
    <Drawer open={open} dismissible={false} onOpenChange={onClose} direction="right">
      <DrawerOverlay className="fixed inset-0 bg-transparent_gray_16" />
      <DialogTitle className="sr-only"></DialogTitle>
      <DialogDescription className="sr-only"></DialogDescription>
      {open && (
        <DrawerContent className="z-[1000] ml-[50%] h-[100vh] w-1/2 rounded-none bg-primary-foreground bg-white">
          <EditBulkRowItemsDrawerContentContainer onClose={onClose} />
        </DrawerContent>
      )}
    </Drawer>
  );
};

export default EditBulkRowItemsDrawer;
