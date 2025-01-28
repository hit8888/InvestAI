import { useState, useEffect, RefObject } from 'react';
import ReactPlayer from 'react-player';

interface Props {
  url: string;
  onLoadComplete: () => void;
  videoRef: RefObject<ReactPlayer | null>;
  playing: boolean;
}

export const VideoPlayer: React.FC<Props> = ({ url, onLoadComplete, videoRef, playing }) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      setIsVideoLoaded(true);
      onLoadComplete();
    }
  }, [onLoadComplete, videoRef]);

  return (
    <div className="flex h-full w-full">
      {!isVideoLoaded && (
        <div className="absolute inset-0 scale-95 bg-gray-200 opacity-0 blur-sm transition-all duration-500 ease-in-out" />
      )}
      <ReactPlayer ref={videoRef} url={url} playing={playing} muted={true} width="100%" height="100%" />
    </div>
  );
};
