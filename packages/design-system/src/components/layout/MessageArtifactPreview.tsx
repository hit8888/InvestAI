import ArtifactManager from '@meaku/core/managers/ArtifactManager';
import {
  ArtifactContent,
  ArtifactEnum,
  FormArtifactContent,
  SlideArtifactContent,
  SlideImageArtifactContent,
  VideoArtifactContent,
} from '@meaku/core/types/artifact';
import { ArtifactBaseType, WebSocketMessage } from '@meaku/core/types/webSocketData';
import { DemoPlayingStatus } from '@meaku/core/types/common';
import { checkIsArtifactMessage } from '@meaku/core/utils/index';
import ArtifactPreview from './ArtifactPreview';
import { checkIsQualificationFormArtifact, MEDIA_ARTIFACT_PREVIEW_TYPES } from '@meaku/core/utils/messageUtils';

interface MessageArtifactPreviewProps {
  message: WebSocketMessage;
  usingForAgent: boolean;
  setDemoPlayingStatus: (value: DemoPlayingStatus) => void;
  setActiveArtifact: (artifact: ArtifactBaseType | null) => void;
  logoURL: string | null;
}

const MessageArtifactPreview = ({
  message,
  usingForAgent,
  setDemoPlayingStatus,
  setActiveArtifact,
  logoURL,
}: MessageArtifactPreviewProps) => {
  if (!checkIsArtifactMessage(message)) return null;

  const artifactData = message.message?.artifact_data;
  const artifactType = artifactData?.artifact_type;

  // Narrow down the type and ensure it's a valid ArtifactEnum
  if (artifactType === 'NONE' || artifactType === 'SUGGESTIONS' || artifactType === 'CALENDAR' || !artifactType)
    return null;

  // Only show preview for SLIDE, SLIDE_IMAGE, FORM and VIDEO artifacts
  if (!MEDIA_ARTIFACT_PREVIEW_TYPES.includes(artifactType)) return null;

  const artifactManager = new ArtifactManager(message.message);
  const content = artifactData.content;

  // Type guard to ensure content is of the correct type
  const isValidContent = (
    content: ArtifactContent | null,
  ): content is SlideImageArtifactContent | SlideArtifactContent | VideoArtifactContent | FormArtifactContent => {
    const isQualificationFormArtifactValid = artifactType === 'FORM' && checkIsQualificationFormArtifact(message);

    const isMediaArtifactValid = MEDIA_ARTIFACT_PREVIEW_TYPES.includes(artifactType);
    return (
      content !== null && typeof content === 'object' && (isQualificationFormArtifactValid || isMediaArtifactValid)
    );
  };

  if (!isValidContent(content)) return null;

  return (
    <div className="my-4 pl-11 pr-6">
      <ArtifactPreview
        usingForAgent={usingForAgent}
        artifactId={artifactData.artifact_id}
        artifactType={artifactType as ArtifactEnum}
        setDemoPlayingStatus={setDemoPlayingStatus}
        setActiveArtifact={setActiveArtifact}
        logoURL={logoURL}
        title={artifactManager.getArtifactTitle()}
        artifactContent={content}
        isError={!!artifactData.error}
        isFetching={false}
      />
    </div>
  );
};

export default MessageArtifactPreview;
