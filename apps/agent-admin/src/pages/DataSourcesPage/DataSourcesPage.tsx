import {
  ARTIFACTS_SOURCES_TITLE,
  DEMO_ASSETS_SOURCES_TITLE,
  DOCUMENTS_TITLE,
  KNOWLEDGE_SOURCES_TITLE,
  SLIDES_TITLE,
  SourcesCardTypes,
  VIDEO_TITLE,
  WEBPAGES_TITLE,
} from './constants';
import SourceCard from './components/SourceCard';
import DataSourceCard from './components/DataSourceCard';
import { useDataSources } from '../../context/DataSourcesContext';
import DataSourcesNavigation from './components/DataSourcesNavigation';
import CommonUploadDataSourcesButton from './components/CommonUploadDataSourcesButton';
import PageContainer from '../../components/AgentManagement/PageContainer';
import DataSourceTableContainer from './components/DataSourceTableContainer';
import useDataSourceOverviewDataQuery from '../../queries/query/useDataSourcesOverviewDataQuery';
import { useQueryOptions } from '../../hooks/useQueryOptions';
import { DataSourceFeaturesData, DataSourceOverviewData } from '@meaku/core/types/admin/admin';
import { generateDataSourceStats, generateFeatureAssetStats } from './utils';
import { DataSourcesDrawerProvider } from '../../context/DataSourcesDrawerContext';
import CreateCustomDocumentButton from './components/CreateCustomDocumentButton';
import { useEffect } from 'react';
import { DOCUMENTS_PAGE } from '../../../../../packages/core/src';
import { useParams } from 'react-router-dom';

const DataSourcesPage = () => {
  const { selectedType } = useDataSources();
  const queryOptions = useQueryOptions({ enabled: selectedType === null });

  const { webPageID, documentID } = useParams();
  const isSingleItemView = !!webPageID || !!documentID;

  const {
    data: dataSourcesData,
    isLoading,
    error,
    refetch,
  } = useDataSourceOverviewDataQuery({
    queryOptions,
  });

  // Refetch data when selectedType changes (when navigating between detail pages)
  useEffect(() => {
    if (selectedType === null) {
      refetch();
    }
  }, [selectedType]);

  const knowledgeSourcesData = {
    WEB_PAGE: dataSourcesData?.WEB_PAGE,
    DOCUMENTS: dataSourcesData?.PDF,
  };

  const artifactsSourcesData = {
    VIDEOS: dataSourcesData?.VIDEO,
    SLIDES: dataSourcesData?.SLIDE,
  };

  const demoAssetsData = {
    FEATURES: dataSourcesData?.FEATURES,
  };

  if (!selectedType) {
    return (
      <PageContainer isLoading={isLoading} error={error} className="max-w-3xl gap-6" heading="Data Sources">
        <KnowledgeSourcesContent dataSourcesData={knowledgeSourcesData} />
        <ArtifactsContent dataSourcesData={artifactsSourcesData} />
        <DemoAssetsContent dataSourcesData={demoAssetsData} />
      </PageContainer>
    );
  }

  const isDocumentsPage = selectedType === DOCUMENTS_PAGE;

  return (
    <div className="flex w-full flex-1 px-14 pt-4">
      <div className="flex flex-1 flex-col items-start gap-4 self-stretch">
        <div className="sticky top-0 z-10 flex w-full items-center gap-6 bg-white pb-1 pt-4">
          <DataSourcesNavigation />
          {!isSingleItemView && <CommonUploadDataSourcesButton />}
          {isDocumentsPage && !isSingleItemView && <CreateCustomDocumentButton />}
        </div>
        <DataSourcesDrawerProvider>
          <DataSourceTableContainer />
        </DataSourcesDrawerProvider>
      </div>
    </div>
  );
};

type KnowledgeSourcesData = {
  dataSourcesData: {
    WEB_PAGE: DataSourceOverviewData | null | undefined;
    DOCUMENTS: DataSourceOverviewData | null | undefined;
  };
};

const KnowledgeSourcesContent = ({ dataSourcesData }: KnowledgeSourcesData) => {
  return (
    <SourceCard cardTitle={KNOWLEDGE_SOURCES_TITLE}>
      <DataSourceCard
        type={SourcesCardTypes.WEBPAGES}
        title={WEBPAGES_TITLE}
        stats={generateDataSourceStats(dataSourcesData.WEB_PAGE)}
      />
      <DataSourceCard
        type={SourcesCardTypes.DOCUMENTS}
        title={DOCUMENTS_TITLE}
        stats={generateDataSourceStats(dataSourcesData.DOCUMENTS)}
      />
    </SourceCard>
  );
};

type ArtifactsSourcesData = {
  dataSourcesData: {
    VIDEOS: DataSourceOverviewData | null | undefined;
    SLIDES: DataSourceOverviewData | null | undefined;
  };
};

const ArtifactsContent = ({ dataSourcesData }: ArtifactsSourcesData) => {
  return (
    <SourceCard cardTitle={ARTIFACTS_SOURCES_TITLE}>
      <DataSourceCard
        type={SourcesCardTypes.VIDEOS}
        title={VIDEO_TITLE}
        stats={generateDataSourceStats(dataSourcesData.VIDEOS)}
      />
      <DataSourceCard
        type={SourcesCardTypes.SLIDES}
        title={SLIDES_TITLE}
        stats={generateDataSourceStats(dataSourcesData.SLIDES)}
      />
    </SourceCard>
  );
};

type DemoAssetsData = {
  dataSourcesData: {
    FEATURES: DataSourceFeaturesData[] | null | undefined;
  };
};

const DemoAssetsContent = ({ dataSourcesData }: DemoAssetsData) => {
  const { FEATURES } = dataSourcesData;

  if (!FEATURES || FEATURES.length === 0) return null;
  return (
    <SourceCard cardTitle={DEMO_ASSETS_SOURCES_TITLE}>
      {FEATURES.map((feature, index) => (
        <DataSourceCard
          key={`${feature.feature_name}-${index}`}
          hasEdit
          type={SourcesCardTypes.FEATURES}
          title={feature.feature_name}
          stats={generateFeatureAssetStats(feature)}
        />
      ))}
    </SourceCard>
  );
};

export default DataSourcesPage;
