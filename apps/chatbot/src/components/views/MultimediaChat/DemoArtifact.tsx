import { DemoArtifactType } from "@meaku/core/types/chat";
import { useEffect, useState } from "react";

interface IProps {
  artifact: DemoArtifactType;
}

type Frame = DemoArtifactType["features"][0]["frames"][0];

const DemoArtifact = (props: IProps) => {
  const { artifact } = props;

  const [activeFrameIndex, setActiveFrameIndex] = useState(0);

  const frames = artifact.features.reduce((acc, feature) => {
    return [...acc, ...feature.frames];
  }, [] as Frame[]);

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

  useEffect(() => {
    if (frames.length === 0) return;

    const currentFrame = frames[activeFrameIndex];
    const timeoutId = setTimeout(() => {
      if (activeFrameIndex < frames.length - 1) {
        setActiveFrameIndex((prevIndex) => prevIndex + 1);
      }
    }, currentFrame.frame_interval * 1000);

    return () => clearTimeout(timeoutId);
  }, [activeFrameIndex, frames]);

  return (
    <div className="h-full w-full">
      {frames.length > 0 && renderFrame(frames[activeFrameIndex])}
    </div>
  );
};

export default DemoArtifact;
