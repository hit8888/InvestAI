import React, { useCallback } from 'react';
import { NudgeAssetType } from '@meaku/core/types/api/configuration_response';
import { LucideIcon } from '@meaku/saral';
import ReactPlayer from 'react-player';

interface NudgeAssetProps {
  asset: NudgeAssetType;
}

const NudgeAsset: React.FC<NudgeAssetProps> = ({ asset }) => {
  const handleVideoReady = useCallback(() => {
    // Handle loading state - remove spinner and show video
    const videoContainer = document.querySelector('.nudge-video');
    if (videoContainer) {
      (videoContainer as HTMLElement).style.opacity = '1';
      videoContainer.previousElementSibling?.remove();
    }
  }, []);
  switch (asset.asset_type) {
    case 'IMAGE':
      return <img src={asset.asset_preview_url || asset.asset_url} alt={asset.display_text} className="rounded-lg" />;
    case 'VIDEO':
      return (
        <div className="flex flex-col bg-primary-subtle rounded-lg">
          <span className="text-card-foreground text-sm font-semibold px-3 py-2">{asset.display_text}</span>
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <LucideIcon name="loader" className="w-4 h-4 text-gray-500 animate-spin" />
            </div>
            <ReactPlayer
              url={asset.asset_url}
              loop
              muted
              playing
              width="100%"
              height="100%"
              onBufferEnd={handleVideoReady}
              className="nudge-video rounded-b-md opacity-0 transition-opacity duration-300"
              onReady={handleVideoReady}
              config={{
                file: {
                  attributes: {
                    poster: asset.asset_preview_url || undefined,
                  },
                },
              }}
            />
          </div>
        </div>
      );
    default:
      return null;
  }
};

export default NudgeAsset;
