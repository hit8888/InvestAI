import { 
    VerifyOtpPayload, 
    GenerateOtpPayload, 
    LoginWithEmailPasswordPayload, 
} from "../../types/admin/api";
import adminApiClient from "./client";

export const loginWithEmailPassword = (
  payload: LoginWithEmailPasswordPayload
) => adminApiClient.post(`/core/api/login/`, payload);

export const generateOtp = (payload: GenerateOtpPayload) =>
  adminApiClient.post(`/core/api/generate-code/`, payload);

export const verifyOtp = (payload: VerifyOtpPayload) =>
  adminApiClient.post(`/core/api/verify-code/`, payload);
