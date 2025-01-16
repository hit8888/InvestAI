import { useRef, useState } from 'react';

interface VideoPlayerProps {
  url: string;
  onLoadComplete?: () => void;
}

export const VideoPlayer = ({ url, onLoadComplete }: VideoPlayerProps) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleLoadComplete = () => {
    setIsVideoLoaded(true);
    onLoadComplete?.();
  };

  return (
    <>
      {!isVideoLoaded && (
        <div className="absolute inset-0 scale-95 bg-gray-200 opacity-0 blur-sm transition-all duration-500 ease-in-out" />
      )}
      <video
        ref={videoRef}
        className={`aspect-[16/9] h-full w-full object-contain transition-all duration-500 ease-out ${
          isVideoLoaded ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        preload="metadata"
        playsInline
        autoPlay={true}
        onLoadedData={handleLoadComplete}
        muted={true}
      >
        <source src={url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </>
  );
};
