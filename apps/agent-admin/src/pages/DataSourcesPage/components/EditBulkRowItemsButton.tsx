import Button from '@breakout/design-system/components/Button/index';
import { PencilIcon } from 'lucide-react';
import { SourcesCardTypes } from '../constants';
import { useDataSourceTableStore } from '../../../stores/useDataSourceTableStore';

type EditBulkRowItemsButtonProps = {
  selectedType: SourcesCardTypes;
};

const EditBulkRowItemsButton = ({ selectedType }: EditBulkRowItemsButtonProps) => {
  const { selectedIds } = useDataSourceTableStore();

  const areSelectedItems = selectedIds.length > 0;
  if (!areSelectedItems) return null;

  if (selectedType === SourcesCardTypes.WEBPAGES || selectedType === SourcesCardTypes.DOCUMENTS) return null;

  return (
    <div>
      <Button variant="secondary" buttonStyle="rightIcon">
        Edit
        <PencilIcon className="h-4 w-4 text-primary" />
      </Button>
    </div>
  );
};

export default EditBulkRowItemsButton;
