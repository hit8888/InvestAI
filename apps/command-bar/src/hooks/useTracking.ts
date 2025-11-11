import { useEffect } from 'react';

import useUpdateProspectMutation from '@meaku/shared/network/http/mutations/useUpdateProspectMutation';
import { useCommandBarStore } from '@meaku/shared/stores';
import { initProspectAnalytics } from '@meaku/core/lib/prospectAnalytics';
import { isProduction } from '@meaku/shared/constants/common';
import { useVectorTracking } from './useVectorTracking';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import { useCommandBarAnalytics } from '@meaku/core/contexts/CommandBarAnalyticsProvider';
import { UpdateProspectPayload } from '@meaku/core/index';

const useTracking = () => {
  const { trackEvent } = useCommandBarAnalytics();
  const updateProspectMutation = useUpdateProspectMutation();
  const {
    config: { tracking_config, prospect_id, session_id },
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

    const cleanup = initProspectAnalytics(tracking_config, (requestData: UpdateProspectPayload, type) => {
      updateProspectMutation.mutate({
        prospectId: prospect_id,
        payload: requestData,
      });

      if (type === 'form_submission') {
        trackEvent(ANALYTICS_EVENT_NAMES.COMMAND_BAR.EXTERNAL_FORM_SUBMITTED, {
          prospect_id,
          ...(session_id && { session_id }),
          ...(requestData?.prospect_demographics && { prospect_demographics: requestData.prospect_demographics }),
        });
      }
    });

    return () => {
      cleanup();
    };
  }, [enabled, prospect_id, session_id, trackEvent, tracking_config, updateProspectMutation]);
};

export default useTracking;
