import { useEffect, useState } from 'react';
import RelevantQueriesSectionDrawer from './RelevantQueriesSectionDrawer';
import { useDataSourceTableStore } from '../../../stores/useDataSourceTableStore';
import DocumentCreationHeader from './DocumentCreationHeader';
import DocumentCreationTitleAndDescription from './DocumentCreationTitleAndDescription';

type CustomDocumentDrawerContentContainerProps = {
  onClose: () => void;
};

type SelectedSource = {
  id: number;
  title: string | null;
  data?: string;
  relevant_queries?: string[];
};

// Default values when no source is selected
const defaultSource = {
  id: 0,
  title: '',
  data: '',
  relevant_queries: [],
};

const CustomDocumentDrawerContentContainer = ({ onClose }: CustomDocumentDrawerContentContainerProps) => {
  const { getSelectedDataSources } = useDataSourceTableStore();
  const selectedDataSources = getSelectedDataSources();

  const isSelected = selectedDataSources.length > 0;

  const selectedSource = isSelected ? (selectedDataSources[0] as SelectedSource) : defaultSource;
  const { relevant_queries = [], title = '', data = '', id } = selectedSource;

  const [titleHeader, setTitleHeader] = useState(title || 'Title');
  const [description, setDescription] = useState(data || 'Write your document text…');
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

  return (
    <div className="flex h-full w-full flex-col">
      <DocumentCreationHeader onClose={onClose} {...queryProps} isSelected={isSelected} />
      <div className="flex h-full max-h-[calc(100vh-100px)] flex-col self-stretch overflow-y-auto">
        <DocumentCreationTitleAndDescription
          title={titleHeader}
          description={description}
          setTitle={setTitleHeader}
          setDescription={setDescription}
          isSelected={isSelected}
        />
        {isSelected && (
          <div className="bg-white p-4">
            <RelevantQueriesSectionDrawer onCallBack={handleUpdateRelevantQueries} {...queryProps} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomDocumentDrawerContentContainer;
