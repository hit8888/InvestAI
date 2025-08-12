import { Drawer, DrawerContent, DrawerOverlay } from '@breakout/design-system/components/Drawer/index';
import EditBulkRowItemsDrawerContentContainer from './EditBulkRowItemsDrawerContentContainer';

type EditBulkRowItemsDrawerProps = {
  open: boolean;
  onClose: () => void;
};

const EditBulkRowItemsDrawer = ({ open, onClose }: EditBulkRowItemsDrawerProps) => {
  return (
    <Drawer open={open} onOpenChange={onClose} direction="right">
      <DrawerOverlay className="fixed inset-0 bg-transparent_gray_16" />
      {open && (
        <DrawerContent className="z-[1000] ml-[50%] h-screen w-1/2 rounded-none bg-primary-foreground bg-white">
          <EditBulkRowItemsDrawerContentContainer onClose={onClose} />
        </DrawerContent>
      )}
    </Drawer>
  );
};

export default EditBulkRowItemsDrawer;
