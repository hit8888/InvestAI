import { useMutation } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { updateProspect } from "../../lib/http/api";
import { UpdateProspectPayload } from "../../types/api";
import { ChatParams } from "../../types/msc";

const useUpdateProspect = () => {
  const { orgName = "" } = useParams<ChatParams>();

  const mutation = useMutation({
    mutationKey: ["update-prospect"],
    mutationFn: async ({
      prospectId,
      payload,
    }: {
      prospectId: string;
      payload: UpdateProspectPayload;
    }) => {
      if (!prospectId || !payload.email) return;

      const response = await updateProspect(orgName, prospectId, payload);

      return response.data;
    },
  });

  return mutation;
};

export default useUpdateProspect;
