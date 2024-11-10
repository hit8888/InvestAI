import { useQuery } from "@tanstack/react-query";
import { getArtifact } from "../http/api";
import { BreakoutQueryOptions } from "../types/queries";
import { ArtifactEnum, ArtifactResponse } from "../types/chat";

const getArtifactKey = (): unknown[] => ["config"];

type ArtifactDataKey = ReturnType<typeof getArtifactKey>;

interface IProps {
  artifactId?: string;
  artifactType?: ArtifactEnum;
  queryOptions: BreakoutQueryOptions<ArtifactResponse, ArtifactDataKey>,
}
const useArtifactDataQuery = ({ artifactId = "", artifactType = "NONE", queryOptions }: IProps) => {

  const query = useQuery({
    queryFn: async () => {

      const response = await getArtifact({
        artifactId,
        artifactType,
      });

      const data = response.data as ArtifactResponse;
      return data;
    },
    ...queryOptions,
    queryKey: getArtifactKey(),
  });

  return query;
};

export default useArtifactDataQuery;
