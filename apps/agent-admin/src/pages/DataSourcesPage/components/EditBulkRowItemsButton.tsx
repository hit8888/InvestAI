import Button from '@breakout/design-system/components/Button/index';
import { PencilIcon } from 'lucide-react';
import { SourcesCardTypes } from '../constants';
import { useState } from 'react';
import { useDataSourceTableStore } from '../../../stores/useDataSourceTableStore';
import EditBulkRowItemsDrawer from './EditBulkRowItemsDrawer';

type EditBulkRowItemsButtonProps = {
  selectedType: SourcesCardTypes;
};

const EditBulkRowItemsButton = ({ selectedType }: EditBulkRowItemsButtonProps) => {
  const { deselectAll } = useDataSourceTableStore();
  const [showDrawer, setShowDrawer] = useState(false);

  const handleEditBulkRowItems = () => {
    setShowDrawer(true);
  };

  const handleCloseDrawer = () => {
    setShowDrawer(false);
    deselectAll();
  };

  const { selectedIds } = useDataSourceTableStore();

  const areSelectedItems = selectedIds.length > 0;
  if (!areSelectedItems) return null;

  if (selectedType === SourcesCardTypes.WEBPAGES || selectedType === SourcesCardTypes.DOCUMENTS) return null;

  return (
    <>
      <Button onClick={handleEditBulkRowItems} variant="secondary" buttonStyle="rightIcon">
        Edit
        <PencilIcon className="h-4 w-4 text-primary" />
      </Button>
      <EditBulkRowItemsDrawer open={showDrawer} onClose={handleCloseDrawer} />
    </>
  );
};

export default EditBulkRowItemsButton;
