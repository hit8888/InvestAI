import { useMutation } from '@tanstack/react-query';

import { updateProspect } from '../api';
import { UpdateProspectPayload } from '@meaku/core/types/api/update_prospect_request';
import { BreakoutMutationOptions } from '@meaku/core/types/queries';
import { ProspectResponse } from '../../../types/api';

const useUpdateProspectMutation = (
  options: BreakoutMutationOptions<ProspectResponse, { prospectId: string; payload: UpdateProspectPayload }> = {},
) => {
  const mutation = useMutation({
    mutationKey: ['update-prospect'],
    mutationFn: async ({ prospectId, payload }: { prospectId: string; payload: UpdateProspectPayload }) => {
      const response = await updateProspect(prospectId, payload);
      return response.data;
    },
    ...options,
  });

  return mutation;
};

export default useUpdateProspectMutation;
