import {
  FormArtifactMetadataType,
  FormArtifactType,
  MessageArtifactSchema,
  SuggestionArtifactType,
} from '@meaku/core/types/chat';
import { memo, useMemo } from 'react';
import { z } from 'zod';
import useWebSocketChat from '../../../hooks/useWebSocketChat.tsx';
import FormArtifact from './FormArtifact.tsx';
import SuggestionsArtifact from './SuggestionsArtifact.tsx';
import useArtifactDataQuery from '@meaku/core/queries/useArtifactDataQuery';
import useUpdateLocalStorageOnArtifactResponse from '../../../hooks/useUpdateLocalStorageOnArtifactResponse.ts';
import ArtifactManager from '@meaku/core/managers/ArtifactManager';

interface IProps {
  artifact?: z.infer<typeof MessageArtifactSchema>;
  messageIndex: number;
  totalMessages: number;
}

const ChatArtifact = ({ artifact, messageIndex, totalMessages }: IProps) => {
  const { handleSendUserMessage } = useWebSocketChat();

  const artifactType = artifact?.artifact_type;

  const shouldGetArtifactData = artifactType == 'FORM' || messageIndex === totalMessages - 1;
  console.log('ChatArtifact', {
    artifact,
    enabled: artifactType == 'FORM' || messageIndex === totalMessages - 1,
  });

  const {
    data: artifactData,
    isFetching,
    isError,
  } = useArtifactDataQuery({
    artifactId: artifact?.artifact_id ?? null,
    artifactType: artifactType ?? null,
    queryOptions: {
      refetchInterval: (data) => {
        if (data) return false;

        return 1000;
      },
      enabled: shouldGetArtifactData,
    },
  });

  useUpdateLocalStorageOnArtifactResponse(artifactData);

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
            artifact={artifactContent as SuggestionArtifactType}
            handleSendUserMessage={handleSendUserMessage}
          />
        );
      case 'FORM':
        return (
          <FormArtifact
            artifactId={artifact?.artifact_id}
            artifact={artifactContent as FormArtifactType}
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
