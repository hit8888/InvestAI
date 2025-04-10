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
    <div className={cn('col-span-2 pl-2 pr-4 pt-4', { 'col-span-3': isMediaTakingFullWidth })}>
      <div className="flex h-full w-full items-center justify-center rounded-[10px] border border-gray-200 bg-transparent_gray_3 px-2">
        <AspectRatio ratio={16 / 9}>
          <div className="group relative h-full w-full overflow-hidden rounded-lg">
            {isGeneratingArtifact ? (
              <div className="h-full w-full animate-pulse bg-primary/10" />
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
