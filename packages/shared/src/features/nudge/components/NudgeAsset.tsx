import React from 'react';
import { NudgeAssetType } from '@meaku/core/types/api/configuration_response';
import NudgeVideo from './NudgeVideo';

interface NudgeAssetProps {
  asset: NudgeAssetType;
}

const NudgeAsset: React.FC<NudgeAssetProps> = ({ asset }) => {
  switch (asset.asset_type) {
    case 'IMAGE':
      return <img src={asset.asset_preview_url || asset.asset_url} alt={asset.display_text} className="rounded-lg" />;
    case 'VIDEO':
      return (
        <div className="flex flex-col bg-primary-subtle rounded-lg">
          <span className="text-card-foreground text-sm font-semibold px-3 py-2">{asset.display_text}</span>
          <div className="relative rounded-b-md overflow-hidden">
            <NudgeVideo asset={asset} />
          </div>
        </div>
      );
    default:
      return null;
  }
};

export default NudgeAsset;
