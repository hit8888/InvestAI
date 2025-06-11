import Button from '@breakout/design-system/components/Button/index';
import { PencilIcon } from 'lucide-react';
import { useState } from 'react';
import CustomDocumentDrawer from './CustomDocumentDrawer';

const CreateCustomDocumentButton = () => {
  const [showDrawer, setShowDrawer] = useState(false);

  const handleCreateCustomDocument = () => {
    setShowDrawer(true);
  };

  const handleCloseDrawer = () => {
    setShowDrawer(false);
  };

  return (
    <>
      <Button onClick={handleCreateCustomDocument} variant="primary" buttonStyle="rightIcon">
        Create
        <PencilIcon className="h-4 w-4 text-white" />
      </Button>
      <CustomDocumentDrawer open={showDrawer} onClose={handleCloseDrawer} />
    </>
  );
};

export default CreateCustomDocumentButton;
