import { CDN_URL_FOR_ASSETS } from '@meaku/core/constants';
import { useEffect } from 'react';

const useBrandCoverImage = (tenantId: string, showCoverImage?: boolean) => {
  useEffect(() => {
    const boBcContainer = document.querySelector('#bo-bc-container') as HTMLElement;

    if (!boBcContainer || !showCoverImage) return;

    boBcContainer.style.backgroundImage = `url('${CDN_URL_FOR_ASSETS}/agents-website-SS/${tenantId}.png')`;
    boBcContainer.style.backgroundSize = 'contain';
    boBcContainer.style.backgroundPosition = 'center';
    boBcContainer.style.backgroundRepeat = 'no-repeat';
    boBcContainer.style.overflow = 'hidden';
    boBcContainer.style.height = '100vh';
  }, [showCoverImage, tenantId]);
};

export default useBrandCoverImage;
