import { useChatStore } from "../../../stores/useChatStore.ts";
import useArtifactData from "../../../hooks/query/useArtifactData.tsx";
import { useMemo } from "react";
import ArtifactManager from "../../../managers/ArtifactManager.ts";
import { SuggestionArtifactType } from "@meaku/core/types/chat";
import SuggestionsArtifact from "./SuggestionsArtifact.tsx";

const ChatArtifact = () => {
  const activeChatArtifactId = useChatStore(
    (state) => state.activeChatArtifactId,
  );
  const activeChatArtifactType = useChatStore(
    (state) => state.activeChatArtifactType,
  );

  const {
    data: artifactData,
    isFetching,
    isError,
  } = useArtifactData({
    artifactId: activeChatArtifactId || "",
    artifactType: activeChatArtifactType || "NONE",
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
      case "SUGGESTIONS":
        return (
          <SuggestionsArtifact
            artifact={artifactContent as SuggestionArtifactType}
          />
        );
      default:
        return <></>;
    }
  };

  if (activeChatArtifactType === null || !activeChatArtifactId || !artifactData)
    return null;

  if (isError || isFetching) {
    return <></>;
  }

  return renderArtifact();
};

export default ChatArtifact;
