import { Artifact, ArtifactEnum } from "@meaku/core/types/chat";
import { ChatParams } from "@meaku/core/types/config";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getArtifact } from "../../lib/http/api";
import { useArtifactStore } from "../../stores/useArtifactStore";
import { trackError } from "../../utils/error";
import useLocalStorageArtifact from "../useLocalStorageArtifact";

interface IProps {
  artifactId?: string;
  artifactType?: ArtifactEnum;
  options?: Omit<UseQueryOptions<any, Error>, "queryKey" | "queryFn">;
}

const MAX_RETRIES = 6;

const useArtifactData = (props: IProps) => {
  const { artifactId = "", artifactType } = props;

  const { orgName = "" } = useParams<ChatParams>();

  const handleRemoveActiveArtifact = useArtifactStore(
    (state) => state.handleRemoveActiveArtifact,
  );
  const { handleUpdateArtifact } = useLocalStorageArtifact();

  const query = useQuery({
    queryKey: ["artifact", artifactId, artifactType],
    queryFn: async () => {
      if (!artifactId || !artifactType) return null;

      const response = await getArtifact(orgName, {
        artifactId,
        artifactType,
      });

      const data = response.data as Artifact;

      if (data.artifact_id && data.artifact_type) {
        handleUpdateArtifact({
          activeArtifactId: data.artifact_id,
          activeArtifactType: data.artifact_type,
        });
      }

      return data;
    },
    retry: (failureCount, error) => {
      if (failureCount >= MAX_RETRIES) {
        handleRemoveActiveArtifact();
        return false;
      }

      trackError(error, {
        action: "useArtifactData - artifact api",
        component: "useArtifactData",
        additionalData: {
          orgName,
          artifactId,
          artifactType,
        },
      });

      return true;
    },
    enabled: !!artifactId && artifactType && artifactType !== "NONE",
    staleTime: Infinity,
  });

  return query;
};

export default useArtifactData;
