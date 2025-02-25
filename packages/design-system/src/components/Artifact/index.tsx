import { AspectRatio } from '@breakout/design-system/components/layout/aspect-ratio';
import { cn } from '@breakout/design-system/lib/cn';
import { ArtifactContentUi } from './ArtifactContentUi';
import { WebSocketMessage, ArtifactBaseType } from '@meaku/core/types/webSocketData';
import { ArtifactContent } from '@meaku/core/types/artifact';

export interface ArtifactProps {
  isMediaTakingFullWidth: boolean;
  handleSendUserMessage: (data: Pick<WebSocketMessage, 'message' | 'message_type'>) => void;
  logoURL: string;
  activeArtifact: (ArtifactBaseType & { content?: ArtifactContent }) | null;
  handleToggleFullScreen: () => void;
  setIsArtifactPlaying: (isPlaying: boolean) => void;
  onSlideItemClick: (title: string) => void;
  isGeneratingArtifact: boolean;
  title?: string;
  description?: string;
  artifactContent: ArtifactContent | null;
}

const Artifact = ({
  logoURL,
  isMediaTakingFullWidth,
  handleSendUserMessage,
  activeArtifact,
  handleToggleFullScreen,
  setIsArtifactPlaying,
  onSlideItemClick,
  isGeneratingArtifact,
  artifactContent,
}: ArtifactProps) => {
  const activeArtifactId = activeArtifact?.artifact_id ?? '';
  const activeArtifactType = activeArtifact?.artifact_type;

  return (
    <div className={cn('col-span-2 mr-2 pl-2', { 'col-span-3': isMediaTakingFullWidth })}>
      <div className="flex h-full w-full items-center justify-center">
        <AspectRatio ratio={16 / 9}>
          <div className="group relative h-full w-full overflow-hidden rounded-xl">
            {isGeneratingArtifact ? (
              <div className="h-full w-full animate-pulse bg-gray-400" />
            ) : (
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
              />
            )}
          </div>
        </AspectRatio>
      </div>
    </div>
  );
};

export default Artifact;
