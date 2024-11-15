import {
  FormArtifactType,
  MessageArtifactSchema,
  SuggestionArtifactType,
} from "@meaku/core/types/chat";
import { memo, useMemo } from "react";
import useArtifactData from "../../../hooks/query/useArtifactData.tsx";
import useWebSocketChat from "../../../hooks/useWebSocketChat.tsx";
import ArtifactManager from "../../../managers/ArtifactManager.ts";
import FormArtifact from "./FormArtifact.tsx";
import SuggestionsArtifact from "./SuggestionsArtifact.tsx";
import { z } from "zod";

interface IProps {
  artifact?: z.infer<typeof MessageArtifactSchema>;
  messageIndex: number;
  totalMessages: number;
}

const ChatArtifact = ({ artifact, messageIndex, totalMessages }: IProps) => {
  const { handleSendUserMessage } = useWebSocketChat();

  const isLastMessage = messageIndex === totalMessages - 1;

  const artifactType = artifact?.artifact_type;

  const {
    data: artifactData,
    isFetching,
    isError,
  } = useArtifactData({
    artifactId: artifact?.artifact_id,
    artifactType: artifactType,
    options: {
      refetchInterval: (data) => {
        if (data) return false;

        return 1000;
      },
      enabled: isLastMessage,
    },
  });

  const manager = useMemo(() => {
    if (!artifactData) return;

    return new ArtifactManager(artifactData);
  }, [artifactData]);

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
        return (
          <FormArtifact
            artifact={artifactContent as FormArtifactType}
            handleSendUserMessage={handleSendUserMessage}
          />
        );
      default:
        return <></>;
    }
  };

  if (!artifact) return <></>;

  if (isError || isFetching) {
    return <></>;
  }

  return <>{renderArtifact()}</>;
};

export default memo(ChatArtifact);
