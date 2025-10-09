import { DataSourceItem } from '@meaku/core/types/admin/api';
import { useEffect, useState } from 'react';

interface FileSizeResult {
  size: number;
  unit: 'KB' | 'MB';
}

const useFileSize = (item: DataSourceItem | File, disableFetch?: boolean) => {
  const [fileSizeInBytes, setFileSizeInBytes] = useState<number>(0);
  const isFile = item instanceof File;

  const fetchFileSize = async (url: string) => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      const contentLength = response.headers.get('content-length');
      if (contentLength) {
        setFileSizeInBytes(parseInt(contentLength));
      }
    } catch (error) {
      console.error('Error fetching file size:', error);
    }
  };

  useEffect(() => {
    if (!(item instanceof File) && item.public_url && !disableFetch) {
      fetchFileSize(item.public_url);
    }
  }, [item, disableFetch]);

  const getFileSize = (): FileSizeResult => {
    const sizeInBytes = isFile ? item.size : fileSizeInBytes;
    const sizeInMB = sizeInBytes / (1024 * 1024);

    if (sizeInMB < 1) {
      const sizeInKB = Math.round(sizeInBytes / 1024);
      return {
        size: sizeInKB,
        unit: 'KB',
      };
    } else {
      return {
        size: Math.round(sizeInMB * 100) / 100, // Round to 2 decimal places
        unit: 'MB',
      };
    }
  };

  return { getFileSize };
};

export default useFileSize;
