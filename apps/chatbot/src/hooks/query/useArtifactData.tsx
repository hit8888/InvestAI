import { ArtifactEnum } from "@meaku/core/types/chat";
import { ChatParams } from "@meaku/core/types/config";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getArtifact } from "../../lib/http/api";

interface IProps {
  artifactId?: string;
  artifactType?: ArtifactEnum;
  options?: Omit<UseQueryOptions<any, Error>, "queryKey" | "queryFn">;
}

const useArtifactData = (props: IProps) => {
  const { artifactId = "", artifactType } = props;

  const { orgName = "" } = useParams<ChatParams>();

  const query = useQuery({
    queryKey: ["artifact", artifactId, artifactType],
    queryFn: async () => {
      if (!artifactId || !artifactType) return null;

      const response = await getArtifact(orgName, {
        artifactId,
        artifactType,
      });

      return response.data;
    },
    enabled: !!artifactId && artifactType && artifactType !== "NONE",
    staleTime: Infinity,
  });

  return query;
};

export default useArtifactData;
