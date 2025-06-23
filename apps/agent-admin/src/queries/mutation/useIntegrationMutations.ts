import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { connectIntegration, connectIntegrationCallback, disconnectIntegration } from '@meaku/core/adminHttp/api';

type IntegrationConnectResult = {
  login_url: string;
};

type IntegrationConnectVariables = {
  integrationType: string;
  formData?: Record<string, string>;
};

type IntegrationConnectCallbackVariables = {
  code: string;
  state: string;
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
  const mutation = useMutation({
    mutationKey: ['integration-connect-callback'],
    mutationFn: async (payload) => {
      const { data } = await connectIntegrationCallback(payload);
      return data;
    },
    onSuccess: () =>
      toast.success('Agent will begin embedding and training on these pages.', { position: 'bottom-center' }),
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
    },
    ...options,
  });

  return mutation;
};

export { useIntegrationConnect, useIntegrationConnectCallback, useIntegrationDisconnect };
