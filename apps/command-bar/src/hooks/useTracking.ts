import { useEffect } from 'react';

import useUpdateProspectMutation from '@meaku/shared/network/http/mutations/useUpdateProspectMutation';
import { useCommandBarStore } from '@meaku/shared/stores';
import { initProspectAnalytics } from '@meaku/core/lib/prospectAnalytics';
import { isProduction } from '@meaku/shared/constants/common';
import { useVectorTracking } from './useVectorTracking';

const useTracking = () => {
  const updateProspectMutation = useUpdateProspectMutation();
  const {
    config: { tracking_config, prospect_id },
    settings: { tenant_id, is_admin, is_test },
  } = useCommandBarStore();

  const enabled = isProduction && !is_admin && !is_test && !!prospect_id;

  useVectorTracking({
    tenantId: tenant_id,
    prospectId: prospect_id,
    enabled,
  });

  useEffect(() => {
    if (!tracking_config || !enabled) {
      return;
    }

    const cleanup = initProspectAnalytics(tracking_config, (requestData) => {
      updateProspectMutation.mutate({
        prospectId: prospect_id,
        payload: requestData,
      });
    });

    return () => {
      cleanup();
    };
  }, [tracking_config, prospect_id, updateProspectMutation, enabled]);
};

export default useTracking;
