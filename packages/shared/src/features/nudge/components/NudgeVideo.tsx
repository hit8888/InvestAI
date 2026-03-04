import React from 'react';
import { NudgeAssetType } from '@neuraltrade/core/types/api/configuration_response';
import { VideoPlayer } from '@neuraltrade/saral';
interface NudgeVideoProps {
  asset: NudgeAssetType;
}

const NudgeVideo: React.FC<NudgeVideoProps> = ({ asset }) => {
  return (
    <VideoPlayer
      muted
      playing
      showPreview
      assetType={asset.asset_type}
      url={asset.asset_url}
      previewUrl={asset.asset_preview_url}
      assetDisplayText={asset.display_text}
    />
  );
};

export default NudgeVideo;
