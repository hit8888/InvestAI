import { cn } from "@breakout/design-system/lib/cn";
import { useSearchParams } from "react-router-dom";

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

  if (!videoUrl) return null;

  return (
    <div className="h-full w-full">
      <video
        className={cn("h-full w-full", {
          "object-cover": expandVideo,
        })}
        controls
        autoPlay={true}
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoArtifact;
