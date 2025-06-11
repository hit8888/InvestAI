import { useCreateCustomDocument, useUpdateCustomDocument } from '../../../queries/mutation/useDocumentMutation';
import { toast } from 'react-hot-toast';
import Button from '@breakout/design-system/components/Button/index';
import Typography from '@breakout/design-system/components/Typography/index';
import { XIcon } from 'lucide-react';

type DocumentCreationHeaderProps = {
  onClose: () => void;
  id: number;
  title: string;
  data: string;
  relevant_queries: string[];
  isSelected: boolean;
};

const DocumentCreationHeader = ({
  onClose,
  id,
  title,
  data,
  relevant_queries,
  isSelected,
}: DocumentCreationHeaderProps) => {
  const createCustomDocument = useCreateCustomDocument();
  const updateCustomDocument = useUpdateCustomDocument();

  const handleSaveAndAdd = () => {
    try {
      if (isSelected) {
        updateCustomDocument.mutateAsync({
          id,
          payload: {
            title: title,
            data: data,
            relevant_queries: relevant_queries,
          },
        });
        toast.success('Document updated successfully');
      } else {
        createCustomDocument.mutateAsync({
          title: title,
          data: data,
        });
        toast.success('Document created successfully');
      }
      onClose();
    } catch (error) {
      toast.error('Failed to create document');
      console.error(error);
    }
  };

  return (
    <div className="flex items-center gap-2.5 self-stretch border-b border-gray-200 p-4">
      <Typography variant="title-24" textColor="black" className="flex-1">
        Document creation
      </Typography>
      <Button onClick={handleSaveAndAdd} variant="primary">
        Save & Add
      </Button>
      <Button onClick={onClose} variant="tertiary" buttonStyle="icon">
        <XIcon className="h-6 w-6 text-system" />
      </Button>
    </div>
  );
};

export default DocumentCreationHeader;
