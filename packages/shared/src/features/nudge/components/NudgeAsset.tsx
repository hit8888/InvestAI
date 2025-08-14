import React from 'react';
import { Asset } from '@meaku/core/types/api/configuration_response';
import { Icons } from '@meaku/saral';

interface NudgeAssetProps {
  asset: Asset;
}

const NudgeAsset: React.FC<NudgeAssetProps> = ({ asset }) => {
  switch (asset.asset_type) {
    case 'IMAGE':
      return <img src={asset.asset_preview_url || asset.asset_url} alt={asset.display_text} className="rounded-lg" />;
    case 'VIDEO':
      return (
        <div className="flex flex-col bg-primary-subtle rounded-lg">
          <span className="text-card-foreground text-sm font-semibold px-3 py-2">{asset.display_text}</span>
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <Icons.Loader className="w-4 h-4 text-gray-500 animate-spin" />
            </div>
            <video
              loop
              muted
              autoPlay
              src={asset.asset_url}
              poster={asset.asset_preview_url}
              className="rounded-b-md opacity-0 transition-opacity duration-300"
              onCanPlay={(e) => {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.previousElementSibling?.remove();
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
