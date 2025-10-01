import { useDataSourcesStore } from '../stores/useDataSourcesStore';
import { uploadAssetsFile } from '@meaku/core/adminHttp/api';
import { useGenericFileUpload } from './useGenericFileUpload';
import { DataSourceItem } from '@meaku/core/types/admin/api';

interface UseFileUploadReturn {
  uploadProgress: number;
  uploadFiles: (files: File[], fileLimit: number) => Promise<void>;
}

export const useFileUpload = (): UseFileUploadReturn => {
  const { addMultipleDataSources } = useDataSourcesStore();

  const { uploadProgress, uploadFiles: genericUploadFiles } = useGenericFileUpload<DataSourceItem, DataSourceItem>({
    uploadFunction: uploadAssetsFile,
    responseTransformer: (response) => response, // uploadAssetsFile already returns DataSourceItem format
    onSuccess: (items) => {
      addMultipleDataSources(items);
    },
    successMessage: (count) => `Successfully uploaded all ${count} file(s)`,
    errorMessage: (failedCount, successCount) => `Uploaded ${successCount} file(s), but ${failedCount} failed.`,
  });

  const uploadFiles = async (files: File[], fileLimit: number): Promise<void> => {
    await genericUploadFiles(files, fileLimit);
  };

  return {
    uploadProgress,
    uploadFiles,
  };
};
