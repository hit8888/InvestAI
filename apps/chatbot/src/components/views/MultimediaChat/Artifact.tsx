import { DemoArtifactType, SlideArtifactType } from "@meaku/core/types/chat";
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

  const { data: artifactData } = useArtifactData({
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

  const artifactContent = manager?.getArtifactContent();

  if (activeArtifactType === "NONE" || !activeArtifactId) return null;

  const renderArtifact = () => {
    switch (activeArtifactType) {
      case "SLIDE":
        return (
          <SlideArtifact artifact={artifactContent as SlideArtifactType} />
        );

      case "DEMO":
        return <DemoArtifact artifact={artifactContent as DemoArtifactType} />;

      case "VIDEO":
        return <VideoArtifact videoUrl={artifactContent as string} />;

      default:
        return <></>;
    }
  };

  return (
    <div className="ui-relative ui-h-full ui-w-full ui-overflow-hidden ui-rounded-xl">
      <button
        onClick={handleRemoveActiveArtifact}
        className="ui-absolute ui-right-6 ui-top-6 ui-z-10 ui-rounded-full ui-border ui-bg-white ui-bg-opacity-60 ui-p-1 ui-text-gray-700 ui-shadow-lg ui-backdrop-blur-lg"
      >
        <XIcon className="ui-h-4 ui-w-4" />
      </button>
      {renderArtifact()}
    </div>
  );
};

export default Artifact;
