import { Navigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AppRoutesEnum } from '../utils/constants';
import usePlaygroundOptions from '../hooks/usePlaygroundOptions';
import WebsiteBackgroundToggle from './PlaygroundPage/components/WebsiteBackgroundToggle';

const PlaygroundPreviewPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { tenantName } = usePlaygroundOptions();

  const [addWebsiteBackground, setAddWebsiteBackground] = useState<boolean>(false);

  const previewUrlParam = searchParams.get('previewUrl');

  const [previewUrl, setPreviewUrl] = useState<string>(previewUrlParam ?? '');

  if (previewUrl && previewUrlParam) {
    const newParams = new URLSearchParams(window.location.search);
    newParams.delete('previewUrl');
    setSearchParams(newParams, { replace: true });
  }

  useEffect(() => {
    if (!previewUrl) return;

    const url = new URL(previewUrl);
    const currentBc = url.searchParams.get('bo_bc');
    const newBc = addWebsiteBackground.toString();

    if (currentBc !== newBc) {
      url.searchParams.set('bo_bc', newBc);
      setPreviewUrl(url.toString());
    }
  }, [addWebsiteBackground, previewUrl]);

  if (!previewUrl) {
    return <Navigate to={`/${tenantName}/${AppRoutesEnum.TRAINING_PLAYGROUND}`} replace />;
  }

  return (
    <div className="relative h-screen w-full">
      <div className="absolute left-1/2 top-4 z-10 w-56 -translate-x-1/2 transform">
        <WebsiteBackgroundToggle
          value={addWebsiteBackground}
          onChange={(value) => {
            setAddWebsiteBackground(value);
          }}
        />
      </div>
      <iframe src={previewUrl} className="h-full w-full border-0" title="Playground Agent Preview" />
    </div>
  );
};

export default PlaygroundPreviewPage;
