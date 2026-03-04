import {
  DATA_SOURCES_COMMON_COLUMN_HEADER_LABEL_MAPPING,
  DATA_SOURCES_COMMON_COLUMN_LISTS,
  SourcesCardTypes,
  SourcesUploadStatus,
} from './constants';
import SlidesSourcesIcon from '@breakout/design-system/components/icons/sources-slides-icon';
import SourcesUrlLinkIcon from '@breakout/design-system/components/icons/sources-url-link-icon';
import SourceFileIcon from '@breakout/design-system/components/icons/source-file-icon';
import SourceVideoIcon from '@breakout/design-system/components/icons/source-video-icon';
import { DataSourceFeaturesData, DataSourceOverviewData } from '@neuraltrade/core/types/admin/admin';
import DateUtil from '@neuraltrade/core/utils/dateUtils';
import { DataSourceItem, DataSourcesAccessorFnType } from '@neuraltrade/core/types/admin/api';

export type CommonEditDrawerSectionProps = {
  id: number;
  type: string;
  title: string;
  data: string;
  relevant_queries: string[];
};

// const TableColumnWidthSize = 200;
const { WEBPAGES, DOCUMENTS, VIDEOS, SLIDES } = SourcesCardTypes;

export const getIncludedSourceLabel = (selectedType: string | null) => {
  switch (selectedType) {
    case WEBPAGES:
      return {
        label: 'Links',
        icon: SourcesUrlLinkIcon,
      };
    case DOCUMENTS:
      return {
        label: 'Documents',
        icon: SourceFileIcon,
      };
    case VIDEOS:
      return {
        label: 'Videos',
        icon: SourceVideoIcon,
      };
    case SLIDES:
      return {
        label: 'Slides',
        icon: SlidesSourcesIcon,
      };
    default:
      return {
        label: '',
        icon: '',
      };
  }
};

const getDataSourceID = (key: string) => {
  switch (key) {
    case 'name':
      return 'source_name';
    case 'data':
      return 'description';
    default:
      return key;
  }
};
// Convert column list to the required format
export const getDataSourcesFormattedColumnsList = (pageType: string) => {
  const columnsList = DATA_SOURCES_COMMON_COLUMN_LISTS[pageType as keyof typeof DATA_SOURCES_COMMON_COLUMN_LISTS];
  const columnHeaderLabelMapping =
    DATA_SOURCES_COMMON_COLUMN_HEADER_LABEL_MAPPING[
      pageType as keyof typeof DATA_SOURCES_COMMON_COLUMN_HEADER_LABEL_MAPPING
    ];
  const formattedColumns = columnsList.map((key) => {
    const newItem = {
      id: getDataSourceID(key),
      accessorKey: key,
      header: columnHeaderLabelMapping[key as keyof typeof columnHeaderLabelMapping],
      ...(key === 'data' && {
        accessorFn: (row: DataSourcesAccessorFnType) => ({
          description: row.data || '',
          title: row.title || '',
          labelled_by_name: row.labelled_by_name || '',
        }),
      }),
      ...(key === 'access_type' && {
        accessorFn: (row: DataSourcesAccessorFnType) => ({
          access_type: row.access_type || '',
          id: row.id,
          file_type: row.data_source_type || '',
        }),
      }),
      ...(key === 'asset' && {
        accessorFn: (row: DataSourcesAccessorFnType) => ({ ...row.asset, metadata: { ...row.thumbnail } }),
      }),
      ...(key === 'duration' && {
        accessorFn: (row: DataSourcesAccessorFnType) => row.asset?.public_url || '',
      }),
      ...(key === 'name' && {
        accessorFn: (row: DataSourcesAccessorFnType) => ({
          name: row?.asset?.name || row?.title || '',
          url: row?.asset?.public_url || '',
        }),
      }),
    };

    return newItem;
  });
  return formattedColumns;
};

