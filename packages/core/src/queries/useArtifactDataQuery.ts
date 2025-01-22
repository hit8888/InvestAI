import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getArtifact } from "../http/api";
import { BreakoutQueryOptions } from "../types/queries";
import { ArtifactEnum, ArtifactResponse } from "../types/agent";

const getArtifactKey = (
  artifactId: string,
  artifactType: string,
  role: "agent" | "admin"
): unknown[] => ["artifact", artifactId, artifactType, role];

type ArtifactDataKey = ReturnType<typeof getArtifactKey>;

interface IProps {
  role?: "agent" | "admin";
  artifactId: string | null;
  artifactType: ArtifactEnum | null;
  queryOptions: BreakoutQueryOptions<ArtifactResponse, ArtifactDataKey>;
}
const useArtifactDataQuery = ({
  role = "agent",
  artifactId,
  artifactType,
  queryOptions,
}: IProps): UseQueryResult<ArtifactResponse> => {
  const query = useQuery({
    queryFn: async () => {
      const response = await getArtifact(
        {
          artifactId: artifactId ?? "",
          artifactType: artifactType ?? "NONE",
        },
        role
      );

      const data = response.data as ArtifactResponse;
      return data;
    },
    ...queryOptions,
    queryKey: getArtifactKey(artifactId ?? "", artifactType ?? "", role),
    retry: 7,
  });

  return query;
};

export default useArtifactDataQuery;
