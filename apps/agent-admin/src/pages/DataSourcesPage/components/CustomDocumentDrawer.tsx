import { Drawer, DrawerContent, DrawerOverlay } from '@breakout/design-system/components/Drawer/index';
import { DialogDescription, DialogTitle } from '@breakout/design-system/components/layout/dialog';
import CustomDocumentDrawerContentContainer from './CustomDocumentDrawerContentContainer';

type CustomDocumentDrawerProps = {
  open: boolean;
  onClose: () => void;
};

const CustomDocumentDrawer = ({ open, onClose }: CustomDocumentDrawerProps) => {
  return (
    <Drawer open={open} dismissible={false} onOpenChange={onClose} direction="right">
      <DrawerOverlay className="fixed inset-0 bg-transparent_gray_16" />
      <DialogTitle className="sr-only"></DialogTitle>
      <DialogDescription className="sr-only"></DialogDescription>
      {open && (
        <DrawerContent className="z-[1000] ml-[50%] h-[100vh] w-1/2 rounded-none bg-primary-foreground bg-white">
          <CustomDocumentDrawerContentContainer onClose={onClose} />
        </DrawerContent>
      )}
    </Drawer>
  );
};

export default CustomDocumentDrawer;
