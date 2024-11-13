import { ArtifactResponse } from '@meaku/core/types/chat';
import useLocalStorageArtifact from './useLocalStorageArtifact';

const useUpdateLocalStorageOnArtiactResponse = (artifact?: ArtifactResponse) => {
  const artifactTypesNotToCache = ['NONE', 'SUGGESTIONS'];

  const { handleUpdateArtifact } = useLocalStorageArtifact();

  if (!artifact) return;

  if (artifact.artifact_id && !artifactTypesNotToCache.includes(artifact.artifact_type)) {
    handleUpdateArtifact({
      activeArtifactId: artifact.artifact_id,
      activeArtifactType: artifact.artifact_type,
    });
  }
};

export default useUpdateLocalStorageOnArtiactResponse;
