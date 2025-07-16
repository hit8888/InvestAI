import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, Download, FileText, Loader } from 'lucide-react';
import Typography from '@breakout/design-system/components/Typography/index';
import BrandingSectionContainer from './BrandingSectionContainer';
import CardTitleAndDescription from './CardTitleAndDescription';
import {
  DataSourceResult,
  isInfiniteDataSources,
  useInfiniteDataSourcesQuery,
} from '../../queries/query/useDataSourcesQuery';
import useLlmsTxtDetailsQuery from '../../queries/query/useLlmsTxtDetailsQuery';
import { useDownloadLlmsTxt, useGenerateLlmsTxt } from '../../queries/mutation/useLlmsTxtMutations';
import { toast } from 'react-hot-toast';
import Button from '@breakout/design-system/components/Button/index';
import AgentDropdown from '@breakout/design-system/components/Dropdown/AgentDropdown';
import { isAxiosError } from 'axios';

const POLLING_INTERVAL_MS = 5000;
const MAX_PAGES_FOR_GENERATION = 5000;

const LLMsTxtContainer = () => {
  const [selectedDataSourceId, setSelectedDataSourceId] = useState<number | null>(null);
  const [pollingInterval, setPollingInterval] = useState<number | false>(false);
  const [allDataSources, setAllDataSources] = useState<DataSourceResult[]>([]);

  // Query for WEB_PAGE data sources with pagination
  const { data: infiniteDataSources, isLoading: isLoadingDataSources } = useInfiniteDataSourcesQuery({
    payload: {
      filters: [
        {
          field: 'data_source_type',
          operator: 'eq',
          value: 'WEB_PAGE',
        },
      ],
      sort: [
        {
          field: 'created_on',
          order: 'asc',
        },
      ],
      page_size: 50,
      page: 1,
    },
    queryOptions: {
      enabled: true,
    },
  });

  // Query for LLMs.txt details
  const { data: llmsTxtDetails, isLoading: isLoadingDetails } = useLlmsTxtDetailsQuery({
    dataSourceId: selectedDataSourceId ?? 0,
    queryOptions: {
      enabled: selectedDataSourceId !== null,
      refetchInterval: pollingInterval,
    },
  });

  // Mutations
  const generateMutation = useGenerateLlmsTxt();
  const downloadMutation = useDownloadLlmsTxt();

  // Effect to accumulate all data sources from pagination
  useEffect(() => {
    if (isInfiniteDataSources(infiniteDataSources)) {
      const all = infiniteDataSources.pages.flatMap((page) => page.results);
      setAllDataSources(all);
    }
  }, [infiniteDataSources]);

  // Effect to set the first completed WEB_PAGE data source as selected
  useEffect(() => {
    if (allDataSources.length > 0 && !selectedDataSourceId) {
      // Select the first completed WEB_PAGE data source, or the first one if none are completed
      setSelectedDataSourceId(allDataSources[0].id);
    }
  }, [allDataSources, selectedDataSourceId]);

  // Effect to handle polling for in-progress status
  useEffect(() => {
    if (llmsTxtDetails?.exists && llmsTxtDetails?.status === 'in_progress') {
      setPollingInterval(POLLING_INTERVAL_MS);
    } else {
      setPollingInterval(false);
    }
  }, [llmsTxtDetails]);

  const handleGenerate = async () => {
    if (!selectedDataSourceId) {
      toast.error('No data source selected');
      return;
    }
    try {
      await generateMutation.mutateAsync({ data_source_id: selectedDataSourceId, max_pages: MAX_PAGES_FOR_GENERATION });
      toast.success('LLMs.txt generation started');
    } catch (error) {
      if (
        isAxiosError(error) &&
        error.response?.status === 409 &&
        error.response.data?.error === 'workflow already running'
      ) {
        toast.error('LLMs.txt generation is already in progress');
      } else {
        toast.error('Failed to start LLMs.txt generation');
      }
    }
  };

  const handleDownload = async () => {
    if (!selectedDataSourceId) {
      toast.error('No data source selected');
      return;
    }
    try {
      await downloadMutation.mutateAsync(selectedDataSourceId);
      toast.success('LLMs.txt downloaded successfully');
    } catch (error) {
      toast.error('Failed to download LLMs.txt');
      console.error(error);
    }
  };

  const handleDataSourceSelect = (dataSourceId: number) => {
    setSelectedDataSourceId(dataSourceId);
  };

  // Memoized maps for efficient lookup
  const idToSourceUrlMap = useMemo(() => {
    const map = new Map<number, string>();
    allDataSources.forEach((ds) => map.set(ds.id, ds.source_url));
    return map;
  }, [allDataSources]);
  const sourceUrlToIdMap = useMemo(() => {
    const map = new Map<string, number>();
    allDataSources.forEach((ds) => map.set(ds.source_url, ds.id));
    return map;
  }, [allDataSources]);

  const isLoading = isLoadingDataSources || isLoadingDetails;
  const isGenerating = generateMutation.isPending;
  const isDownloading = downloadMutation.isPending;
  const isInProgress = llmsTxtDetails?.status === 'in_progress';
  const isCompleted = llmsTxtDetails?.exists && llmsTxtDetails?.status === 'completed';
  const hasError = llmsTxtDetails?.status === 'error';

  if (isLoading && allDataSources.length === 0) {
    return (
      <BrandingSectionContainer title="llms.txt">
        <div className="flex w-full flex-1 items-center justify-center py-8">
          <Loader className="h-6 w-6 animate-spin text-gray-500" />
        </div>
      </BrandingSectionContainer>
    );
  }

  if (!allDataSources.length) {
    return (
      <BrandingSectionContainer title="llms.txt">
        <div className="flex w-full flex-1 items-center gap-8 self-stretch">
          <CardTitleAndDescription
            title="No Web Data Sources"
            description="You need to have at least one web data source to generate LLMs.txt files."
            isMandatoryField={false}
          />
        </div>
      </BrandingSectionContainer>
    );
  }

  return (
    <BrandingSectionContainer title="llms.txt">
      <div className="flex w-full flex-1 items-center gap-8 self-stretch">
        <div className="flex flex-1 flex-col items-start gap-4">
          <CardTitleAndDescription
            description="Generate a structured llms.txt file to help answer engines find and cite your best content — boosting your AEO and GEO performance. "
            isMandatoryField={false}
          />
          {/* Data Source Selector */}
          <div className="flex flex-col gap-2">
            <AgentDropdown
              options={allDataSources.map((ds) => ds.source_url)}
              placeholderLabel="Select a data source..."
              onCallback={(selectedSourceUrl) => {
                const id = sourceUrlToIdMap.get(selectedSourceUrl ?? '');
                if (id) handleDataSourceSelect(id);
              }}
              defaultValue={selectedDataSourceId ? idToSourceUrlMap.get(selectedDataSourceId) : undefined}
              className="h-11 w-64 rounded-lg px-2 py-3"
              fontToShown="text-sm"
              showIcon={false}
              dropdownOpenClassName="ring-4 ring-gray-200"
              menuContentAlign="end"
              menuContentSide="bottom"
              menuItemClassName="p-4 lowercase"
              isSearchable={true}
              searchPlaceholder="Search data sources..."
            />
          </div>
        </div>

        <div className="flex flex-1 flex-col items-end gap-4">
          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || isInProgress}
              variant={isCompleted ? 'secondary' : 'primary'}
              size="small"
              className="flex items-center gap-2"
            >
              {isGenerating ? <Loader className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
              {isCompleted ? 'Regenerate' : 'Generate'}
            </Button>

            {isCompleted && (
              <Button
                onClick={handleDownload}
                disabled={isDownloading}
                variant="primary"
                size="small"
                className="flex items-center gap-2"
              >
                {isDownloading ? <Loader className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                Download
              </Button>
            )}
          </div>

          {/* LLMs.txt Status Display */}
          <div className="flex items-center gap-2">
            {isInProgress && (
              <>
                <Loader className="h-4 w-4 animate-spin text-blue-500" />
                <Typography variant="caption-12-normal" className="text-blue-600">
                  Generation in progress...
                  {llmsTxtDetails?.expected_time_left && ` (${llmsTxtDetails.expected_time_left})`}
                </Typography>
              </>
            )}
            {isCompleted && (
              <>
                <FileText className="h-4 w-4 text-green-500" />
                <Typography variant="caption-12-normal" className="text-green-600">
                  LLMs.txt file is ready
                  {llmsTxtDetails?.last_updated &&
                    ` (Updated: ${new Date(llmsTxtDetails.last_updated).toLocaleDateString()})`}
                </Typography>
              </>
            )}
            {hasError && (
              <>
                <AlertCircle className="h-4 w-4 text-red-500" />
                <Typography variant="caption-12-normal" className="text-red-600">
                  Error: {llmsTxtDetails?.error_message || 'Generation failed'}
                </Typography>
              </>
            )}
            {!llmsTxtDetails?.exists && !isInProgress && (
              <Typography variant="caption-12-normal" className="text-gray-500">
                No LLMs.txt file generated yet
              </Typography>
            )}
          </div>
        </div>
      </div>
    </BrandingSectionContainer>
  );
};

export default LLMsTxtContainer;
