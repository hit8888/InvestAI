import { FormArtifactMetadataType, WebSocketMessage } from '@meaku/core/types/webSocketData';
import FormArtifact from './FormArtifact.tsx';
import SuggestionsArtifact from './SuggestionsArtifact.tsx';
import { FormArtifactContent, SuggestionArtifactContent } from '@meaku/core/types/artifact';

interface IProps {
  isAMessageBeingProcessed: boolean;
  artifact: {
    artifact_type: string;
    artifact_id: string;
    content: FormArtifactContent | SuggestionArtifactContent;
    metadata?: FormArtifactMetadataType;
    error?: string | null;
    error_code?: string | null;
  };
  messageIndex: number;
  totalMessages: number;
  handleSendUserMessage: (data: Pick<WebSocketMessage, 'message' | 'message_type'>) => void;
}

const ChatArtifact = ({
  artifact,
  messageIndex,
  totalMessages,
  handleSendUserMessage,
  isAMessageBeingProcessed,
}: IProps) => {
  const artifactType = artifact?.artifact_type;
  // Only apply the last message check for FORM artifacts
  const shouldGetArtifactData = artifactType === 'FORM' ? messageIndex === totalMessages - 1 : true;

  const renderArtifact = () => {
    switch (artifactType) {
      case 'SUGGESTIONS':
        return (
          <SuggestionsArtifact
            suggestedQuestionOrientation="left"
            isAMessageBeingProcessed={isAMessageBeingProcessed}
            artifact={artifact.content as SuggestionArtifactContent}
            handleSendUserMessage={handleSendUserMessage}
          />
        );
      case 'FORM':
        if (!shouldGetArtifactData) return <></>;
        return (
          <FormArtifact
            artifactId={artifact.artifact_id}
            artifact={artifact.content as FormArtifactContent}
            artifactMetadata={artifact.metadata as FormArtifactMetadataType}
            handleSendUserMessage={handleSendUserMessage}
          />
        );
      default:
        return <></>;
    }
  };

  return <>{renderArtifact()}</>;
};

export default ChatArtifact;
