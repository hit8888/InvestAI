import { useEffect } from 'react';
import filter from 'lodash/filter';

import useUpdateProspectMutation from '@neuraltrade/shared/network/http/mutations/useUpdateProspectMutation';
import { useCommandBarStore } from '@neuraltrade/shared/stores';
import { initProspectAnalytics } from '@neuraltrade/core/lib/prospectAnalytics';
import { isProduction } from '@neuraltrade/shared/constants/common';
import { useVectorTracking } from './useVectorTracking';
import ANALYTICS_EVENT_NAMES from '@neuraltrade/core/constants/analytics';
import { useCommandBarAnalytics } from '@neuraltrade/core/contexts/CommandBarAnalyticsProvider';
import { UpdateProspectPayload } from '@neuraltrade/core/index';

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
      const hasDataInPayload =
        filter(requestData, (value, key) => key !== 'prospect_demographics' && !!value).length > 0;
      const hasDataInDemographics = filter(requestData.prospect_demographics, (value) => !!value).length > 0;
      const isEmptyPayload = !hasDataInPayload && !hasDataInDemographics;

      // Don't update prospect if there is no request data
      if (isEmptyPayload) {
        return;
      }

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
