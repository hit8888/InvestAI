import {
  ArtifactContent,
  ArtifactEnum,
  FormArtifactContent,
  SlideArtifactContent,
  VideoArtifactContent,
  SlideImageArtifactContent,
  ArtifactContentWithMetadataProps,
} from '@meaku/core/types/artifact';
import { ArtifactBaseType, WebSocketMessage } from '@meaku/core/types/webSocketData';
import { DemoPlayingStatus } from '@meaku/core/types/common';
import { checkIsArtifactMessage } from '@meaku/core/utils/index';
import ArtifactPreview from './ArtifactPreview';
import { checkIsQualificationFormArtifact, BASE_ARTIFACT_TYPES } from '@meaku/core/utils/messageUtils';
import { ViewType } from '@meaku/core/types/common';
import useNormalAndQualificationFormArtifactMetadataProvider from '@meaku/core/hooks/useNormalAndQualificationFormArtifactMetadataProvider';
import MessageItemLayout, { Padding } from './MessageItemLayout';

interface MessageArtifactPreviewProps {
  message: WebSocketMessage;
  viewType: ViewType;
  setDemoPlayingStatus: (value: DemoPlayingStatus) => void;
  setActiveArtifact: (artifact: ArtifactBaseType | null) => void;
  logoURL: string | null;
  messages: WebSocketMessage[];
  artifactTitle: string;
}

const MessageArtifactPreview = ({
  message,
  viewType,
  setDemoPlayingStatus,
  setActiveArtifact,
  logoURL,
  messages,
  artifactTitle,
}: MessageArtifactPreviewProps) => {
  const isArtifactMessage = checkIsArtifactMessage(message);

  const { artifactContentWithMetadata } = useNormalAndQualificationFormArtifactMetadataProvider({
    artifactId: isArtifactMessage ? (message.message?.artifact_data?.artifact_id ?? '') : '',
    messages,
  });

  if (!isArtifactMessage) return null;

  const artifactData = message.message?.artifact_data;
  const artifactType = artifactData?.artifact_type;

  // Narrow down the type and ensure it's a valid ArtifactEnum
  if (artifactType === 'NONE' || artifactType === 'SUGGESTIONS' || !artifactType) return null;

  // Only show preview for SLIDE, SLIDE_IMAGE, FORM and VIDEO artifacts
  if (!BASE_ARTIFACT_TYPES.includes(artifactType)) return null;

  const content = artifactData.content;

  // Type guard to ensure content is of the correct type
  const isQualificationFormArtifactValid = artifactType === 'FORM' && checkIsQualificationFormArtifact(message);
  const isValidContent = (
    content: ArtifactContent | null,
  ): content is SlideImageArtifactContent | SlideArtifactContent | VideoArtifactContent | FormArtifactContent => {
    const isMediaArtifactValid = BASE_ARTIFACT_TYPES.includes(artifactType);
    return (
      content !== null && typeof content === 'object' && (isQualificationFormArtifactValid || isMediaArtifactValid)
    );
  };

  if (!isValidContent(content)) return null;

  return (
    <MessageItemLayout paddingInline={Padding.INLINE}>
      <ArtifactPreview
        viewType={viewType}
        artifactId={artifactData.artifact_id}
        artifactType={artifactType as ArtifactEnum}
        setDemoPlayingStatus={setDemoPlayingStatus}
        setActiveArtifact={setActiveArtifact}
        logoURL={logoURL}
        title={artifactTitle}
        artifactContent={content}
        isError={!!artifactData.error}
        isFetching={false}
        artifactContentWithMetadata={artifactContentWithMetadata as ArtifactContentWithMetadataProps}
        isQualificationFormArtifact={isQualificationFormArtifactValid}
      />
    </MessageItemLayout>
  );
};

export default MessageArtifactPreview;
