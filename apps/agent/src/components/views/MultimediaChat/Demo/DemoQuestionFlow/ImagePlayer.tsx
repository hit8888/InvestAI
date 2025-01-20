import { useState } from 'react';

interface ImagePlayerProps {
  url: string;
  alt: string;
  onLoadComplete?: () => void;
}

export const ImagePlayer = ({ url, alt, onLoadComplete }: ImagePlayerProps) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const handleLoadComplete = () => {
    setIsImageLoaded(true);
    onLoadComplete?.();
  };

  return (
    <>
      {!isImageLoaded && (
        <div className="absolute inset-0 scale-95 bg-gray-200 opacity-0 blur-sm transition-all duration-500 ease-in-out hover:scale-100 hover:opacity-100 hover:blur-none" />
      )}
      <img className={`h-full w-full`} src={url} alt={alt} loading="lazy" onLoad={handleLoadComplete} />
    </>
  );
};
