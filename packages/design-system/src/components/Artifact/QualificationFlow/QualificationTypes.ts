import {
  ArtifactContent,
  FormArtifactContent,
  FormArtifactMetadataType,
  QualificationQuestionMetadataType,
} from '@meaku/core/types/artifact';
import { WebSocketMessage } from '@meaku/core/types/webSocketData';

export type QualificationFlowArtifactProps = {
  artifact: {
    artifact_id: string;
    content: FormArtifactContent;
    metadata: FormArtifactMetadataType | QualificationQuestionMetadataType;
  };
  handleSendUserMessage: (data: Pick<WebSocketMessage, 'message' | 'message_type'>) => void;
};

export type ArtifactContentWithMetadataProps =
  | ({
      metadata: FormArtifactMetadataType | QualificationQuestionMetadataType;
    } & ArtifactContent)
  | null;
