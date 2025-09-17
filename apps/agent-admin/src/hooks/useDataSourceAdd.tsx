import { useState } from 'react';
import { useDataSourcesStore } from '../stores/useDataSourcesStore';
import { SourcesCardTypes } from '../pages/DataSourcesPage/constants';
import { addWebpagesSitemapLinks, bulkAddArtifacts, bulkAddDocuments } from '@meaku/core/adminHttp/api';
import ErrorToastMessage from '@breakout/design-system/components/layout/ErrorToastMessage';
import { useQueryClient } from '@tanstack/react-query';
import SuccessToastMessage from '@breakout/design-system/components/layout/SuccessToastMessage';
interface UseDataSourceAddReturn {
  isAdding: boolean;
  addDataSources: (mainUrl?: string) => Promise<void>;
}

export const useDataSourceAdd = (selectedType: string | null, mainUrl?: string): UseDataSourceAddReturn => {
  const [isAdding, setIsAdding] = useState(false);
  const { dataSources } = useDataSourcesStore();
  const queryClient = useQueryClient();

  const addDataSources = async (): Promise<void> => {
    if (!dataSources.length) return;

    setIsAdding(true);
    try {
      switch (selectedType) {
        case SourcesCardTypes.WEBPAGES:
          if (!mainUrl) {
            throw new Error('Main URL is required for webpage sources');
          }
          await addWebpagesSitemapLinks({
            main_url: mainUrl,
            urls: dataSources.filter((source) => !source.is_cancelled).map((source) => source.public_url),
            cancelled_urls: dataSources.filter((source) => source.is_cancelled).map((source) => source.public_url),
          });
          queryClient.invalidateQueries({ queryKey: ['data-source-table'] });
          SuccessToastMessage({
            title: 'Successfully added webpage sources',
          });
          break;

        case SourcesCardTypes.DOCUMENTS:
          await bulkAddDocuments(
            dataSources.map((source) => ({
              asset: source.id,
            })),
          );
          queryClient.invalidateQueries({ queryKey: ['data-source-table'] });
          SuccessToastMessage({
            title: 'Successfully added document sources',
          });
          break;

        case SourcesCardTypes.VIDEOS:
        case SourcesCardTypes.SLIDES: {
          const dataSourceType = selectedType === SourcesCardTypes.VIDEOS ? 'VIDEO' : 'SLIDE';
          await bulkAddArtifacts(
            dataSources.map((source) => ({
              asset: source.id,
              data_source_type: dataSourceType,
            })),
          );
          queryClient.invalidateQueries({ queryKey: ['data-source-table'] });
          SuccessToastMessage({
            title: 'Successfully added artifact sources',
          });
          break;
        }

        default:
          throw new Error('Unsupported data source type');
      }
    } catch (error) {
      console.error('Error adding data sources:', error);

      // Handle specific error cases
      if (error instanceof Error) {
        if (error.message.includes('required')) {
          ErrorToastMessage({
            title: 'Required fields are missing. Please check your input.',
          });
        } else if (error.message.includes('already exists')) {
          ErrorToastMessage({
            title: 'Some sources already exist in the system.',
          });
        } else {
          ErrorToastMessage({
            title: 'Failed to add sources. Please try again.',
          });
        }
      } else {
        // Generic error handling
        ErrorToastMessage({
          title: 'An unexpected error occurred. Please try again.',
        });
      }
    } finally {
      setIsAdding(false);
    }
  };

  return {
    isAdding,
    addDataSources,
  };
};
