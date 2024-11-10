import { AspectRatio } from "@breakout/design-system/components/layout/aspect-ratio";
import {
  DemoArtifactType,
  SlideArtifactType,
  SlideImageArtifactType,
  VideoArtifactType,
} from "@meaku/core/types/chat";
import { useMemo } from "react";
import useArtifactDataQuery from "@meaku/core/queries/useArtifactDataQuery";
import ArtifactManager from "../../../../../../packages/core/src/managers/ArtifactManager";
import { useArtifactStore } from "../../../stores/useArtifactStore";
import DemoArtifact from "./DemoArtifact";
import SlideArtifact from "./SlideArtifact";
import VideoArtifact from "./VideoArtifact";

const Artifact = () => {
  const activeArtifactId = useArtifactStore((state) => state.activeArtifactId);
  const activeArtifactType = useArtifactStore(
    (state) => state.activeArtifactType,
  );
  // const handleRemoveActiveArtifact = useArtifactStore(
  //   (state) => state.handleRemoveActiveArtifact,
  // );

  const { data: artifactData, isFetching, isError } = useArtifactDataQuery({
    artifactId: activeArtifactId || "",
    artifactType: activeArtifactType || "NONE",
    queryOptions: {
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
        return (
          <VideoArtifact
            videoUrl={(artifactContent as VideoArtifactType).video_url}
          />
        );

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
        <div className="group relative h-full w-full overflow-hidden rounded-xl">
          {/* Uncomment this if a close button is needed */}
          {/* <button
            onClick={handleRemoveActiveArtifact}
            className="absolute right-6 top-6 z-10 rounded-full border bg-white bg-opacity-60 p-1 text-gray-700 shadow-lg backdrop-blur-lg"
          >
            <XIcon className="h-4 w-4" />
          </button> */}
          {isFetching ? (
            <div className="h-full w-full animate-pulse bg-gray-50"></div>
          ) : (
            renderArtifact()
          )}

          {/* <div className="absolute bottom-0 left-0 right-0 flex h-14 translate-y-full transform items-center justify-between bg-gradient-to-t from-black/50 to-transparent p-6 text-white opacity-0 transition-all duration-300 ease-in-out group-hover:translate-y-0 group-hover:opacity-100">
            <div>
              <Button
                size="icon"
                className="h-8 w-8 border-2 border-gray-50 bg-transparent transition-colors duration-300 hover:bg-gray-50 hover:text-gray-900"
              >
                <PauseIcon className="h-4 w-4 fill-current" />
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <Button
                size="icon"
                className="h-8 w-8 border-2 border-gray-50 bg-transparent transition-colors duration-300 hover:bg-gray-50 hover:text-gray-900"
              >
                <MaximizeIcon className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                className="h-8 w-8 border-2 border-gray-50 bg-transparent transition-colors duration-300 hover:bg-gray-50 hover:text-gray-900"
              >
                <RotateCcwIcon className="h-4 w-4" />
              </Button>
            </div>
          </div> */}
        </div>
      </AspectRatio>
    </div>
  );
};

export default Artifact;
