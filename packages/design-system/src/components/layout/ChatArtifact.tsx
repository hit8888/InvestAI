import {
  FormArtifactMetadataType,
  FormArtifactContent,
  SuggestionArtifactContent,
  MessageArtifactType,
} from '@meaku/core/types/agent';
import { memo, useMemo } from 'react';
import FormArtifact from './FormArtifact.tsx';
import SuggestionsArtifact from './SuggestionsArtifact.tsx';
import useArtifactDataQuery from '@meaku/core/queries/useArtifactDataQuery';
import ArtifactManager from '@meaku/core/managers/ArtifactManager';
import { IWebSocketHandleMessage } from '@meaku/core/types/webSocket';

interface IProps {
  isAMessageBeingProcessed: boolean;
  artifact?: MessageArtifactType;
  messageIndex: number;
  totalMessages: number;
  handleSendUserMessage: (data: IWebSocketHandleMessage) => void;
}

const ChatArtifact = ({ artifact, messageIndex, totalMessages, handleSendUserMessage, isAMessageBeingProcessed }: IProps) => {
  const artifactType = artifact?.artifact_type;

  const shouldGetArtifactData = artifactType == 'FORM' || messageIndex === totalMessages - 1;

  const {
    data: artifactData,
    isFetching,
    isError,
  } = useArtifactDataQuery({
    artifactId: artifact?.artifact_id ?? null,
    artifactType: artifactType ?? null,
    queryOptions: {
      enabled: shouldGetArtifactData,
    },
  });

  const manager = useMemo(() => {
    if (!artifactData) return;

    return new ArtifactManager(artifactData);
  }, [artifactData]);

  const artifactContent = manager?.getArtifactContent();
  const artifactMetadata = manager?.getArtifactMetaData();

  const renderArtifact = () => {
    switch (artifactType) {
      case 'SUGGESTIONS':
        if (!shouldGetArtifactData) return <></>;
        return (
          <SuggestionsArtifact
            isAMessageBeingProcessed={isAMessageBeingProcessed}
            artifact={artifactContent as SuggestionArtifactContent}
            handleSendUserMessage={handleSendUserMessage}
          />
        );
      case 'FORM':
        return (
          <FormArtifact
            artifactId={artifact?.artifact_id}
            artifact={artifactContent as FormArtifactContent}
            artifactMetadata={artifactMetadata as FormArtifactMetadataType}
            handleSendUserMessage={handleSendUserMessage}
          />
        );
      default:
        return <></>;
    }
  };

  if (!artifact || !artifactData) return <></>;

  if (isError || isFetching) {
    return <></>;
  }

  return <>{renderArtifact()}</>;
};

export default memo(ChatArtifact);
