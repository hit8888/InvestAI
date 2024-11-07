import { QueryKey, UseQueryOptions } from "@tanstack/react-query";

export type BreakoutQueryOptions<APIResponse, TQueryKey extends QueryKey, TError = Error> = UseQueryOptions<
  APIResponse,
  TError,
  APIResponse,
  TQueryKey
>;