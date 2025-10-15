import { forwardRef, useCallback, useMemo, useState, CSSProperties } from 'react';
import ReactPlayer from 'react-player';
import type { Config } from 'react-player';
import { cn } from '../utils';

// Detect if URL is a direct video file or external platform
const isDirectVideoFile = (url: string): boolean => {
  const directVideoExtensions = /\.(mp4|webm|ogg|mov|avi|mkv)(\?.*)?$/i;
  const externalPlatforms = /(youtube\.com|youtu\.be|vimeo\.com|wistia\.com|wistia\.net)/i;

  // If it's an external platform, return false (use ReactPlayer)
  if (externalPlatforms.test(url)) {
    return false;
  }

  // If it has a direct video extension, return true (use native video)
  return directVideoExtensions.test(url);
};

// Extended props for comprehensive video player
export interface VideoPlayerProps {
  // URL of the video
  url: string;

  // Legacy props for backward compatibility (Nudge component)
  assetType?: 'VIDEO' | 'YOUTUBE' | 'VIMEO' | 'WISTIA' | 'IMAGE';
  assetUrl?: string;
  assetPreviewUrl?: string;
  assetDisplayText?: string;

  // Playback controls
  playing?: boolean;
  loop?: boolean;
  muted?: boolean;
  playbackRate?: number;
  volume?: number;

  // Display options
  controls?: boolean;
  width?: string | number;
  height?: string | number;
  minHeight?: string | number;
  className?: string;
  style?: CSSProperties;

  // Video attributes
  playsinline?: boolean;
  preload?: 'auto' | 'metadata' | 'none';
  poster?: string;

  // Callbacks
  onReady?: () => void;
  onStart?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onError?: (error?: unknown) => void;
  onDuration?: (duration: number) => void;
  onProgress?: (state: { played: number; playedSeconds: number; loaded: number; loadedSeconds: number }) => void;
  onLoadedData?: (e: React.SyntheticEvent<HTMLVideoElement, Event>) => void;
  onLoadStart?: () => void;
  onCanPlay?: (e: React.SyntheticEvent<HTMLVideoElement, Event>) => void;

  // Advanced options
  config?: Config;
  progressInterval?: number;

  // Loading and preview
  showPreview?: boolean;
  previewUrl?: string;

  // Use native video player for direct files (faster)
  forceNativePlayer?: boolean;
  forceReactPlayer?: boolean;
}

