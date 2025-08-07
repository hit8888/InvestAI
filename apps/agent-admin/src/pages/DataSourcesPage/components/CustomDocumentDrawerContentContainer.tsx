import RelevantQueriesSectionDrawer from './RelevantQueriesSectionDrawer';
import { useDataSourceTableStore } from '../../../stores/useDataSourceTableStore';
import DocumentCreationHeader from './DocumentCreationHeader';
import DocumentCreationTitleAndDescription from './DocumentCreationTitleAndDescription';
import {
  CUSTOM_DOCUMENT_DEFAULT_SOURCE,
  CUSTOM_DOCUMENT_DEFAULT_TITLE,
  CUSTOM_DOCUMENT_DEFAULT_DESCRIPTION,
} from '../../../utils/constants';
import Button from '@breakout/design-system/components/Button/index';
import { PlusIcon } from 'lucide-react';
import { useCreateCustomDocument, useUpdateCustomDocument } from '../../../queries/mutation/useDocumentMutation';
import toast from 'react-hot-toast';
import { useDataSourceForm } from '../../../hooks/useDataSourceForm';

type CustomDocumentDrawerContentContainerProps = {
  onClose: () => void;
  isClickedOnCreateButton?: boolean;
};

type SelectedSource = {
  id: number;
  title: string | null;
  data?: string;
  relevant_queries?: string[];
};

const CustomDocumentDrawerContentContainer = ({
  onClose,
  isClickedOnCreateButton,
}: CustomDocumentDrawerContentContainerProps) => {
  const { getSelectedDataSources } = useDataSourceTableStore();
  const selectedDataSources = getSelectedDataSources();

  // If the drawer is opened from the create button, then the selected data sources will be empty
  const isSelected = selectedDataSources.length > 0 && !isClickedOnCreateButton;

  const selectedSource = isSelected ? (selectedDataSources[0] as SelectedSource) : CUSTOM_DOCUMENT_DEFAULT_SOURCE;
  const { relevant_queries = [], title = '', data = '', id } = selectedSource;

  const { watchedValues, setValue, hasFormContentChanged, handleAddQuestion, control } = useDataSourceForm({
    title: title || '',
    data: data || '',
    relevant_queries,
    defaultTitle: CUSTOM_DOCUMENT_DEFAULT_TITLE,
    defaultData: CUSTOM_DOCUMENT_DEFAULT_DESCRIPTION,
  });

  const checkIfAnyFieldIsChanged = hasFormContentChanged();

  const commonProps = {
    title: watchedValues.title,
    data: watchedValues.data,
    type: 'DOCUMENT',
    relevant_queries: watchedValues.relevant_queries,
    id,
    setValue,
  };

  const { mutateAsync: createCustomDocument, isPending: isCreating } = useCreateCustomDocument();
  const { mutateAsync: updateCustomDocument, isPending: isUpdating } = useUpdateCustomDocument();

  const handleSaveAndAdd = async () => {
    if (watchedValues.title === '') {
      toast.error('Title is required');
      return;
    }

    if (watchedValues.data === '') {
      toast.error('Description is required');
      return;
    }

    const payload = {
      title: watchedValues.title,
      data: watchedValues.data,
      relevant_queries: watchedValues.relevant_queries.filter((q) => !!q.trim()),
    };

    try {
      if (isSelected && checkIfAnyFieldIsChanged) {
        await updateCustomDocument({
          id,
          payload,
        });
        toast.success('Document updated successfully');
      } else if (!isSelected && checkIfAnyFieldIsChanged) {
        await createCustomDocument(payload);
        toast.success('Document created successfully');
      }

      onClose();
    } catch (error) {
      toast.error('Failed to create document');
      console.error(error);
    }
  };

  const getSubmitLabel = () => {
    if (isCreating) return 'Creating ...';
    if (isUpdating) return 'Saving ...';
    return isSelected ? 'Save' : 'Create';
  };

  return (
    <div className="flex h-full w-full flex-col overflow-auto">
      <DocumentCreationHeader isEditing={isSelected} onClose={onClose} />
      <div
        className="flex max-h-[calc(100vh-65px)] w-full flex-1 flex-col gap-4 overflow-auto p-4 pb-0"
        id="datasource-container"
      >
        <DocumentCreationTitleAndDescription title={watchedValues.title} control={control} isSelected={isSelected} />
        <RelevantQueriesSectionDrawer key={`queries-${id}`} {...commonProps} />
        <div className="sticky bottom-0 -ml-3.5 flex w-[calc(100%+28px)] justify-between bg-white p-3">
          <Button
            variant="secondary"
            onClick={handleAddQuestion}
            leftIcon={<PlusIcon className="h-4 w-4" />}
            disabled={
              !watchedValues.relevant_queries[watchedValues.relevant_queries.length - 1] ||
              watchedValues.relevant_queries[watchedValues.relevant_queries.length - 1].trim() === ''
            }
          >
            Add Question
          </Button>
          <Button
            variant="primary"
            onClick={handleSaveAndAdd}
            disabled={
              isCreating ||
              isUpdating ||
              !checkIfAnyFieldIsChanged ||
              watchedValues.title === '' ||
              watchedValues.data === ''
            }
            className="gap-3"
          >
            {getSubmitLabel()}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CustomDocumentDrawerContentContainer;
