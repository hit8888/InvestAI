import Button from '@breakout/design-system/components/Button/index';

import Typography from '@breakout/design-system/components/Typography/index';
import { XIcon } from 'lucide-react';

type DocumentCreationHeaderProps = {
  onClose: () => void;
  isEditing: boolean;
};

const DocumentCreationHeader = ({ onClose, isEditing }: DocumentCreationHeaderProps) => {
  return (
    <div className="flex items-center gap-2.5 self-stretch border-b border-gray-200 p-4">
      <Typography variant="title-24" textColor="black" className="flex-1">
        {isEditing ? 'Edit Document' : 'Create Document'}
      </Typography>
      <Button onClick={onClose} variant="tertiary" buttonStyle="icon">
        <XIcon className="h-6 w-6 text-system" />
      </Button>
    </div>
  );
};

export default DocumentCreationHeader;
