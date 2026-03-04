import { useMemo } from 'react';
import { Block } from '@neuraltrade/core/types/admin/api';
import BlockPageLayout from './components/BlockPageLayout';
import { useBlockPageState } from './hooks/useBlockPageState';
import VideoLibraryBlockPreviewContent from './VideoLibraryBlockPreviewContent';
import { DataSourceArtifactsTableResponse } from '@neuraltrade/core/types/admin/admin';
import useDataSourceTableViewQuery from '../../queries/query/useDataSourceTableViewQuery';
import { SECTION_READY_TO_DISPLAY_CONTENT } from './utils/blockHelpers';
import SectionReadyToDisplayContent from './components/SectionReadyToDisplayContent';
import useDataSourceOverviewDataQuery from '../../queries/query/useDataSourcesOverviewDataQuery';
import { useQueryOptions } from '../../hooks/useQueryOptions';

interface VideoLibraryBlockPageProps {
  block: Block;
}

/**
 * VideoLibraryBlockPage - Manages Video Library block configuration
 *
 * Uses the generic useBlockPageState hook and BlockPageLayout component
 * for a clean, DRY implementation.
 */
const VideoLibraryBlockPage = ({ block }: VideoLibraryBlockPageProps) => {
  const {
    blockVisibilityData,
    pageVisibilityRules,
    handleBlockVisibilityChange,
    handlePageVisibilityChange,
    handleSave,
    isLoading,
  } = useBlockPageState({
    block,
  });

  const queryOptions = useQueryOptions({ enabled: true });

  const { data: dataSourcesData, isLoading: isDataSourceOverviewDataLoading } = useDataSourceOverviewDataQuery({
    queryOptions,
  });

  const payloadData = useMemo(() => {
    return {
      filters: [
        {
          field: 'data_source_type',
          value: ['VIDEO', 'YOUTUBE', 'VIMEO', 'WISTIA'],
          operator: 'in' as const,
        },
      ],
      sort: [],
      page: 1,
      page_size: 10, // defaults to 10, just for displaying purpose
      search: '',
    };
  }, []);

  const { data: tableData, isLoading: tableDataLoading } = useDataSourceTableViewQuery({
    payload: payloadData,
    tableKey: 'videos',
    queryOptions: {
      enabled: true,
    },
  });

  const videoLists = useMemo(() => {
    if (!tableData) return [];
    const artifactsData = tableData as DataSourceArtifactsTableResponse;
    return artifactsData.results.map((item) => ({
      ...item.asset,
      name: item.title || item.asset.name || '',
      thumbnail_url: item.thumbnail?.asset_url,
    }));
  }, [tableData]);

  return (
    <BlockPageLayout
      blockType="Video Library"
      blockVisibilityData={blockVisibilityData}
      pageVisibilityRules={pageVisibilityRules}
      onBlockVisibilityChange={handleBlockVisibilityChange}
      onPageVisibilityChange={handlePageVisibilityChange}
      onSave={handleSave}
      isLoading={isLoading || tableDataLoading || isDataSourceOverviewDataLoading}
      showDescription={true}
      previewContent={
        <VideoLibraryBlockPreviewContent
          videoLists={videoLists}
          description={blockVisibilityData.description}
          tableDataLoading={tableDataLoading}
          iconUrl={blockVisibilityData.iconUrl}
          headerText={blockVisibilityData.title}
        />
      }
      previewContainerClassname="min-h-[200px] w-96 min-w-[40%] bg-white"
      outerClassname="min-h-screen"
    >
      <SectionReadyToDisplayContent
        {...SECTION_READY_TO_DISPLAY_CONTENT.VIDEO_LIBRARY}
        videoCount={dataSourcesData?.VIDEO?.total_count ?? 0}
      />
    </BlockPageLayout>
  );
};

export default VideoLibraryBlockPage;
