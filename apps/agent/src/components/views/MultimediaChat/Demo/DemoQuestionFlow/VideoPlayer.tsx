import { useState, useEffect, RefObject } from 'react';
import ReactPlayer from 'react-player';

interface Props {
  url: string;
  onLoadComplete: () => void;
  onError?: () => void;
  videoRef: RefObject<ReactPlayer | null>;
  playing: boolean;
  audioDuration: number;
}

export const VideoPlayer: React.FC<Props> = ({ url, onLoadComplete, onError, videoRef, playing, audioDuration }) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [videoDuration, setVideoDuration] = useState<number | null>(null);

  // Update playback rate whenever audioDuration or videoDuration changes
  useEffect(() => {
    if (videoDuration && audioDuration) {
      // Calculate ratio between video and audio duration
      const ratio = videoDuration / audioDuration;

      if (ratio > 1) {
        // If video is longer than audio, speed up video
        setPlaybackRate(ratio);
      } else {
        // If video is shorter than audio, slow down video
        // Use a minimum playback rate of 0.25 to prevent extremely slow playback
        setPlaybackRate(Math.max(ratio, 0.25));
      }
    }
  }, [audioDuration, videoDuration]);

  useEffect(() => {
    if (videoRef.current) {
      setIsVideoLoaded(true);
      onLoadComplete();
    }
  }, [onLoadComplete, videoRef]);

  const handleDuration = (duration: number) => {
    setVideoDuration(duration);
  };

  return (
    <div className="flex h-full w-full">
      {!isVideoLoaded && (
        <div className="absolute inset-0 scale-95 bg-gray-200 opacity-0 blur-sm transition-all duration-500 ease-in-out" />
      )}
      <ReactPlayer
        ref={videoRef}
        url={url}
        playing={playing}
        muted={true}
        width="100%"
        height="100%"
        playbackRate={playbackRate}
        onDuration={handleDuration}
        onReady={onLoadComplete}
        onError={onError}
      />
    </div>
  );
};