const VideoPlayer = forwardRef<ReactPlayer, VideoPlayerProps>(
  (
    {
      url: urlProp,
      assetType,
      assetUrl,
      assetPreviewUrl,
      assetDisplayText,
      playing: playingProp,
      loop = false,
      muted = false,
      playbackRate = 1,
      volume = 1,
      controls = false,
      width = '100%',
      height = '100%',
      minHeight,
      className = '',
      style,
      playsinline = true,
      preload = 'metadata',
      poster,
      onReady,
      onStart,
      onPlay,
      onPause,
      onEnded,
      onError,
      onDuration,
      onProgress,
      onLoadedData,
      onLoadStart,
      onCanPlay,
      config,
      progressInterval = 1000,
      showPreview = false,
      previewUrl,
      forceNativePlayer = false,
      forceReactPlayer = false,
    },
    ref,
  ) => {
    // Support legacy props for backward compatibility
    const url = urlProp || assetUrl || '';
    const preview = previewUrl || assetPreviewUrl || poster || '';
    const displayText = assetDisplayText || '';

    const [isReady, setIsReady] = useState(false);
    const [internalPlaying, setInternalPlaying] = useState(false);

    const finalPlaying = playingProp !== undefined ? playingProp : internalPlaying;

    // Determine which player to use
    const useNativeVideo = useMemo(() => {
      if (forceReactPlayer) return false;
      if (forceNativePlayer) return true;
      return (assetType === 'VIDEO' || !assetType) && isDirectVideoFile(url);
    }, [assetType, url, forceNativePlayer, forceReactPlayer]);

    const handleReady = useCallback(() => {
      setIsReady(true);
      onReady?.();

      // Auto-play if showPreview is true (legacy behavior)
      if (showPreview && playingProp === undefined) {
        setTimeout(() => setInternalPlaying(true), 100);
      }
    }, [onReady, showPreview, playingProp]);

    const handleLoadedData = useCallback(
      (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
        handleReady();
        onLoadedData?.(e);
      },
      [handleReady, onLoadedData],
    );

    const handleCanPlay = useCallback(
      (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
        onCanPlay?.(e);
      },
      [onCanPlay],
    );

    // Merge custom config with defaults
    const mergedConfig: Config = useMemo(() => {
      const defaultConfig: Config = {
        youtube: {
          playerVars: {
            autoplay: finalPlaying ? 1 : 0,
            controls: controls ? 1 : 0,
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
            iv_load_policy: 3,
          },
          embedOptions: {
            host: 'https://www.youtube-nocookie.com',
          },
        },
        vimeo: {
          playerOptions: {
            autoplay: finalPlaying,
            controls: controls,
            loop: loop,
            muted: muted,
            background: false,
          },
        },
        wistia: {
          options: {
            autoplay: finalPlaying,
            controlsVisibleOnLoad: controls,
            playbar: controls,
            silentAutoPlay: muted ? 'allow' : 'auto',
          },
        },
        file: {
          attributes: {
            controlsList: 'nodownload',
            playsInline: playsinline,
            preload: preload,
            poster: poster,
            style: {
              width: '100%',
              height: '100%',
              objectFit: 'fill',
            },
          },
        },
      };

      // Deep merge custom config with defaults
      if (config) {
        return {
          ...defaultConfig,
          ...config,
          youtube: { ...defaultConfig.youtube, ...config.youtube },
          vimeo: { ...defaultConfig.vimeo, ...config.vimeo },
          wistia: { ...defaultConfig.wistia, ...config.wistia },
          file: { ...defaultConfig.file, ...config.file },
        };
      }

      return defaultConfig;
    }, [config, controls, finalPlaying, loop, muted, playsinline, preload, poster]);

    // Native video tag for direct MP4/WebM files - FAST and instant
    if (useNativeVideo) {
      return (
        <video
          className={cn('h-full w-full object-fill', className)}
          loop={loop}
          muted={muted}
          autoPlay={finalPlaying}
          playsInline={playsinline}
          preload={preload}
          controls={controls}
          src={url}
          poster={preview || undefined}
          onLoadedData={handleLoadedData}
          onCanPlay={handleCanPlay}
          onPlay={onPlay}
          onPause={onPause}
          onEnded={onEnded}
          onError={onError}
          onDurationChange={(e) => onDuration?.(e.currentTarget.duration)}
          onLoadStart={onLoadStart}
        />
      );
    }

    const getReactPlayer = () => {
      return (
        <ReactPlayer
          ref={ref}
          url={url}
          playing={finalPlaying}
          loop={loop}
          muted={muted}
          playbackRate={playbackRate}
          volume={volume}
          controls={controls}
          width={width}
          height={height}
          playsinline={playsinline}
          onReady={handleReady}
          onStart={onStart}
          onPlay={onPlay}
          onPause={onPause}
          onEnded={onEnded}
          onError={onError}
          onDuration={onDuration}
          onProgress={onProgress}
          progressInterval={progressInterval}
          style={
            showPreview
              ? {
                  opacity: isReady ? 1 : 0,
                  transition: 'opacity 400ms ease-in-out',
                }
              : { minHeight }
          }
          config={mergedConfig}
        />
      );
    };

    if (!showPreview) {
      return getReactPlayer();
    }

    // ReactPlayer for YouTube, Vimeo, Wistia and other sources
    return (
      <div className={`relative ${className}`} style={style}>
        {!isReady && preview && (
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <img src={preview} alt={displayText} className="h-full w-full object-cover" />
          </div>
        )}
        {getReactPlayer()}
      </div>
    );
  },
);

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer;
