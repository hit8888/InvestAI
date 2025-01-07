import { ENV } from '@meaku/core/types/env';
import { UPPERCASE_COLUMN_WORDS } from './constants';

export const isDev = ENV.VITE_APP_ENV !== 'production' && ENV.VITE_APP_ENV !== 'staging';
export const isProduction = ENV.VITE_APP_ENV === 'production';

// Function to trigger the download
export const handleDownload = (fileType: string, linkUrl: string, downloadedFileName: string) => {
  const url = linkUrl;
  if (url) {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.setAttribute('download', `${downloadedFileName}.${fileType}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    alert('Invalid file type selected');
  }
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export const getMappedDataFromResponse = (response: any) => {
  // Mapping logic
  const mappedData = {
    email: response.email,
    name: response.name || 'N/A', // Fallback if name is null
    role: response.role !== 'Unknown' ? response.role : 'N/A', // Handle 'Unknown' role
    company: response.company || 'N/A', // Fallback if company is null
    location: response.country ? `🇪🇸 ${response.country}` : 'Location not specified',
    timestamp: response.created_on
      ? new Date(response.created_on).toISOString().replace('T', ' ').split('.')[0]
      : 'N/A',
    product_of_interest: response.product_interest || 'N/A',
  };

  return mappedData;
};

// TODOS: ( MUST BE DELETED WHEN API INTEGRATIONS ARE DONE ) Function to create MOCK DATA
/* eslint-disable @typescript-eslint/no-explicit-any */
export const getDefaultDataForLeadsPage = (repeatCount: number, mockData: any[]) => {
  return Array(repeatCount).fill(mockData).flat();
};

// Helper function to capitalize specific words
const capitalizeWord = (word: string, capitalizeWords: string[]): string => {
  if (capitalizeWords.includes(word.toLowerCase())) {
    return word.toUpperCase();
  }
  return word.charAt(0).toUpperCase() + word.slice(1);
};

// Convert column list to the required format
export const getFormattedColumnsList = (columnsList: string[], sizeGiven?: number) => {
  const formattedColumns = columnsList.map((key) => {
    const words = key.split('_');
    const header = words.map((word) => capitalizeWord(word, UPPERCASE_COLUMN_WORDS)).join(' ');

    const newItem = {
      id: key,
      accessorKey: key,
      header: header,
    };

    return sizeGiven
      ? {
          ...newItem,
          size: sizeGiven,
        }
      : newItem;
  });
  return formattedColumns;
};
