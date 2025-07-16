import { useState } from 'react';
import { fetchSitemapforWebpage } from '@meaku/core/adminHttp/api';
import { FetchSitemapRequest } from '@meaku/core/types/admin/api';
import { useDataSourcesStore } from '../stores/useDataSourcesStore';
import toast from 'react-hot-toast';

interface useSitemapFetchReturn {
  fetchProgress: number;
  isFetching: boolean;
  isFetched: boolean;
  fetchWebpage: (url: string) => Promise<void>;
  resetFetch: () => void;
}

export const useSitemapFetch = (): useSitemapFetchReturn => {
  const [fetchProgress, setFetchProgress] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const [isFetched, setIsFetched] = useState(false);
  const { addMultipleDataSources, removeAllDataSources } = useDataSourcesStore();

  const fetchWebpage = async (url: string): Promise<void> => {
    let progressInterval: NodeJS.Timeout | undefined;
    try {
      setIsFetching(true);
      setFetchProgress(0);

      // Simulate progress for webpage crawling
      progressInterval = setInterval(() => {
        setFetchProgress((prev) => {
          if (prev >= 90) {
            if (progressInterval) {
              clearInterval(progressInterval);
            }
            return prev;
          }
          return prev + 10;
        });
      }, 1000);

      // Call the sitemap API
      const payload: FetchSitemapRequest = { url };
      const response = await fetchSitemapforWebpage(payload);
      const urls: string[] = response.data.urls || [];

      // Map to DataSourceItem[] for the store
      const mappedWebpages = urls.map((url) => ({
        id: url,
        name: url.split('/').pop() || url,
        type: 'webpage',
        key: url,
        public_url: url,
        is_cancelled: false,
      }));

      // Clear existing data sources and add new ones
      removeAllDataSources();
      addMultipleDataSources(mappedWebpages);
      setIsFetched(true);
      setFetchProgress(100);
    } catch (error) {
      console.error('Error fetching webpage:', error);
      toast.error('Error fetching webpage');
    } finally {
      setIsFetching(false);
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      setFetchProgress(0);
    }
  };

  const resetFetch = () => {
    setIsFetched(false);
    removeAllDataSources();
  };

  return {
    fetchProgress,
    isFetching,
    isFetched,
    fetchWebpage,
    resetFetch,
  };
};
