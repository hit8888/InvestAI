import { verifyOtp } from "../../http/api";
import { VerifyOtpPayload } from "../../types/api";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

type VerifyOtpResult =
  ReturnType<typeof verifyOtp> extends Promise<infer T> ? T : never;

type VerifyOtpVariables = VerifyOtpPayload;

const useVerifyOtp = (
  options?: Omit<
    UseMutationOptions<VerifyOtpResult, Error, VerifyOtpVariables>,
    "mutationFn"
  >
) => {
  const mutation = useMutation({
    mutationKey: ["verify-otp"],
    mutationFn: async (payload: any) => {
      const response = await verifyOtp(payload);

      return response.data;
    },
    ...options,
  });

  return mutation;
};

export default useVerifyOtp;