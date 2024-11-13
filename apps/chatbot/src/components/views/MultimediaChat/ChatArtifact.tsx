import { useChatStore } from '../../../stores/useChatStore.ts';
import { useMemo } from 'react';
import { SuggestionArtifactType } from '@meaku/core/types/chat';
import SuggestionsArtifact from './SuggestionsArtifact.tsx';
import useArtifactDataQuery from '@meaku/core/queries/useArtifactDataQuery';
import ArtifactManager from '@meaku/core/managers/ArtifactManager';

const ChatArtifact = () => {
  const activeChatArtifactId = useChatStore((state) => state.activeChatArtifactId);
  const activeChatArtifactType = useChatStore((state) => state.activeChatArtifactType);

  const {
    data: artifactData,
    isFetching,
    isError,
  } = useArtifactDataQuery({
    artifactId: activeChatArtifactId || '',
    artifactType: activeChatArtifactType || 'NONE',
    queryOptions: {
      refetchInterval: (data) => {
        if (data) return false;

        return 1000;
      },
    },
  });

  const manager = useMemo(() => {
    if (!artifactData) return;

    return new ArtifactManager(artifactData);
  }, [artifactData]);

  const artifactType = manager?.getArtifactType();
  const artifactContent = manager?.getArtifactContent();

  const renderArtifact = () => {
    switch (artifactType) {
      case 'SUGGESTIONS':
        return <SuggestionsArtifact artifact={artifactContent as SuggestionArtifactType} />;
      default:
        return <></>;
    }
  };

  if (activeChatArtifactType === null || !activeChatArtifactId || !artifactData) return null;

  if (isError || isFetching) {
    return <></>;
  }

  return renderArtifact();
};

export default ChatArtifact;
