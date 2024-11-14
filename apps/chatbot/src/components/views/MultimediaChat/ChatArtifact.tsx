import {
  FormArtifactType,
  SuggestionArtifactType,
} from "@meaku/core/types/chat";
import { memo, useMemo } from "react";
import useArtifactData from "../../../hooks/query/useArtifactData.tsx";
import useWebSocketChat from "../../../hooks/useWebSocketChat.tsx";
import ArtifactManager from "../../../managers/ArtifactManager.ts";
import { useChatStore } from "../../../stores/useChatStore.ts";
import FormArtifact from "./FormArtifact.tsx";
import SuggestionsArtifact from "./SuggestionsArtifact.tsx";

interface IProps {
  showChatArtifact?: boolean;
}

const ChatArtifact = ({ showChatArtifact = false }: IProps) => {
  const activeChatArtifactId = useChatStore(
    (state) => state.activeChatArtifactId,
  );
  const activeChatArtifactType = useChatStore(
    (state) => state.activeChatArtifactType,
  );

  const { handleSendUserMessage } = useWebSocketChat();

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
      enabled: showChatArtifact,
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
            handleSendUserMessage={handleSendUserMessage}
          />
        );
      case "FORM":
        return <FormArtifact artifact={artifactContent as FormArtifactType} />;
      default:
        return <></>;
    }
  };

  if (!showChatArtifact) return null;

  if (activeChatArtifactType === null || !activeChatArtifactId || !artifactData)
    return null;

  if (isError || isFetching) {
    return <></>;
  }

  return <>{renderArtifact()}</>;
};

export default memo(ChatArtifact);
