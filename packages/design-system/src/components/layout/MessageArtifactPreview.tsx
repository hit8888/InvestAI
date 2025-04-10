import ArtifactManager from '@meaku/core/managers/ArtifactManager';
import {
  ArtifactEnum,
  SlideArtifactContent,
  SlideImageArtifactContent,
  VideoArtifactContent,
} from '@meaku/core/types/artifact';
import { ArtifactBaseType, WebSocketMessage } from '@meaku/core/types/webSocketData';
import { DemoPlayingStatus } from '@meaku/core/types/common';
import { checkIsArtifactMessage } from '@meaku/core/utils/index';
import ArtifactPreview from './ArtifactPreview';
import { cn } from '@breakout/design-system/lib/cn';

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
  if (artifactType === 'NONE' || !artifactType) return null;

  // Only show preview for SLIDE, SLIDE_IMAGE, and VIDEO artifacts
  if (!['SLIDE', 'SLIDE_IMAGE', 'VIDEO'].includes(artifactType)) return null;

  const artifactManager = new ArtifactManager(message.message);
  const content = artifactData.content;

  // Type guard to ensure content is of the correct type
  const isValidContent = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    content: any,
  ): content is SlideImageArtifactContent | SlideArtifactContent | VideoArtifactContent => {
    return (
      content !== null &&
      typeof content === 'object' &&
      (artifactType === 'SLIDE' || artifactType === 'SLIDE_IMAGE' || artifactType === 'VIDEO')
    );
  };

  if (!isValidContent(content)) return null;

  return (
    <div
      className={cn('mb-4 pl-11 pr-6', {
        'mt-4': !usingForAgent,
      })}
    >
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
