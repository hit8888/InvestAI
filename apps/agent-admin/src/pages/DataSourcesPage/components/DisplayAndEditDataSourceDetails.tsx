import CustomVideoPlayer from '@breakout/design-system/components/layout/CustomVideoPlayer';
import { CommonDataSourceResponse, DataSourceArtifactsResponse } from '@meaku/core/types/admin/admin';
import { DataSourceItem } from '@meaku/core/types/admin/api';
import RelevantQueriesSectionEditDrawer from './RelevantQueriesSectionEditDrawer';
import DescriptionSectionEditDrawer from './DescriptionSectionEditDrawer';
import TitleSectionEditDrawer from './TitleSectionEditDrawer';

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

  const commonProps = {
    title,
    data,
    type,
    relevant_queries,
    id,
  };

  return (
    <div className="flex max-h-[calc(100vh-100px)] w-full flex-col gap-4 overflow-auto p-4">
      <AssetDisplaySection asset={asset} />
      <TitleSectionEditDrawer key={title} {...commonProps} />
      <DescriptionSectionEditDrawer key={data} {...commonProps} />
      <RelevantQueriesSectionEditDrawer key={relevant_queries.join(',')} {...commonProps} />
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
