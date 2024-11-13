import { DemoArtifactType } from "@meaku/core/types/chat";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { useMessageStore } from "../../../stores/useMessageStore";
import ArtifactControls from "./ArtifactControls";

interface IProps {
  artifact: DemoArtifactType;
}

type Frame = DemoArtifactType["features"][0]["frames"][0];

const DemoArtifact = (props: IProps) => {
  const { artifact } = props;

  const handleAddAIMessage = useMessageStore(
    (state) => state.handleAddAIMessage,
  );
  const setIsAMessageBeingProcessed = useMessageStore(
    (state) => state.setIsAMessageBeingProcessed,
  );

  const [activeFrameIndex, setActiveFrameIndex] = useState(0);
  const [sentMessages, setSentMessages] = useState<Set<string>>(new Set());

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const frames = useMemo(
    () =>
      artifact.features.reduce((acc, feature) => {
        return [...acc, ...feature.frames];
      }, [] as Frame[]),
    [artifact],
  );

  const frameToMessageAndAudioMap = frames.reduce<{
    [key: string]: {
      message: string;
      audio?: string;
    };
  }>((acc, frame) => {
    const frameId = `frame-${frame.id}-${frame.frame_name}`;

    return {
      ...acc,
      [frameId]: {
        message: frame.frame_description,
        audio: frame.frame_audio_url,
      },
    };
  }, {});

  const handlePlayPause = () => {
    const audio = audioRef.current;

    if (audio) {
      if (audio.paused) {
        audio.play().catch((error) => {
          console.error("Error playing audio:", error);
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
    const currentFrame = frames[activeFrameIndex];
    timeoutRef.current = setTimeout(() => {
      if (activeFrameIndex < frames.length - 1) {
        setActiveFrameIndex((prevIndex) => prevIndex + 1);
      }
    }, currentFrame.frame_interval * 1000);
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

    setActiveFrameIndex(0);
    setIsAMessageBeingProcessed(true);
  };

  const renderFrame = (frame: Frame | undefined) => {
    if (!frame) return null;

    switch (frame.frame_type) {
      case "IMAGE":
        return (
          <img
            className="h-full w-full object-contain"
            src={frame.frame_url}
            alt={frame.frame_name}
          />
        );

      case "VIDEO":
        return (
          <video className="h-full w-full object-contain" controls>
            <source src={frame.frame_url} type="video/mp4" />
            This browser does not support the video tag.
          </video>
        );

      default:
        return null;
    }
  };

  // useEffect(() => {
  //   const preloadImages = (imageUrls: string[]) => {
  //     return Promise.all(
  //       imageUrls.map((url) => {
  //         return new Promise((resolve, reject) => {
  //           const img = new Image();
  //           img.src = url;
  //           img.onload = () => resolve(url);
  //           img.onerror = () => reject(url);
  //         });
  //       }),
  //     );
  //   };

  //   const preloadAudio = (audioUrls: string[]) => {
  //     return Promise.all(
  //       audioUrls.map((url) => {
  //         return new Promise((resolve, reject) => {
  //           const audio = new Audio();
  //           audio.src = url;
  //           audio.oncanplaythrough = () => resolve(url);
  //           audio.onerror = () => reject(url);
  //         });
  //       }),
  //     );
  //   };

  //   const imageUrls = frames.map((frame) => frame.frame_url);
  //   const audioUrls = frames
  //     .map((frame) => frame.frame_audio_url)
  //     .filter(Boolean) as string[];

  //   Promise.all([preloadImages(imageUrls), preloadAudio(audioUrls)]);
  // }, [frameToMessageAndAudioMap]);

  useEffect(() => {
    if (frames.length === 0) return;

    setIsAMessageBeingProcessed(true);
    const currentFrame = frames[activeFrameIndex];

    const frameId = `frame-${currentFrame.id}-${currentFrame.frame_name}`;
    const message = frameToMessageAndAudioMap[frameId].message;

    const audioUrl = frameToMessageAndAudioMap[frameId].audio;
    const newAudio = new Audio(audioUrl);

    if (audioRef.current) {
      audioRef.current.pause();
    }

    audioRef.current = newAudio;

    if (!sentMessages.has(frameId)) {
      handleAddAIMessage({
        response_id: frameId,
        message: message,
        analytics: {},
        artifacts: [],
        documents: [],
        is_complete: true,
        media: null,
        suggested_questions: [],
      });

      setSentMessages((prev) => new Set(prev).add(frameId));
    }

    newAudio.load();
    newAudio.play().catch((error) => {
      console.error("Error playing audio:", error);
    });

    if (activeFrameIndex === frames.length - 1) {
      setIsAMessageBeingProcessed(false);
    }

    timeoutRef.current = setTimeout(() => {
      if (activeFrameIndex < frames.length - 1) {
        setActiveFrameIndex((prevIndex) => prevIndex + 1);
      }
    }, currentFrame.frame_interval * 1000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      newAudio.pause();
    };
  }, [activeFrameIndex, frames]);

  return (
    <div className="relative h-full w-full">
      {frames.length > 0 && renderFrame(frames[activeFrameIndex])}

      <ArtifactControls
        handlePause={handlePlayPause}
        handleRestart={handleRestart}
      />
    </div>
  );
};

export default memo(DemoArtifact);
