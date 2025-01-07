import { APIHeaders, LeadsPayload, LeadsTableResponse } from "@meaku/core/types/admin/api";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { getLeadsRowData } from "../../../http/admin/api";
import { AxiosResponse } from "axios";

type LeadsTableResult =
  ReturnType<typeof getLeadsRowData> extends Promise<infer T>
    ? T
    : never;

type LeadsTableVariables = LeadsPayload;

const useLeadsTableAPI = (
  headers: APIHeaders, // Accept headers as a parameter
  options?: Omit<
    UseMutationOptions<
      LeadsTableResult,
      Error,
      LeadsTableVariables,
      unknown
    >,
    "mutationFn"
  >
) => {
  const mutation = useMutation({
    mutationKey: ["leads-table-api"],
    mutationFn: async (payload: LeadsTableVariables): Promise<AxiosResponse<LeadsTableResponse>> => {
      const response: AxiosResponse<LeadsTableResponse> = await getLeadsRowData(payload, headers);

      return response;
    },
    ...options,
  });

  return mutation;
};

export default useLeadsTableAPI;