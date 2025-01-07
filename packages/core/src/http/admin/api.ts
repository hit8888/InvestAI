import { 
    VerifyOtpPayload, 
    GenerateOtpPayload, 
    LoginWithEmailPasswordPayload,
    LeadsPayload,
    APIHeaders,
    GenerateTokens,
} from "../../types/admin/api";
import adminApiClient from "./client";

export const loginWithEmailPassword = (
  payload: LoginWithEmailPasswordPayload
) => adminApiClient.post(`/core/api/login/`, payload);

export const generateOtp = (payload: GenerateOtpPayload) =>
  adminApiClient.post(`/core/api/generate-code/`, payload);

export const verifyOtp = (payload: VerifyOtpPayload) =>
  adminApiClient.post(`/core/api/verify-code/`, payload);

export const regenerateTokens = (payload: GenerateTokens) =>
  adminApiClient.post(`/core/api/token/refresh/`, payload);

export const getUserDataFromMeAPI = (headers: APIHeaders) =>
  adminApiClient.get(`/core/api/me/`, {headers});

export const getLeadsRowData = (payload: LeadsPayload, headers: APIHeaders) =>
  adminApiClient.post(`/tenant/api/search/leads/`, payload, {headers});
