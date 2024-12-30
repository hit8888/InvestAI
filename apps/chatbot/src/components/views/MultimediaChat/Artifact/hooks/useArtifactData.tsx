import useArtifactDataQuery from '@meaku/core/queries/useArtifactDataQuery';
import ArtifactManager from '@meaku/core/managers/ArtifactManager';
import { useArtifactStore } from '../../../../../stores/useArtifactStore';
import { useEffect } from 'react';

export const useArtifactData = () => {
  const activeArtifact = useArtifactStore((state) => state.activeArtifact);
  const previousArtifact = useArtifactStore((state) => state.previousArtifact);
  const setActiveArtifact = useArtifactStore((state) => state.setActiveArtifact);
  const setPreviousActiveArtifact = useArtifactStore((state) => state.setPreviousActiveArtifact);

  const mainQuery = useArtifactDataQuery({
    artifactId: activeArtifact?.artifactId ?? '',
    artifactType: activeArtifact?.artifactType ?? 'NONE',
    queryOptions: {
      refetchInterval: (data) => (data ? false : 1000),
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
