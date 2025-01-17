import { useRef, useState } from 'react';

interface VideoPlayerProps {
  url: string;
  onLoadComplete?: () => void;
  ref?: React.RefObject<HTMLVideoElement>;
}

export const VideoPlayer = ({ url, onLoadComplete, ref }: VideoPlayerProps) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const videoRef = ref || localVideoRef;

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
        className={'aspect-[16/9] h-full w-full object-fill'}
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
