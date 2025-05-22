import { useState } from 'react';
import { useDataSourcesStore } from '../stores/useDataSourcesStore';
import { SourcesCardTypes } from '../pages/DataSourcesPage/constants';
import { addWebpagesSitemapLinks, bulkAddDocuments } from '@meaku/core/adminHttp/api';
import toast from 'react-hot-toast';
import ErrorToastMessage from '@breakout/design-system/components/layout/ErrorToastMessage';
import { useQueryClient } from '@tanstack/react-query';
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
            urls: dataSources.map((source) => source.public_url),
          });
          queryClient.invalidateQueries({ queryKey: ['data-source-table'] });
          toast.success('Successfully added webpage sources');
          break;

        case SourcesCardTypes.DOCUMENTS:
          await bulkAddDocuments({
            documents: dataSources.map((source) => ({
              asset: {
                id: source.id,
                name: source.name,
                type: source.type,
                key: source.key,
                public_url: source.public_url,
              },
            })),
          });
          queryClient.invalidateQueries({ queryKey: ['data-source-table'] });
          toast.success('Successfully added document sources');
          break;

        default:
          throw new Error('Unsupported data source type');
      }
    } catch (error) {
      console.error('Error adding data sources:', error);

      // Handle specific error cases
      if (error instanceof Error) {
        if (error.message.includes('required')) {
          toast.custom(<ErrorToastMessage title="Required fields are missing. Please check your input." />);
        } else if (error.message.includes('already exists')) {
          toast.custom(<ErrorToastMessage title="Some sources already exist in the system." />);
        } else {
          toast.custom(<ErrorToastMessage title="Failed to add sources. Please try again." />);
        }
      } else {
        // Generic error handling
        toast.custom(<ErrorToastMessage title="An unexpected error occurred. Please try again." />);
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
