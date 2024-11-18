import { ArtifactResponse } from '@meaku/core/types/chat';
import useLocalStorageArtifact from './useLocalStorageArtifact';
import { useEffect } from 'react';

const useUpdateLocalStorageOnArtifactResponse = (artifact?: ArtifactResponse) => {
  const artifactTypesNotToCache = ['NONE', 'SUGGESTIONS'];

  const { handleUpdateArtifact } = useLocalStorageArtifact();

  useEffect(() => {
    if (!artifact) return;

    if (artifact.artifact_id && !artifactTypesNotToCache.includes(artifact.artifact_type)) {
      handleUpdateArtifact({
        activeArtifactId: artifact.artifact_id,
        activeArtifactType: artifact.artifact_type,
      });
    }
  }, [artifact?.artifact_id, artifact?.artifact_type]);
};

export default useUpdateLocalStorageOnArtifactResponse;
