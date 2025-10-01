import SourcesDragDropPattern from '@breakout/design-system/components/icons/sources-dragdrop-patterns';
import { DataSourceItem, ThumbnailAssetData } from '@meaku/core/types/admin/api';
import DragDropClickUploadFiles from './DragDropClickUploadFiles';
import { cn } from '@breakout/design-system/lib/cn';
import { useDataSourcesStore } from '../../../stores/useDataSourcesStore';
import { useEffect, useState } from 'react';
import { useDataSources } from '../../../context/DataSourcesContext';
import Typography from '@breakout/design-system/components/Typography/index';
import useFileSize from '../../../hooks/useFileSize';
import SuccessToastIcon from '@breakout/design-system/components/icons/success-toast-icon';
import { X } from 'lucide-react';
import DeleteDialogWrapper from '@breakout/design-system/components/layout/DeleteDialogWrapper';
import { useGenericFileUpload } from '../../../hooks/useGenericFileUpload';
import { TWO_MB } from '../../../utils/constants';
import { useDeleteThumbnailMutation, useCreateThumbnailMutation } from '../../../queries/mutation/useThumbnailMutation';
import ErrorToastMessage from '@breakout/design-system/components/layout/ErrorToastMessage';

const VIDEO_THUMBNAIL_ACCEPTED_FILES = {
  'image/png': ['.png'],
  'image/jpg': ['.jpg'],
  'image/jpeg': ['.jpeg'],
};

type VideoThumbnailSectionProps = {
  thumbnail: ThumbnailAssetData | null | undefined;
  artifactId: number;
  title: string | null;
};

const VideoThumbnailSection = ({ title, thumbnail, artifactId }: VideoThumbnailSectionProps) => {
  const { dataSources, addDataSource, removeAllDataSources } = useDataSourcesStore();
  const { isUploading } = useDataSources();

  const { mutateAsync: createThumbnailMutation } = useCreateThumbnailMutation();

  // Use the generic file upload hook for thumbnail uploads
  const {
    uploadProgress,
    uploadSingleFile: uploadThumbnail,
    isUploading: isUploadingThumbnail,
  } = useGenericFileUpload<ThumbnailAssetData, DataSourceItem>({
    uploadFunction: (file, onProgress) => {
      // matching th expected function type
      return createThumbnailMutation({ file, artifact_id: artifactId, onProgress });
    },
    responseTransformer: (response) => ({
      id: response.id,
      name: title || 'Thumbnail',
      type: 'thumbnail',
      key: response.id,
      public_url: response.asset_url,
      is_cancelled: false,
    }),
    onSuccess: (items) => {
      items.forEach((item) => addDataSource(item));
    },
    successMessage: () => 'Thumbnail uploaded successfully',
    errorMessage: () => 'Failed to upload thumbnail',
  });

  useEffect(() => {
    if (thumbnail) {
      addDataSource({
        id: thumbnail.id.toString(),
        name: title || 'Thumbnail',
        type: 'thumbnail',
        key: thumbnail.id.toString(),
        public_url: thumbnail.asset_url,
        is_cancelled: false,
      });
    }
  }, [thumbnail]);

  useEffect(() => {
    return () => {
      removeAllDataSources();
    };
  }, []);

  const handleRemoveThumbnail = () => {
    removeAllDataSources();
  };

  const showFetchedData = dataSources.length > 0;
  const showDefaultMessage = !showFetchedData;
  const showPattern = !isUploading && !showFetchedData && !isUploadingThumbnail;

  const handleUploadSuccess = async (file: File) => {
    await uploadThumbnail(file);
  };

  return (
    <div
      className={cn('flex min-h-20 w-full items-center justify-center rounded-lg', {
        'border border-gray-200 bg-gray-25 p-4': showDefaultMessage || showFetchedData,
        'relative border-2 border-dashed border-primary/60 bg-white': showPattern,
      })}
    >
      {showPattern && <SourcesDragDropPattern />}
      {showDefaultMessage ? (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2">
          <DragDropClickUploadFiles
            errorMessage="This file format isn’t supported. Please upload a thumbnail in JPG, PNG, or JPEG format."
            acceptedFiles={VIDEO_THUMBNAIL_ACCEPTED_FILES}
            defaultMessage="Drop an image here (JPG, PNG, max 2MB)"
            showIcon={false}
            uploadTitle="Upload a thumbnail"
            loadingDialogMessage="Please wait while your file is being processed."
            fileLimit={1}
            fileSizeLimit={TWO_MB}
            onUploadSuccess={handleUploadSuccess}
            uploadProgress={uploadProgress}
          />
        </div>
      ) : null}
      {showFetchedData ? <ThumbnailContainer handleRemoveThumbnail={handleRemoveThumbnail} data={dataSources} /> : null}
    </div>
  );
};

type ThumbnailContainerProps = {
  handleRemoveThumbnail: () => void;
  data: DataSourceItem[];
};

const ThumbnailContainer = ({ handleRemoveThumbnail, data }: ThumbnailContainerProps) => {
  const latestItem = data[data.length - 1];
  const { name, public_url } = latestItem;
  const { getFileSize } = useFileSize(latestItem);
  const { size, unit } = getFileSize();

  const [isDeleting, setIsDeleting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { mutateAsync: deleteThumbnailItem } = useDeleteThumbnailMutation();

  const handleThumbnailDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteThumbnailItem({ thumbnailId: latestItem.id });
      handleRemoveThumbnail();
      setIsDialogOpen(false);
    } catch {
      ErrorToastMessage({ title: 'Failed to delete thumbnail' });
      setIsDialogOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const getTriggerButton = () => (
    <button type="button" name="remove-thumbnail" className="h-6 w-6" onClick={() => setIsDialogOpen(true)}>
      {isDialogOpen ? <span className="animate-spin">⌛</span> : <X className="text-gray-400" />}
    </button>
  );
  return (
    <div className="flex w-full items-center justify-between self-stretch">
      <div className="flex w-full items-center gap-4">
        <SuccessToastIcon width={'24'} height={'24'} className="text-positive-1000" />
        <img className="h-10 w-20 rounded border border-gray-300 object-fill" src={public_url} alt={name} />
        <div className="flex flex-col items-start gap-2">
          <Typography variant="body-14" className="max-w-sm truncate text-system">
            {name}
          </Typography>
          <Typography variant="caption-12-normal" className="text-gray-500">
            {size} {unit}
          </Typography>
        </div>
      </div>
      <DeleteDialogWrapper
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        getTriggerButton={getTriggerButton}
        handleDelete={handleThumbnailDelete}
        isDeleting={isDeleting}
        title="Delete Thumbnail?"
        description="You're about to permanently remove the thumbnail. This action cannot be undone."
      />
    </div>
  );
};

export default VideoThumbnailSection;
