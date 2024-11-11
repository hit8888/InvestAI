import { cn } from "@breakout/design-system/lib/cn";
import { useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useChatStore } from "../../../stores/useChatStore";
import ArtifactControls from "./ArtifactControls";

interface IProps {
  videoUrl: string;
}

type QueryParams = {
  expandVideo?: boolean;
};

const VideoArtifact = (props: IProps) => {
  const { videoUrl } = props;

  const [searchParams] = useSearchParams();
  const { expandVideo }: QueryParams = {
    expandVideo: searchParams.get("expandVideo") === "true",
  };

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const isChatMaximized = useChatStore((state) => state.isChatMaximized);

  const handlePlayPauseVideo = () => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  };

  const handleRestartVideo = () => {
    if (!videoRef.current) return;

    videoRef.current.currentTime = 0;
    videoRef.current.play();
  };

  if (!videoUrl) return null;

  return (
    <div
      className={cn("relative", {
        "h-full w-full": !isChatMaximized,
        "h-full w-auto": isChatMaximized,
      })}
    >
      <video
        ref={videoRef}
        className={cn("absolute inset-0 h-full max-h-full w-full max-w-full", {
          "object-cover": expandVideo,
          "object-contain": isChatMaximized,
        })}
        // controls
        autoPlay={true}
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="absolute inset-0 z-10" onClick={handlePlayPauseVideo} />

      <ArtifactControls
        handlePause={handlePlayPauseVideo}
        handleRestart={handleRestartVideo}
      />
    </div>
  );
};

export default VideoArtifact;
