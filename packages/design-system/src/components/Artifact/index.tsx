import { AspectRatio } from '@breakout/design-system/components/layout/aspect-ratio';
import { memo } from 'react';
import { cn } from '@breakout/design-system/lib/cn';
import { useArtifactData } from './hooks/useArtifactData';
import { ArtifactContentUi } from './ArtifactContentUi';
import { IWebSocketHandleMessage } from '@meaku/core/types/webSocket';
import { GetArtifactPayload } from '@meaku/core/types/api';

export interface ArtifactProps {
  isMediaTakingFullWidth: boolean;
  handleSendUserMessage: (data: IWebSocketHandleMessage) => void;
  logoURL: string;
  activeArtifact: GetArtifactPayload | null;
  setActiveArtifact: (artifact: GetArtifactPayload | null) => void;
  previousArtifact: GetArtifactPayload | null;
  setPreviousActiveArtifact: (artifact: GetArtifactPayload | null) => void;
  handleToggleFullScreen: () => void;
  setIsArtifactPlaying: (isPlaying: boolean) => void;
}

const Artifact = ({
  logoURL,
  isMediaTakingFullWidth,
  handleSendUserMessage,
  activeArtifact,
  setActiveArtifact,
  setPreviousActiveArtifact,
  previousArtifact,
  handleToggleFullScreen,
  setIsArtifactPlaying
}: ArtifactProps) => {

  const activeArtifactId = activeArtifact?.artifactId ?? '';
  const activeArtifactType = activeArtifact?.artifactType;

  const { isFetching, isError, artifactType, artifactContent } = useArtifactData({
    activeArtifact,
    previousArtifact,
    setActiveArtifact,
    setPreviousActiveArtifact
  });

  if (activeArtifactType === 'NONE' || isError) return null;

  return (
    <div className={cn('col-span-2 mr-2 pl-2', { 'col-span-3': isMediaTakingFullWidth })}>
      <div className="flex h-full w-full items-center justify-center">
        <AspectRatio ratio={16 / 9}>
          <div className="group relative h-full w-full overflow-hidden rounded-xl">
            {isFetching ? (
              <div className="h-full w-full animate-pulse bg-gray-50" />
            ) : (
              <ArtifactContentUi
                logoURL={logoURL}
                handleToggleFullScreen={handleToggleFullScreen}
                setIsArtifactPlaying={setIsArtifactPlaying}
                artifactType={artifactType}
                artifactContent={artifactContent}
                activeArtifactId={activeArtifactId}
                handleSendUserMessage={handleSendUserMessage}
                isMediaTakingFullWidth={isMediaTakingFullWidth}
              />
            )}
          </div>
        </AspectRatio>
      </div>
    </div>
  );
};

export default memo(Artifact);
