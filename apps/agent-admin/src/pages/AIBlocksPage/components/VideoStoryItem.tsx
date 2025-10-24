import React from 'react';
import { VideoStory } from '../types/videoTypes';
import CustomVideoPlayer from '@breakout/design-system/components/layout/CustomVideoPlayer';

interface VideoStoryItemProps {
  video: VideoStory;
  isSelected: boolean;
  onClick: () => void;
}

const VideoStoryItem: React.FC<VideoStoryItemProps> = ({ video, isSelected, onClick }) => {
  return (
    <button onClick={onClick} className="group flex min-w-[85px] flex-shrink-0 flex-col items-center gap-2">
      {/* Avatar Container */}
      <div className="relative">
        <div
          className={`h-[70px] w-[70px] rounded-full p-0.5 transition-colors ${
            isSelected ? 'bg-primary' : 'bg-gray-200 group-hover:bg-primary'
          }`}
        >
          <div className="h-full w-full rounded-full bg-white p-0.5">
            <div className={`flex h-full w-full items-center justify-center overflow-hidden rounded-full`}>
              {video.thumbnail_url ? (
                <img src={video.thumbnail_url} alt={video.name} className="h-full w-full rounded-full object-cover" />
              ) : (
                <div className="relative h-full w-full overflow-hidden rounded-full">
                  <CustomVideoPlayer
                    style={{
                      borderRadius: '100%',
                      paddingTop: '0',
                      height: '100%',
                    }}
                    playing={false}
                    showControls={false}
                    videoURL={video.public_url}
                    className="!h-full !w-full rounded-full"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Title */}
      <span className="line-clamp-3 max-w-20 text-center text-xs font-medium leading-tight text-gray-700">
        {video.name}
      </span>
    </button>
  );
};

export default VideoStoryItem;
