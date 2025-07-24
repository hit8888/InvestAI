import { Drawer, DrawerContent } from '@breakout/design-system/components/Drawer/index';
import CustomDocumentDrawerContentContainer from './CustomDocumentDrawerContentContainer';

type CustomDocumentDrawerProps = {
  open: boolean;
  onClose: () => void;
  isClickedOnCreateButton?: boolean;
};

const CustomDocumentDrawer = ({ open, onClose, isClickedOnCreateButton = true }: CustomDocumentDrawerProps) => {
  return (
    <Drawer open={open} onOpenChange={onClose} direction="right">
      {open && (
        <DrawerContent className="z-[1000] ml-[50%] h-[100vh] w-1/2 rounded-none bg-primary-foreground bg-white">
          <CustomDocumentDrawerContentContainer onClose={onClose} isClickedOnCreateButton={isClickedOnCreateButton} />
        </DrawerContent>
      )}
    </Drawer>
  );
};

export default CustomDocumentDrawer;
