import { DemoArtifactType } from '@meaku/core/types/chat';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import ArtifactControls from './ArtifactControls';
import { useMessageStore } from '../../../stores/useMessageStore';
import { PauseIcon, PlayIcon } from 'lucide-react';
import { useArtifactStore } from '../../../stores/useArtifactStore';
import useWebSocketChat from '../../../hooks/useWebSocketChat';
import { cn } from '@breakout/design-system/lib/cn';

interface IProps {
  artifact: DemoArtifactType;
  artifactId: string;
}

type Content = {
  id: string;
  name: string;
  description: string;
  audioUrl: string;
  frameUrl?: string;
  frameType?: string;
  interval: number;
};

const DemoArtifact = (props: IProps) => {
  const { artifact, artifactId } = props;

  const handleAddAIMessage = useMessageStore((state) => state.handleAddAIMessage);

  const [activeContentIndex, setActiveContentIndex] = useState(0);
  const [sentMessages, setSentMessages] = useState<Set<string>>(new Set());
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleRemoveMessages = useMessageStore((state) => state.handleRemoveMessages);
  const shouldEndArtifactImmediately = useArtifactStore((state) => state.shouldEndArtifactImmediately);
  const setShouldEndArtifactImmediately = useArtifactStore((state) => state.setShouldEndArtifactImmediately);
  const setIsArtifactPlaying = useArtifactStore((state) => state.setIsArtifactPlaying);

  const { handleSendUserMessage } = useWebSocketChat();

  const idToContentMap = useMemo(() => {
    const map = [] as Content[];

    const artifactFeatures = artifact.features;

    artifactFeatures.forEach((feature) => {
      const featureId = `feature-${feature.id}`;

      map.push({
        id: featureId,
        name: feature.feature_name,
        // TODO: Move this above loop when we have multiple features
        description: `${artifact.introduction}\n\n${feature.feature_description}`,
        audioUrl: feature.feature_audio_url,
        interval: 10, // TODO: Take it from backend when available
      });

      const frames = feature.frames;

      frames.forEach((frame) => {
        const frameId = `feature-${featureId}-frame-${frame.id}`;

        map.push({
          id: frameId,
          name: frame.frame_name,
          description: frame.frame_description,
          audioUrl: frame.frame_audio_url,
          frameUrl: frame.frame_url,
          frameType: frame.frame_type,
          interval: frame.frame_interval,
        });
      });
    });

    return map;
  }, [artifact, artifactId]);

  const handlePlayPause = () => {
    const audio = audioRef.current;

    setIsPlaying((prevState) => !prevState);

    if (audio) {
      if (audio.paused) {
        audio
          .play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            console.error('Error playing audio:', error);
          });
      } else {
        audio.pause();
      }
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;

      return;
    }

    const currentContent = idToContentMap[activeContentIndex];
    timeoutRef.current = setTimeout(() => {
      if (activeContentIndex < idToContentMap.length - 1) {
        setActiveContentIndex((prevIndex) => prevIndex + 1);
      }
    }, currentContent.interval * 1000);
  };

  const handleRestart = () => {
    const audio = audioRef.current;

    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setActiveContentIndex(0);
  };

  const handleSendArtifactCompletionEvent = () => {
    const payload = {
      artifact_type: 'DEMO',
      artifact_id: artifactId,
    };
    handleSendUserMessage('', 'ARTIFACT_CONSUMED', payload);
    setIsArtifactPlaying(false);
  };

  const renderContent = (content: Content | undefined) => {
    if (!content) return null;

    if (!content.frameUrl || !content.frameType) {
      const isLastContent = activeContentIndex === idToContentMap.length - 1;

      if (isLastContent) {
        return null;
      }

      const nextContent = idToContentMap[activeContentIndex + 1];

      return renderContent(nextContent);
    }

    switch (content.frameType) {
      case 'IMAGE':
        return <img className="h-full w-full object-contain" src={content.frameUrl} alt={content.name} />;

      case 'VIDEO':
        return (
          <video className="h-full w-full object-contain" controls>
            <source src={content.frameUrl} type="video/mp4" />
            This browser does not support the video tag.
          </video>
        );

      default:
        return null;
    }
  };

  useEffect(() => {
    if (idToContentMap.length === 0 || shouldEndArtifactImmediately || !isPlaying) return;

    setIsArtifactPlaying(true);

    const currentContent = idToContentMap[activeContentIndex];

    if (!currentContent) return;

    const { id: contentId, description, audioUrl, interval } = currentContent;

    const message = description;
    const newAudio = new Audio(audioUrl);

    if (audioRef.current) {
      audioRef.current.pause();
    }

    audioRef.current = newAudio;

    if (!sentMessages.has(contentId)) {
      handleAddAIMessage({
        response_id: contentId,
        message: message,
        analytics: {},
        artifacts: [],
        documents: [],
        is_complete: true,
        suggested_questions: [],
      });

      setSentMessages((prev) => new Set(prev).add(contentId));
    }

    newAudio.load();
    newAudio.play().catch((error) => {
      console.error('Error playing audio:', error);
    });

    if (activeContentIndex === idToContentMap.length - 1) {
      handleSendArtifactCompletionEvent();
    }

    timeoutRef.current = setTimeout(() => {
      if (activeContentIndex < idToContentMap.length - 1) {
        setActiveContentIndex((prevIndex) => prevIndex + 1);
      }
    }, interval * 1000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      newAudio.pause();
    };
  }, [activeContentIndex, idToContentMap, isPlaying]);

  useEffect(() => {
    if (shouldEndArtifactImmediately) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      // TODO: Debug this
      // setActiveFrameIndex(frames.length - 1);
      if (audioRef.current) {
        try {
          audioRef.current.currentTime = audioRef.current.duration;
        } catch (error) {
          console.log('🚀 ~ file: DemoArtifact.tsx:260 ~ useEffect ~ error:', error);
        }
        audioRef.current.pause();
      }
      handleSendArtifactCompletionEvent();
      handleRemoveMessages([...sentMessages]);
      setShouldEndArtifactImmediately(false);
      setIsArtifactPlaying(false);
      setIsPlaying(false);
    }
  }, [shouldEndArtifactImmediately]);

  return (
    <div className="relative h-full w-full">
      {idToContentMap.length > 0 && renderContent(idToContentMap[activeContentIndex])}

      <div
        className={cn('absolute inset-0 z-10 flex cursor-pointer items-center justify-center bg-black/30', {
          'opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100': isPlaying,
        })}
        onClick={handlePlayPause}
      >
        {isPlaying ? (
          <PauseIcon className="fill-white text-white" size={60} />
        ) : (
          <PlayIcon className="fill-white text-white" size={60} />
        )}
      </div>

      <ArtifactControls isPlaying={isPlaying} handlePause={handlePlayPause} handleRestart={handleRestart} />
    </div>
  );
};

export default memo(DemoArtifact);
