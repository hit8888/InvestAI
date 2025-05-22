import { useState } from 'react';
import toast from 'react-hot-toast';
import { useDataSourcesStore } from '../stores/useDataSourcesStore';
import { uploadAssetsFile } from '@meaku/core/adminHttp/api';

interface UseFileUploadReturn {
  uploadProgress: number;
  uploadFiles: (files: File[]) => Promise<void>;
}

export const useFileUpload = (): UseFileUploadReturn => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const { addMultipleDataSources } = useDataSourcesStore();

  const uploadFiles = async (files: File[]): Promise<void> => {
    setUploadProgress(0);
    const totalFiles = files.length;
    let completedFiles = 0;
    let totalProgress = 0;

    try {
      // Upload files in parallel and handle partial failures
      const uploadPromises = files.map(async (file) => {
        return uploadAssetsFile(file, (progress) => {
          // Calculate combined progress
          const fileProgress = progress / totalFiles; // Each file contributes 1/totalFiles to overall progress
          const previousProgress = (completedFiles * 100) / totalFiles; // Progress from completed files
          totalProgress = previousProgress + fileProgress;
          setUploadProgress(Math.round(totalProgress));
        }).then((response) => {
          completedFiles++;
          return response;
        });
      });

      const results = await Promise.allSettled(uploadPromises);
      const successfulItems = results
        .filter((result) => result.status === 'fulfilled')
        .map((result) => (result.status === 'fulfilled' ? result.value.data : null));
      const failedCount = results.filter((result) => result.status === 'rejected').length;

      if (successfulItems.length > 0) {
        addMultipleDataSources(successfulItems);
      }

      if (failedCount === 0) {
        toast.success(`Successfully uploaded all ${successfulItems.length} file(s)`);
      } else if (successfulItems.length > 0) {
        toast.error(`Uploaded ${successfulItems.length} file(s), but ${failedCount} failed.`);
      } else {
        toast.error('Failed to upload all file(s)');
      }

      // Optionally log errors for debugging
      results.forEach((result, idx) => {
        if (result.status === 'rejected') {
          console.error(`Upload failed for file: ${files[idx].name}`, result.reason);
        }
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload file(s)');
    } finally {
      setUploadProgress(0);
    }
  };

  return {
    uploadProgress,
    uploadFiles,
  };
};
