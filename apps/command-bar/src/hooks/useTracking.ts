import { useEffect } from 'react';

import useUpdateProspectMutation from '@meaku/shared/network/http/mutations/useUpdateProspectMutation';
import { useCommandBarStore } from '@meaku/shared/stores';
import { initProspectAnalytics } from '@meaku/core/lib/prospectAnalytics';

const useTracking = ({ enabled = true }: { enabled?: boolean } = {}) => {
  const updateProspectMutation = useUpdateProspectMutation();
  const { config } = useCommandBarStore();

  useEffect(() => {
    if (!config.tracking_config || !enabled) {
      return;
    }

    const cleanup = initProspectAnalytics(config.tracking_config, (requestData) => {
      if (!config.prospect_id) {
        return;
      }

      updateProspectMutation.mutate({
        prospectId: config.prospect_id,
        payload: requestData,
      });
    });

    return () => {
      cleanup();
    };
  }, [config.tracking_config, config.prospect_id, updateProspectMutation, enabled]);
};

export default useTracking;
