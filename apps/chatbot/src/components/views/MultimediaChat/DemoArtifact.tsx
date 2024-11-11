import { DemoArtifactType } from '@meaku/core/types/chat';
import { useEffect, useRef, useState } from 'react';
import ArtifactControls from './ArtifactControls';
// import { useMessageStore } from "../../../stores/useMessageStore";

interface IProps {
  artifact: DemoArtifactType;
}

type Frame = DemoArtifactType['features'][0]['frames'][0];

const DemoArtifact = (props: IProps) => {
  const { artifact } = props;

  // const handleAddAIMessage = useMessageStore(
  //   (state) => state.handleAddAIMessage,
  // );

  const [activeFrameIndex, setActiveFrameIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const frames = artifact.features.reduce((acc, feature) => {
    return [...acc, ...feature.frames];
  }, [] as Frame[]);

  const handlePlayPause = () => {
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
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setActiveFrameIndex(0);
  };

  const renderFrame = (frame: Frame | undefined) => {
    if (!frame) return null;

    switch (frame.frame_type) {
      case 'IMAGE':
        return <img className="h-full w-full object-contain" src={frame.frame_url} alt={frame.frame_name} />;

      case 'VIDEO':
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

  useEffect(() => {
    if (frames.length === 0) return;

    const currentFrame = frames[activeFrameIndex];
    timeoutRef.current = setTimeout(() => {
      if (activeFrameIndex < frames.length - 1) {
        setActiveFrameIndex((prevIndex) => prevIndex + 1);
      }
    }, currentFrame.frame_interval * 1000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [activeFrameIndex, frames]);

  return (
    <div className="relative h-full w-full">
      {frames.length > 0 && renderFrame(frames[activeFrameIndex])}

      <ArtifactControls handlePause={handlePlayPause} handleRestart={handleRestart} />
    </div>
  );
};

export default DemoArtifact;
