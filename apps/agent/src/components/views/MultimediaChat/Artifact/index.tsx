import { AspectRatio } from '@breakout/design-system/components/layout/aspect-ratio';
import { memo } from 'react';
import { cn } from '@breakout/design-system/lib/cn';
import { IWebSocketHandleMessage } from '../../../../hooks/useWebSocketChat';
import { ArtifactEnum } from '@meaku/core/types/agent';
import { useArtifactData } from './hooks/useArtifactData';
import { ArtifactContentUi } from './ArtifactContentUi';

export interface ArtifactProps {
  isMediaTakingFullWidth: boolean;
  handleSendUserMessage: (data: IWebSocketHandleMessage) => void;
  activeArtifactId: string;
  activeArtifactType: ArtifactEnum;
}

const Artifact = ({
  isMediaTakingFullWidth,
  handleSendUserMessage,
  activeArtifactId,
  activeArtifactType,
}: ArtifactProps) => {
  const { isFetching, isError, artifactType, artifactContent } = useArtifactData();

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
