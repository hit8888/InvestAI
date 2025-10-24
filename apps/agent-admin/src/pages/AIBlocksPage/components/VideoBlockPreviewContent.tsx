import React, { useState, useRef, useCallback } from 'react';
import { TvMinimalPlay, Sparkles } from 'lucide-react';
import Button from '@breakout/design-system/components/Button/index';
import CustomVideoPlayer from '@breakout/design-system/components/layout/CustomVideoPlayer';
import VideoStoryItem from './VideoStoryItem';
import { DemoVideoModalProps } from '../types/videoTypes';

const VideoBlockPreviewContent: React.FC<DemoVideoModalProps> = ({ videos = [], isLoading = false }) => {
  const isVideosPresent = videos.length > 0;

  const [selectedVideoId, setSelectedVideoId] = useState<string>(videos[0]?.id || '');
  const [isPlaying, setIsPlaying] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const selectedVideo = videos.find((video) => video.id === selectedVideoId) || videos[0];

  const handleVideoSelect = useCallback((videoId: string) => {
    setSelectedVideoId(videoId);
    setIsPlaying(true); // Auto-play when video changes
  }, []);

  const handleVideoEnd = useCallback(() => {
    // Auto-select next video when current one ends
    const currentIndex = videos.findIndex((v) => v.id === selectedVideoId);
    const nextIndex = (currentIndex + 1) % videos.length;
    setSelectedVideoId(videos[nextIndex].id);
    setIsPlaying(true);
  }, [selectedVideoId, videos]);

  if (isLoading) {
    return (
      <div className="flex w-full flex-col gap-4 p-4 pt-0">
        {/* Description Shimmer */}
        <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200"></div>

        {/* Main Video Player Shimmer */}
        <div className="overflow-hidden rounded-xl bg-gray-50">
          {/* Header Shimmer */}
          <div className="flex items-center gap-2 bg-primary/5 px-4 py-3">
            <div className="h-5 w-32 animate-pulse rounded bg-gray-200"></div>
          </div>

          {/* Video Container Shimmer */}
          <div className="relative aspect-video animate-pulse bg-gray-300"></div>
        </div>

        {/* Video Recommendations Shimmer */}
        <div>
          <div className="mb-4 flex items-center gap-2">
            <div className="h-4 w-4 animate-pulse rounded bg-gray-200"></div>
            <div className="h-5 w-48 animate-pulse rounded bg-gray-200"></div>
          </div>

          {/* Horizontal Scrollable Shimmers */}
          <div className="flex gap-5 overflow-x-auto pb-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex-shrink-0">
                <div className="h-48 w-32 animate-pulse rounded-2xl bg-gray-200"></div>
                <div className="mt-2 h-4 w-24 animate-pulse rounded bg-gray-200"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions Shimmer */}
        <div className="space-y-3">
          <div className="h-12 w-full animate-pulse rounded-lg bg-gray-200"></div>
          <div className="flex items-center justify-center gap-2">
            <div className="h-4 w-32 animate-pulse rounded bg-gray-200"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!isVideosPresent) {
    return <VideoLibraryEmptyState />;
  }

  return (
    <div className="flex w-full flex-col gap-4 p-4 pt-0">
      {/* Main Video Player */}
      <div className="overflow-hidden rounded-xl bg-gray-50">
        {/* Brand Header */}
        <div className="flex items-center gap-2 bg-primary/5 px-4 py-3">
          <span className="text-sm font-medium text-gray-900">{selectedVideo.name}</span>
        </div>

        {/* Video Container */}
        <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-gray-700">
          {/* Video Content */}
          <div className="absolute inset-0">
            <CustomVideoPlayer
              playing={isPlaying}
              videoURL={selectedVideo.public_url}
              allowDownload={false}
              allowPictureInPicture={true}
              showControls={true}
              onEnded={handleVideoEnd}
            />
          </div>
        </div>
      </div>

      {/* Video Recommendations */}
      <div>
        <h4 className="mb-4 flex items-center gap-2 text-sm font-medium text-primary">
          <Sparkles className="h-4 w-4 text-primary" />
          Video Recommendations for you
        </h4>

        {/* Horizontal Scrollable Video Stories */}
        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="scrollbar-hide flex gap-5 overflow-x-auto pb-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {videos.map((video) => (
              <VideoStoryItem
                key={video.id}
                video={video}
                isSelected={video.id === selectedVideoId}
                onClick={() => handleVideoSelect(video.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="space-y-3">
        <Button
          variant="primary"
          className="flex w-full items-center justify-center gap-2 rounded-lg py-3 font-medium text-white"
        >
          <TvMinimalPlay className="h-4 w-4" />
          Book a demo
        </Button>

        {/* Ask AI link */}
        <div className="flex items-center justify-center gap-2">
          <p className="text-sm text-gray-500">Have questions? </p>
          <button className="text-sm font-semibold text-primary hover:underline">Try Ask AI</button>
        </div>
      </div>
    </div>
  );
};

const VideoLibraryEmptyState = () => {
  return (
    <div className="flex w-full flex-col gap-4 p-4 pt-0">
      {/* Main Video Player - Empty State */}
      <div className="overflow-hidden rounded-xl bg-gray-50">
        {/* Brand Header - Placeholder */}
        <div className="flex items-center gap-2 bg-gray-100 px-4 py-3">
          <div className="h-4 w-32 rounded bg-gray-300"></div>
        </div>

        {/* Video Container - Placeholder */}
        <div className="relative aspect-video bg-gradient-to-br from-gray-200 to-gray-300">
          {/* Play Icon Placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-400/50">
              <TvMinimalPlay className="h-8 w-8 text-gray-500" />
            </div>
          </div>

          {/* No Video Available Text */}
          <div className="absolute inset-0 flex items-end justify-center pb-6">
            <div className="rounded-lg bg-gray-900/60 px-4 py-2">
              <p className="text-sm text-white">No videos available</p>
            </div>
          </div>
        </div>
      </div>

      {/* Video Recommendations - Empty State */}
      <div>
        <h4 className="mb-4 flex items-center gap-2 text-sm font-medium text-gray-400">
          <Sparkles className="h-4 w-4 text-gray-400" />
          Video Recommendations for you
        </h4>

        {/* Horizontal Scrollable Video Stories - Placeholders */}
        <div className="relative">
          <div
            className="scrollbar-hide flex gap-5 overflow-x-auto pb-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                {/* Video Story Card Placeholder */}
                <div className="relative h-20 w-20 overflow-hidden rounded-full bg-gray-200">
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-300" />

                  {/* Play Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <TvMinimalPlay className="h-8 w-8 text-gray-500" />
                  </div>
                </div>
                <div className="h-3 w-3/4 rounded bg-gray-400"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Actions - Empty State */}
      <div className="space-y-3">
        <Button
          disabled
          className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg bg-gray-300 py-3 font-medium text-gray-500"
        >
          <TvMinimalPlay className="h-4 w-4" />
          Book a demo
        </Button>

        {/* Ask AI link - Disabled State */}
        <div className="flex items-center justify-center gap-2">
          <p className="text-sm text-gray-400">Have questions? </p>
          <button className="cursor-not-allowed text-sm text-gray-400" disabled>
            Try Ask AI
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoBlockPreviewContent;
