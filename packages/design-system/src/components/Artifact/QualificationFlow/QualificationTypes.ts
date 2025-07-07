import {
  ArtifactContent,
  FormArtifactContent,
  FormArtifactMetadataType,
  QualificationQuestionMetadataType,
} from '@meaku/core/types/artifact';
import { ViewType } from '@meaku/core/types/common';
import { SendUserMessageParams, WebSocketMessage } from '@meaku/core/types/webSocketData';

export type QualificationFlowArtifactProps = {
  artifact: {
    artifact_id: string;
    content: FormArtifactContent;
    metadata: FormArtifactMetadataType | QualificationQuestionMetadataType;
    ctaEvent?: WebSocketMessage;
    response_id?: string;
  };
  handleSendUserMessage: (params: SendUserMessageParams) => void;
  viewType?: ViewType;
};

export type ArtifactContentWithMetadataProps =
  | ({
      metadata: FormArtifactMetadataType | QualificationQuestionMetadataType;
      ctaEvent?: WebSocketMessage;
    } & ArtifactContent)
  | null;
