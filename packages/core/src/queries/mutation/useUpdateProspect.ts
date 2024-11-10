import { useMutation } from "@tanstack/react-query";
import { updateProspect } from "../../http/api";
import { UpdateProspectPayload } from "../../types/api";

const useUpdateProspect = () => {
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

      const response = await updateProspect(prospectId, payload);

      return response.data;
    },
  });

  return mutation;
};

export default useUpdateProspect;
