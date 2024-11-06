import { AspectRatio } from "@breakout/design-system/components/layout/aspect-ratio";
import {
  DemoArtifactType,
  SlideArtifactType,
  SlideImageArtifactType,
} from "@meaku/core/types/chat";
import { XIcon } from "lucide-react";
import { useMemo } from "react";
import useArtifactData from "../../../hooks/query/useArtifactData";
import ArtifactManager from "../../../managers/ArtifactManager";
import { useArtifactStore } from "../../../stores/useArtifactStore";
import DemoArtifact from "./DemoArtifact";
import SlideArtifact from "./SlideArtifact";
import VideoArtifact from "./VideoArtifact";

const Artifact = () => {
  const activeArtifactId = useArtifactStore((state) => state.activeArtifactId);
  const activeArtifactType = useArtifactStore(
    (state) => state.activeArtifactType,
  );
  const handleRemoveActiveArtifact = useArtifactStore(
    (state) => state.handleRemoveActiveArtifact,
  );

  const {
    data: artifactData,
    isFetching,
    isError,
  } = useArtifactData({
    artifactId: activeArtifactId || "",
    artifactType: activeArtifactType || "NONE",
    options: {
      refetchInterval: (data) => {
        if (data) return false;

        return 1000;
      },
    },
  });

  const manager = useMemo(() => {
    if (!artifactData) return;

    return new ArtifactManager(artifactData);
  }, [artifactData]);

  const artifactType = manager?.getArtifactType();
  const artifactContent = manager?.getArtifactContent();

  const renderArtifact = () => {
    switch (artifactType) {
      case "SLIDE":
        return (
          <SlideArtifact artifact={artifactContent as SlideArtifactType} />
        );

      case "SLIDE_IMAGE":
        return (
          <img
            src={(artifactContent as SlideImageArtifactType).image_url}
            alt="Slide"
            className="h-full w-full"
          />
        );

      case "DEMO":
        return <DemoArtifact artifact={artifactContent as DemoArtifactType} />;

      case "VIDEO":
        return <VideoArtifact videoUrl={artifactContent as string} />;

      default:
        return <></>;
    }
  };

  if (activeArtifactType === "NONE" || !activeArtifactId || !artifactData)
    return null;

  if (isError) {
    return <></>;
  }

  return (
    <div className="flex h-full w-full items-center justify-center">
      <AspectRatio ratio={16 / 9}>
        <div className="relative h-full w-full overflow-hidden rounded-xl">
          <button
            onClick={handleRemoveActiveArtifact}
            className="absolute right-6 top-6 z-10 rounded-full border bg-white bg-opacity-60 p-1 text-gray-700 shadow-lg backdrop-blur-lg"
          >
            <XIcon className="h-4 w-4" />
          </button>
          {isFetching ? (
            <div className="h-full w-full animate-pulse bg-gray-50"></div>
          ) : (
            renderArtifact()
          )}
        </div>
      </AspectRatio>
    </div>
  );
};

export default Artifact;
