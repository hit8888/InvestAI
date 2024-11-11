import { ArtifactEnum } from '@meaku/core/types/chat';
import { ChatParams } from '@meaku/core/types/config';
import { useLocalStorageState } from 'ahooks';
import { useParams } from 'react-router-dom';
import { LOCAL_STORAGE_KEYS } from '../constants/localStorage';

type LocalStorageArtifact = {
  activeArtifactId?: string;
  activeArtifactType?: ArtifactEnum;
};

const useLocalStorageArtifact = () => {
  const { orgName = '', agentId = '' } = useParams<ChatParams>();

  const localStoragePrefixKey = `${orgName?.toLowerCase()}-${agentId}-`;
  const artifactKey = localStoragePrefixKey + LOCAL_STORAGE_KEYS.ARTIFACT_METADATA;

  const [artifact, setArtifact] = useLocalStorageState<LocalStorageArtifact>(artifactKey);

  const handleUpdateArtifact = async (newArtifact: Partial<LocalStorageArtifact>) => {
    try {
      const updatedArtifact: LocalStorageArtifact = {
        ...artifact,
        ...newArtifact,
      };

      setArtifact(updatedArtifact);
    } catch (error) {
      console.error(error);
    }
  };

  return { artifact, handleUpdateArtifact };
};

export default useLocalStorageArtifact;
