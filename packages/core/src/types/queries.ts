import { QueryKey, UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';

export type BreakoutQueryOptions<APIResponse, TQueryKey extends QueryKey, TError = Error> = Omit<
  UseQueryOptions<APIResponse, TError, APIResponse, TQueryKey>,
  'queryKey' | 'queryFn'
>;

export type BreakoutMutationOptions<TData, TVariables, TError = Error> = Omit<
  UseMutationOptions<TData, TError, TVariables>,
  'mutationKey' | 'mutationFn'
>;
