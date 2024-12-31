import { generateOtp } from "../../http/api";
import { GenerateOtpPayload } from "../../types/admin/api";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

type GenerateOtpResult =
  ReturnType<typeof generateOtp> extends Promise<infer T> ? T : never;

type GenerateOtpVariables = GenerateOtpPayload;

const useGenerateOtp = (
  options?: Omit<
    UseMutationOptions<GenerateOtpResult, Error, GenerateOtpVariables>,
    "mutationFn"
  >
) => {
  const mutation = useMutation({
    mutationFn: async (payload) => {
      const response = await generateOtp(payload);

      return response.data;
    },
    ...options,
  });

  return mutation;
};

export default useGenerateOtp;