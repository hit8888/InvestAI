import CustomVideoPlayer from '@breakout/design-system/components/layout/CustomVideoPlayer';
import { CommonDataSourceResponse, DataSourceArtifactsResponse } from '@meaku/core/types/admin/admin';
import { DataSourceItem } from '@meaku/core/types/admin/api';
import RelevantQueriesSectionDrawer from './RelevantQueriesSectionDrawer';
import DescriptionSectionEditDrawer from './DescriptionSectionEditDrawer';
import TitleSectionEditDrawer from './TitleSectionEditDrawer';
import { useState } from 'react';
import Button from '@breakout/design-system/components/Button/index';
import { updateArtifact } from '@meaku/core/adminHttp/api';
import { useDataSourceTableStore } from '../../../stores/useDataSourceTableStore';
import { toast } from 'react-hot-toast';
import { PlusIcon, Loader2Icon } from 'lucide-react';
import { useDataSourceForm } from '../../../hooks/useDataSourceForm';

type DisplayAndEditDataSourceDetailsProps = {
  selectedDataSources: CommonDataSourceResponse[];
  paginationState: {
    itemIndex: number;
    handleNextItem: () => void;
    handlePreviousItem: () => void;
    isFirstItem: boolean;
    isLastItem: boolean;
  };
};

const DisplayAndEditDataSourceDetails = ({
  selectedDataSources,
  paginationState,
}: DisplayAndEditDataSourceDetailsProps) => {
  const { itemIndex } = paginationState;
  const currentDataSource = selectedDataSources[itemIndex];
  const { title, data, relevant_queries, asset, id } = currentDataSource as DataSourceArtifactsResponse;
  const { type } = asset as DataSourceItem;

  const { watchedValues, setValue, hasFormContentChanged, handleAddQuestion, isDirty } = useDataSourceForm({
    title: title || '',
    data,
    relevant_queries,
  });

  const { updateSingleDataSource } = useDataSourceTableStore();
  const [isSaving, setIsSaving] = useState(false);

  // Combined dirty check
  const hasChanges = isDirty || hasFormContentChanged();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const filteredQueries = watchedValues.relevant_queries.filter((query: string) => query.trim().length > 0);

      await updateArtifact(id, {
        title: watchedValues.title,
        data: watchedValues.data,
        relevant_queries: filteredQueries,
      });

      // Update the data source in the table store
      updateSingleDataSource(id, {
        title: watchedValues.title,
        data: watchedValues.data,
        relevant_queries: filteredQueries,
      });

      toast.success('Your updates have been saved');
    } catch (err) {
      console.error('Error saving data source:', err);
      toast.error('Error saving data source');
    } finally {
      setIsSaving(false);
    }
  };

  const commonProps = {
    title: watchedValues.title,
    data: watchedValues.data,
    type,
    relevant_queries: watchedValues.relevant_queries,
    id,
    setValue,
  };

  return (
    <div className="flex h-full max-h-full w-full flex-col gap-4 overflow-auto p-4" id="datasource-container">
      <AssetDisplaySection asset={asset} />
      <TitleSectionEditDrawer key={`title-${id}`} {...commonProps} />
      <DescriptionSectionEditDrawer key={`data-${id}`} {...commonProps} />
      <RelevantQueriesSectionDrawer key={`queries-${id}`} {...commonProps} />
      <div className="sticky -bottom-4 flex w-full justify-end bg-white">
        <div className="flex w-full justify-between py-3">
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
            onClick={handleSave}
            disabled={isSaving || !hasChanges}
            leftIcon={isSaving ? <Loader2Icon className="h-4 w-4 animate-spin" /> : undefined}
          >
            {isSaving ? 'Saving ...' : 'Save'}
          </Button>
        </div>
      </div>
    </div>
  );
};

type AssetDisplaySectionProps = {
  asset: DataSourceItem;
};

const AssetDisplaySection = ({ asset }: AssetDisplaySectionProps) => {
  const { public_url, type, name } = asset as DataSourceItem;

  if (type === 'VIDEO') {
    return (
      <CustomVideoPlayer
        allowPictureInPicture={false}
        className="rounded-lg ring-2 ring-gray-200"
        videoURL={public_url}
      />
    );
  }
  if (type === 'IMAGE') {
    return <img src={public_url} alt={name} className="rounded-lg ring-2 ring-gray-200" />;
  }
  return null;
};

export default DisplayAndEditDataSourceDetails;
