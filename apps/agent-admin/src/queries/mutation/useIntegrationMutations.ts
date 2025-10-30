import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { connectIntegration, connectIntegrationCallback, disconnectIntegration } from '@meaku/core/adminHttp/api';
import { getIntegrationNameFromType } from '../../utils/common';

type IntegrationConnectResult = {
  login_url: string | null;
};

type IntegrationConnectVariables = {
  integrationType: string;
  formData?: Record<string, string>;
};

type IntegrationConnectCallbackVariables = {
  code: string;
  state: string;
  integrationType?: string;
};

type IntegrationDisconnectVariables = {
  integrationType: string;
};

const useIntegrationConnect = (
  options?: Omit<UseMutationOptions<IntegrationConnectResult, Error, IntegrationConnectVariables>, 'mutationFn'>,
) => {
  const mutation = useMutation({
    mutationKey: ['integration-connect'],
    mutationFn: async (payload) => {
      const { data } = await connectIntegration(payload.integrationType, payload.formData);
      return data;
    },
    onError: () => toast.error('Something went wrong. Please try again.', { position: 'bottom-center' }),
    ...options,
  });

  return mutation;
};

const useIntegrationConnectCallback = (
  options?: Omit<
    UseMutationOptions<IntegrationConnectResult, Error, IntegrationConnectCallbackVariables>,
    'mutationFn'
  >,
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ['integration-connect-callback'],
    mutationFn: async (payload) => {
      const { data } = await connectIntegrationCallback(payload);
      return data;
    },
    onSuccess: (_, { integrationType }) => {
      toast.success(`${getIntegrationNameFromType(integrationType)} connected successfully.`, {
        position: 'bottom-center',
      });
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
    },
    onError: () => toast.error('Something went wrong. Please try again.', { position: 'bottom-center' }),
    ...options,
  });

  return mutation;
};

const useIntegrationDisconnect = (
  options?: Omit<UseMutationOptions<IntegrationConnectResult, Error, IntegrationDisconnectVariables>, 'mutationFn'>,
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ['integration-disconnect'],
    mutationFn: async (payload) => {
      const { data } = await disconnectIntegration(payload.integrationType);
      return data;
    },
    onError: () => toast.error('Something went wrong. Please try again.', { position: 'bottom-center' }),
    onSuccess: (_, { integrationType }) => {
      toast.success(`${getIntegrationNameFromType(integrationType)} disconnected successfully.`, {
        position: 'bottom-center',
      });
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
    },
    ...options,
  });

  return mutation;
};

export { useIntegrationConnect, useIntegrationConnectCallback, useIntegrationDisconnect };
