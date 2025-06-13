import { useEffect, useState } from 'react';
import RelevantQueriesSectionDrawer from './RelevantQueriesSectionDrawer';
import { useDataSourceTableStore } from '../../../stores/useDataSourceTableStore';
import DocumentCreationHeader from './DocumentCreationHeader';
import DocumentCreationTitleAndDescription from './DocumentCreationTitleAndDescription';
import {
  CUSTOM_DOCUMENT_DEFAULT_SOURCE,
  CUSTOM_DOCUMENT_DEFAULT_TITLE,
  CUSTOM_DOCUMENT_DEFAULT_DESCRIPTION,
} from '../../../utils/constants';

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

  const [titleHeader, setTitleHeader] = useState(title || CUSTOM_DOCUMENT_DEFAULT_TITLE);
  const [description, setDescription] = useState(data || CUSTOM_DOCUMENT_DEFAULT_DESCRIPTION);
  const [updatedRelevantQueries, setUpdatedRelevantQueries] = useState<string[]>(relevant_queries);

  const handleUpdateRelevantQueries = (relevant_queries: string[]) => {
    setUpdatedRelevantQueries(relevant_queries);
  };

  useEffect(() => {
    if (relevant_queries.length > 0) {
      setUpdatedRelevantQueries(relevant_queries);
    }
  }, [relevant_queries]);

  const checkIfTitleIsChanged = title !== titleHeader;
  const checkIfDescriptionIsChanged = data !== description;
  const checkIfRelevantQueriesAreChanged =
    relevant_queries.length !== updatedRelevantQueries.length ||
    relevant_queries.some((query, index) => query !== updatedRelevantQueries[index]);

  const queryProps = {
    id,
    type: 'DOCUMENT',
    title: checkIfTitleIsChanged ? titleHeader : title || '',
    data: checkIfDescriptionIsChanged ? description : data || '',
    relevant_queries: checkIfRelevantQueriesAreChanged ? updatedRelevantQueries : relevant_queries,
  };

  const checkIfAnyFieldIsChanged =
    checkIfTitleIsChanged || checkIfDescriptionIsChanged || checkIfRelevantQueriesAreChanged;

  return (
    <div className="flex h-full w-full flex-col">
      <DocumentCreationHeader
        onClose={onClose}
        {...queryProps}
        isSelected={isSelected}
        checkIfAnyFieldIsChanged={checkIfAnyFieldIsChanged}
      />
      <DocumentCreationTitleAndDescription
        title={titleHeader}
        description={description}
        setTitle={setTitleHeader}
        setDescription={setDescription}
        isSelected={isSelected}
      />
      <div className="p-4">
        <RelevantQueriesSectionDrawer onCallBack={handleUpdateRelevantQueries} {...queryProps} />
      </div>
    </div>
  );
};

export default CustomDocumentDrawerContentContainer;
