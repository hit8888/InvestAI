import { cn } from '@breakout/design-system/lib/cn';
import { ArtifactContentUi } from './ArtifactContentUi';
import { WebSocketMessage, ArtifactBaseType } from '@meaku/core/types/webSocketData';
import { ArtifactContent, ArtifactContentWithMetadataProps } from '@meaku/core/types/artifact';
import { ViewType } from '@meaku/core/types/common';

export interface ArtifactProps {
  viewType: ViewType;
  isMediaTakingFullWidth: boolean;
  handleSendUserMessage: (data: Pick<WebSocketMessage, 'message' | 'message_type'>) => void;
  logoURL: string;
  activeArtifact: (ArtifactBaseType & { content?: ArtifactContent; response_id?: string }) | null;
  handleToggleFullScreen: () => void;
  setIsArtifactPlaying: (isPlaying: boolean) => void;
  onSlideItemClick: (title: string) => void;
  isGeneratingArtifact?: boolean;
  title?: string;
  description?: string;
  artifactContent: ArtifactContentWithMetadataProps;
  isQualificationFormArtifact?: boolean;
}

const Artifact = ({
  logoURL,
  viewType,
  isMediaTakingFullWidth,
  handleSendUserMessage,
  activeArtifact,
  handleToggleFullScreen,
  setIsArtifactPlaying,
  onSlideItemClick,
  isGeneratingArtifact,
  artifactContent,
  isQualificationFormArtifact,
}: ArtifactProps) => {
  const activeArtifactId = activeArtifact?.artifact_id ?? '';
  const activeArtifactType = activeArtifact?.artifact_type;
  const activeArtifactResponseId = activeArtifact?.response_id;

  return (
    <div className={cn('w-full pl-2 pr-4 pt-4', { 'overflow-hidden pb-4': isMediaTakingFullWidth })}>
      <div className="flex h-full max-h-full w-full items-center justify-center rounded-[10px] border border-gray-200 bg-transparent_gray_3 p-2">
        <div className="group relative flex h-full w-full items-center justify-center overflow-hidden rounded-lg">
          {isGeneratingArtifact ? (
            <div className="h-full w-full animate-pulse bg-primary/10" />
          ) : (
            <>
              <ArtifactContentUi
                logoURL={logoURL}
                handleToggleFullScreen={handleToggleFullScreen}
                setIsArtifactPlaying={setIsArtifactPlaying}
                artifactType={activeArtifactType}
                artifactContent={artifactContent}
                activeArtifactId={activeArtifactId}
                handleSendUserMessage={handleSendUserMessage}
                isMediaTakingFullWidth={isMediaTakingFullWidth}
                onSlideItemClick={onSlideItemClick}
                isQualificationFormArtifact={isQualificationFormArtifact}
                viewType={viewType}
                activeArtifactResponseId={activeArtifactResponseId}
              />
              {viewType === ViewType.USER ? null : <div className="bg-gray absolute inset-0 z-10 bg-opacity-10" />}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Artifact;
