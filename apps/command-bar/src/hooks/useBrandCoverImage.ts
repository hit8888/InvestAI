import { useEffect } from 'react';

import { CDN_URL_FOR_ASSETS } from '@meaku/core/constants';
import { loadImageWithCallback } from '../utils/imageUtils';
import defaultCoverImage from '/bc_default.png';

const DEFAULT_COVER_IMAGE_URL = defaultCoverImage;
const BRAND_COVER_IMAGE_URL = `${CDN_URL_FOR_ASSETS}/agents-website-SS/{{tenantId}}.png`;
const DEFAULT_STYLES = {
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  overflow: 'hidden',
  height: '100vh',
};

const setBackgroundImage = (imageUrl: string, styles: Record<string, string> = {}) => {
  const boBcContainer = document.getElementById('breakout-bc-container');
  if (!boBcContainer) return;
  boBcContainer.style.backgroundImage = `url('${imageUrl}')`;
  Object.assign(boBcContainer.style, DEFAULT_STYLES, styles);
};

const useBrandCoverImage = (tenantId: string, showCoverImage?: boolean) => {
  useEffect(() => {
    setBackgroundImage(DEFAULT_COVER_IMAGE_URL);

    if (!showCoverImage) return;

    const primaryImageUrl = BRAND_COVER_IMAGE_URL.replace('{{tenantId}}', tenantId);

    const onImageLoad = () => {
      setBackgroundImage(primaryImageUrl, { backgroundSize: 'contain' });
    };

    loadImageWithCallback(primaryImageUrl, onImageLoad);
  }, [showCoverImage, tenantId]);
};

export default useBrandCoverImage;
