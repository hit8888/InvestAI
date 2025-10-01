import { useState } from 'react';
import SuccessToastMessage from '@breakout/design-system/components/layout/SuccessToastMessage';
import ErrorToastMessage from '@breakout/design-system/components/layout/ErrorToastMessage';
import { DataSourceItem, ThumbnailAssetData } from '@meaku/core/types/admin/api';

// Generic upload function type that accepts a file and progress callback
export type UploadFunction<T = DataSourceItem | ThumbnailAssetData> = (
  file: File,
  onProgress?: (progress: number) => void,
) => Promise<{ data: T }>;

// Generic response transformer to convert API response to data source format
export type ResponseTransformer<T, R> = (response: T, file: File, index?: number) => R;

// Generic success handler for processing uploaded items
export type SuccessHandler<T> = (items: T[]) => void | Promise<void>;

interface UseGenericFileUploadOptions<TResponse, TTransformed> {
  uploadFunction: UploadFunction<TResponse>;
  responseTransformer?: ResponseTransformer<TResponse, TTransformed>;
  onSuccess?: SuccessHandler<TTransformed>;
  successMessage?: (count: number) => string;
  errorMessage?: (failedCount: number, successCount: number) => string;
}

interface UseGenericFileUploadReturn<TTransformed> {
  uploadProgress: number;
  isUploading: boolean;
  uploadFiles: (files: File[], fileLimit?: number) => Promise<TTransformed[]>;
  uploadSingleFile: (file: File) => Promise<TTransformed | null>;
}

export const useGenericFileUpload = <TResponse = DataSourceItem | ThumbnailAssetData, TTransformed = TResponse>({
  uploadFunction,
  responseTransformer,
  onSuccess,
  successMessage,
  errorMessage,
}: UseGenericFileUploadOptions<TResponse, TTransformed>): UseGenericFileUploadReturn<TTransformed> => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const defaultTransformer: ResponseTransformer<TResponse, TTransformed> = (response) =>
    response as unknown as TTransformed;
  const transformer = responseTransformer || defaultTransformer;

  const uploadSingleFile = async (file: File): Promise<TTransformed | null> => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const response = await uploadFunction(file, (progress) => {
        setUploadProgress(progress);
      });

      const transformedItem = transformer(response.data, file);

      if (onSuccess) {
        await onSuccess([transformedItem]);
      }

      return transformedItem;
    } catch (error) {
      console.error('Upload error:', error);
      ErrorToastMessage({ title: 'Failed to upload file' });
      return null;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const uploadFiles = async (files: File[], fileLimit: number = Infinity): Promise<TTransformed[]> => {
    setUploadProgress(0);
    setIsUploading(true);

    const totalFiles = files.length;
    const progressByFile: number[] = new Array(totalFiles).fill(0);

    if (totalFiles > fileLimit) {
      ErrorToastMessage({ title: `You can only upload ${fileLimit} file(s) at a time` });
      setIsUploading(false);
      return [];
    }

    try {
      // Upload files in parallel and handle partial failures
      const uploadPromises = files.map(async (file, index) => {
        return uploadFunction(file, (progress) => {
          // Update individual file progress
          progressByFile[index] = progress;
          // Calculate total progress by summing up individual progresses
          const totalProgress = progressByFile.reduce((sum, p) => sum + p, 0);
          const overallProgress = totalProgress / totalFiles;
          setUploadProgress(Math.round(overallProgress));
        }).then((response) => {
          // Ensure progress is 100% for this file on completion
          progressByFile[index] = 100;
          const totalProgress = progressByFile.reduce((sum, p) => sum + p, 0);
          const overallProgress = totalProgress / totalFiles;
          setUploadProgress(Math.round(overallProgress));
          return { response: response.data, file, index };
        });
      });

      const results = await Promise.allSettled(uploadPromises);
      const successfulItems = results
        .filter((result) => result.status === 'fulfilled')
        .map((result) => {
          const { response, file, index } = result.value;
          return transformer(response, file, index);
        });

      const failedCount = results.filter((result) => result.status === 'rejected').length;

      // Handle success callback
      if (successfulItems.length > 0 && onSuccess) {
        await onSuccess(successfulItems);
      }

      // Show appropriate toast messages
      if (failedCount === 0 && successfulItems.length > 0) {
        const message = successMessage
          ? successMessage(successfulItems.length)
          : `Successfully uploaded ${successfulItems.length} file(s)`;
        SuccessToastMessage({ title: message });
      } else if (successfulItems.length > 0) {
        const message = errorMessage
          ? errorMessage(failedCount, successfulItems.length)
          : `Uploaded ${successfulItems.length} file(s), but ${failedCount} failed.`;
        ErrorToastMessage({ title: message });
      } else {
        ErrorToastMessage({ title: 'Failed to upload all file(s)' });
      }

      // Log errors for debugging
      results.forEach((result, idx) => {
        if (result.status === 'rejected') {
          console.error(`Upload failed for file: ${files[idx].name}`, result.reason);
        }
      });

      return successfulItems;
    } catch (error) {
      console.error('Upload error:', error);
      ErrorToastMessage({ title: 'Failed to upload file(s)' });
      return [];
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return {
    uploadProgress,
    isUploading,
    uploadFiles,
    uploadSingleFile,
  };
};