// Helper function to generate stats for DataSourceCard from DataSourceOverviewData
export const generateDataSourceStats = (
  data: DataSourceOverviewData | null | undefined,
): { itemLabel: string; itemValue: string; itemKey: SourcesUploadStatus }[] => {
  if (!data) {
    return [{ itemLabel: 'Total:', itemValue: '0', itemKey: SourcesUploadStatus.UPLOADED }];
  }

  const stats: { itemLabel: string; itemValue: string; itemKey: SourcesUploadStatus }[] = [];

  // Main stat (Uploaded/Total)
  if (typeof data.total_count === 'number') {
    const mainValue = data.total_count.toString();
    let mainLabel = 'Total:'; // Default label

    // Apply new logic for mainLabel based on data_sources_count
    if (typeof data.data_sources_count === 'number') {
      if (data.data_sources_count > 1) {
        // If 0, or > 1, use "X Sources:"
        mainLabel = `${data.data_sources_count} Sources:`;
      }
      // If data.data_sources_count is 1, mainLabel remains 'Total:'
    }
    // If data.data_sources_count is undefined, mainLabel also remains 'Total:'

    stats.push({
      itemLabel: mainLabel,
      itemValue: mainValue,
      itemKey: SourcesUploadStatus.UPLOADED,
    });
  } else if (typeof data.data_sources_count === 'number') {
    // Fallback if total_count is not available, but data_sources_count is.
    let itemLabelForFallback;
    if (data.data_sources_count === 1) {
      itemLabelForFallback = 'Total:';
    } else {
      // For 0, or > 1
      itemLabelForFallback = `${data.data_sources_count} Sources:`;
    }
    stats.push({
      itemLabel: itemLabelForFallback,
      itemValue: data.data_sources_count.toString(),
      itemKey: SourcesUploadStatus.UPLOADED,
    });
  }

  // Pending stat
  if (typeof data.pending_count === 'number' && data.pending_count > 0) {
    stats.push({
      itemLabel: '', // Empty label for pending count
      itemValue: data.pending_count.toString(),
      itemKey: SourcesUploadStatus.UPLOAD_IN_PROGRESS,
    });
  }

  if (stats.length === 0) {
    return [{ itemLabel: 'Total:', itemValue: '0', itemKey: SourcesUploadStatus.UPLOADED }];
  }

  return stats;
};

// Helper function to generate stats for a single feature asset
export const generateFeatureAssetStats = (
  feature: DataSourceFeaturesData,
): { itemLabel: string; itemValue: string; itemKey: SourcesUploadStatus }[] => {
  const stats: { itemLabel: string; itemValue: string; itemKey: SourcesUploadStatus }[] = [];

  if (typeof feature.frames_count === 'number') {
    stats.push({
      itemLabel: 'Frames:',
      itemValue: feature.frames_count.toString(),
      itemKey: SourcesUploadStatus.FRAMES_COUNT,
    });
  }

  if (feature.updated_on) {
    stats.push({
      itemLabel: 'Updated on:',
      itemValue: DateUtil.formatDateInMMDDYY(feature.updated_on),
      itemKey: SourcesUploadStatus.UPLOADED,
    });
  }

  // Fallback if no specific stats can be generated from the feature data
  if (stats.length === 0) {
    return [{ itemLabel: 'Info:', itemValue: 'Data not available', itemKey: SourcesUploadStatus.UPLOADED }];
  }

  return stats;
};

export const getSingleSourceItemVideoUrl = (item: DataSourceItem | File) => {
  const isFile = item instanceof File;
  if (isFile) {
    return URL.createObjectURL(item);
  }
  return (item as DataSourceItem).public_url;
};

export const getSingleSourceItemTypeAndName = (item: DataSourceItem | File) => {
  const isFile = item instanceof File;
  if (isFile) {
    return {
      type: item.type,
      name: item.name,
    };
  }
  return {
    type: (item as DataSourceItem).type,
    name: (item as DataSourceItem).name,
  };
};
