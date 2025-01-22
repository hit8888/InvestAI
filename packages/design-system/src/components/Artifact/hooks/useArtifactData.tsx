import { useEffect } from 'react';
import useArtifactDataQuery from '@meaku/core/queries/useArtifactDataQuery';
import ArtifactManager from '@meaku/core/managers/ArtifactManager';
import { GetArtifactPayload } from '@meaku/core/types/api';

interface UseArtifactDataProps {
  activeArtifact: GetArtifactPayload | null;
  setActiveArtifact: (artifact: GetArtifactPayload | null) => void;
  previousArtifact: GetArtifactPayload | null;
  setPreviousActiveArtifact: (artifact: GetArtifactPayload | null) => void;
}

export const useArtifactData = ({
  activeArtifact,
  previousArtifact,
  setActiveArtifact,
  setPreviousActiveArtifact,
}: UseArtifactDataProps) => {
  const mainQuery = useArtifactDataQuery({
    artifactId: activeArtifact?.artifactId ?? '',
    artifactType: activeArtifact?.artifactType ?? 'NONE',
    queryOptions: {
      enabled: !!activeArtifact?.artifactId && !!activeArtifact?.artifactType,
    },
  });

  const data = mainQuery.data;
  const manager = data ? new ArtifactManager(data) : null;

  //In case of error, set the active artifact back to the previous one
  useEffect(() => {
    if (mainQuery.isError) {
      setActiveArtifact(previousArtifact);
    }
  }, [mainQuery.isError, previousArtifact, setActiveArtifact]);

  //Update the previous active artifact when the current one is successfully fetched
  useEffect(() => {
    if (mainQuery.isSuccess && data?.artifact_id && data?.artifact_type) {
      setPreviousActiveArtifact({ artifactId: data.artifact_id, artifactType: data.artifact_type });
    }
  }, [data?.artifact_id, data?.artifact_type, mainQuery.isSuccess, setPreviousActiveArtifact]);

  return {
    ...mainQuery,
    data,
    manager,
    artifactType: manager?.getArtifactType(),
    artifactContent: manager?.getArtifactContent(),
    isLoading: mainQuery.isLoading,
  };
};
