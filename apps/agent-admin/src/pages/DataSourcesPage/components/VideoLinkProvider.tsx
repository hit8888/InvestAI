import ErrorToastMessage from '@breakout/design-system/components/layout/ErrorToastMessage';
import Separator from '@breakout/design-system/components/layout/separator';
import SpinLoader from '@breakout/design-system/components/layout/SpinLoader';
import SuccessToastMessage from '@breakout/design-system/components/layout/SuccessToastMessage';
import Typography from '@breakout/design-system/components/Typography/index';
import React, { useRef, useState } from 'react';
import { useVideoValidationMutation } from '../../../queries/mutation/useVideoValidationMutation';
import { useDataSourcesStore } from '../../../stores/useDataSourcesStore';
import URLLinkInput from '@breakout/design-system/components/layout/URLLinkInput';
import { VideoValidationResponse } from '@meaku/core/types/admin/api';
import { uploadAssetsFromUrl } from '@meaku/core/adminHttp/api';

const getVideoProvider = (url: string): string => {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();

    if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
      return 'YouTube';
    } else if (hostname.includes('vimeo.com')) {
      return 'Vimeo';
    } else if (hostname.includes('wistia.com') || hostname.includes('wistia.net')) {
      return 'Wistia';
    } else {
      return 'video platform';
    }
  } catch {
    return 'video platform';
  }
};

const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const VideoLinkProvider = () => {
  const [videoLink, setVideoLink] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState('');
  const lastValidatedUrlRef = useRef<string>('');
  const { addMultipleDataSources } = useDataSourcesStore();

  const videoValidationMutation = useVideoValidationMutation({
    onSuccess: (data: VideoValidationResponse) => {
      handleValidationSuccess(data);
    },
    onError: () => {
      setIsValidating(false);
      setError('Failed to validate video URL');
    },
    showToasts: true,
  });

  const handleVideoLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setVideoLink(newValue);

    // Clear last validated URL if the value has changed
    if (newValue.trim() !== lastValidatedUrlRef.current) {
      lastValidatedUrlRef.current = '';
    }
  };

  const handleInputFocus = () => {
    // Clear error state when input is focused
    setError('');
  };

  const handleValidationSuccess = async (data: VideoValidationResponse) => {
    const { success, errors } = data;
    const successCount = success.length;
    const errorCount = Object.keys(errors).length;

    // Handle validation errors
    if (errorCount > 0) {
      setIsValidating(false);
      // Get the first error message from the errors object
      const failedUrl = Object.keys(errors)[0];
      const provider = getVideoProvider(failedUrl);
      setError(
        `We were unable to fetch the video details from ${provider}. Please paste a different link or upload manually.`,
      );
      return;
    }

    // Upload validated videos and get asset structure
    if (successCount > 0) {
      try {
        // Call upload API for each validated video
        const uniqueVideos = new Map(success.map((video) => [video.url, video]));
        const uploadPromises = success.map((video) => uploadAssetsFromUrl(video.url));

        const uploadResponses = await Promise.allSettled(uploadPromises);

        // Transform API responses to DataSourceItem format
        const dataSourceItems = uploadResponses.map((response) => {
          const asset = response.status === 'fulfilled' ? response.value.data : null;
          if (!asset) return null;

          const video = uniqueVideos.get(asset.public_url);

          return {
            ...asset,
            name: video?.title,
            type: video?.video_type,
            is_cancelled: false,
            metadata: {
              duration: video?.duration,
            },
          };
        });

        const validDataSourceItems = dataSourceItems.filter((item) => item !== null);
        if (validDataSourceItems.length > 0) {
          addMultipleDataSources(validDataSourceItems);
          setVideoLink('');
          SuccessToastMessage({
            title: `${successCount} video${successCount > 1 ? 's' : ''} uploaded successfully`,
          });
        }
      } catch (error) {
        console.error('Error uploading videos:', error);
        ErrorToastMessage({
          title: 'Failed to upload videos. Please try again.',
        });
      }
    }

    lastValidatedUrlRef.current = '';
    setIsValidating(false);
    setError('');
  };

  const handleVideoLinkBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const url = e.target.value.trim();

    if (!url) {
      setError('');
      return;
    }

    // Skip if URL hasn't changed from last validation
    if (url === lastValidatedUrlRef.current) {
      return;
    }

    // Validate URL format
    if (!validateUrl(url)) {
      setError('Please enter a valid video URL');
      return;
    }

    // Call validation API
    setIsValidating(true);
    setError('');
    lastValidatedUrlRef.current = url;
    videoValidationMutation.mutate([url]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur(); // Trigger blur event which handles validation
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Separator className="bg-gray-300" />
        <span className="text-sm font-medium text-gray-400">OR</span>
        <Separator className="bg-gray-300" />
      </div>
      <div className="flex w-full flex-col gap-2">
        <Typography variant="caption-12-medium">Paste a video link</Typography>
        <div className="relative">
          <URLLinkInput
            classname="w-full"
            onInputBlur={handleVideoLinkBlur}
            onInputFocus={handleInputFocus}
            inputValue={videoLink}
            onInputChange={handleVideoLinkChange}
            onKeyDown={handleKeyDown}
            error={error}
          />
          {isValidating && (
            <div className="absolute right-4 top-3.5">
              <SpinLoader width={4} height={4} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoLinkProvider;
