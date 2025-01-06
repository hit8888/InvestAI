import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getArtifact } from "../http/api";
import { BreakoutQueryOptions } from "../types/queries";
import { ArtifactEnum, ArtifactResponse } from "../types/agent";

const getArtifactKey = (
  artifactId: string,
  artifactType: string
): unknown[] => ["artifact", artifactId, artifactType];

type ArtifactDataKey = ReturnType<typeof getArtifactKey>;

interface IProps {
  artifactId: string | null;
  artifactType: ArtifactEnum | null;
  queryOptions: BreakoutQueryOptions<ArtifactResponse, ArtifactDataKey>;
}
const useArtifactDataQuery = ({
  artifactId,
  artifactType,
  queryOptions,
}: IProps): UseQueryResult<ArtifactResponse> => {
  const query = useQuery({
    queryFn: async () => {
      const response = await getArtifact({
        artifactId: artifactId ?? "",
        artifactType: artifactType ?? "NONE",
      });

      const data = response.data as ArtifactResponse;
      return data;
    },
    ...queryOptions,
    queryKey: getArtifactKey(artifactId ?? "", artifactType ?? ""),
  });

  return query;
};

export default useArtifactDataQuery;
