import { QueryKey, UseQueryOptions } from "@tanstack/react-query";

export type BreakoutQueryOptions<APIResponse, TQueryKey extends QueryKey, TError = Error> =Omit<UseQueryOptions<
  APIResponse,
  TError,
  APIResponse,
  TQueryKey
>, 'queryKey' | 'queryFn'>;;
