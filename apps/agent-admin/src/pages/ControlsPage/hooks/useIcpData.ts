import { useMemo } from 'react';
import { getTenantActiveAgentId } from '@meaku/core/utils/index';
import useIcpConfigQuery from '../../../queries/query/useIcpConfigQuery';
import { useIcpConfigMutation } from '../../../queries/mutation/useIcpConfigMutation';
import { IcpConfigPayload } from '@meaku/core/types/admin/api';
import { ICPFormData } from '../utils';

export const useIcpData = () => {
  const agentId = getTenantActiveAgentId();

  // API hooks
  const {
    data: icpConfigResponse,
    isLoading: isLoadingConfig,
    error: configError,
    refetch: refetchIcpConfig,
  } = useIcpConfigQuery({
    agentId: agentId!,
    enabled: !!agentId,
  });

  const updateIcpConfigMutation = useIcpConfigMutation();

  // Memoized extracted data
  const icpConfig = useMemo(() => icpConfigResponse?.icp_config, [icpConfigResponse]);
  const options = useMemo(() => icpConfigResponse?.options, [icpConfigResponse]);

  // Transform API data to form data
  const transformedFormData = useMemo((): ICPFormData | null => {
    if (!icpConfig) return null;

    return {
      seniorities: icpConfig.seniorities || [],
      departments: icpConfig.departments || [],
      person_titles: icpConfig.person_titles || [],
      locations: icpConfig.locations || [],
      max_contacts_per_company: icpConfig.max_contacts_per_company || '',
    };
  }, [icpConfig]);

  // Save function
  const saveIcpConfig = async (data: ICPFormData, dirtyFields: Record<string, boolean>): Promise<void> => {
    if (!agentId) {
      throw new Error('Agent ID is required');
    }

    // Only include changed fields in payload
    const payload: Partial<IcpConfigPayload> = {};

    if (dirtyFields.seniorities) {
      payload.seniorities = data.seniorities || [];
    }
    if (dirtyFields.departments) {
      payload.departments = data.departments || [];
    }
    if (dirtyFields.locations) {
      payload.locations = data.locations || [];
    }
    if (dirtyFields.person_titles) {
      payload.person_titles = data.person_titles || [];
    }
    if (dirtyFields.max_contacts_per_company) {
      payload.max_contacts_per_company =
        typeof data.max_contacts_per_company === 'number' ? data.max_contacts_per_company : 0;
    }

    await updateIcpConfigMutation.mutateAsync({
      agentId,
      payload: payload as Partial<IcpConfigPayload>,
    });
  };

  return {
    agentId,
    icpConfig,
    options,
    transformedFormData,
    isLoadingConfig,
    configError,
    saveIcpConfig,
    isSaving: updateIcpConfigMutation.isPending,
    refetchIcpConfig,
  };
};
