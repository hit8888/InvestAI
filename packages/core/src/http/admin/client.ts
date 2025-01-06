import axios from "axios";
import { ENV } from "../../types/env";
import { getTenantFromUrl } from "../../utils/getTenantFromUrl";

const adminApiClient = axios.create({
  baseURL: ENV.VITE_BASE_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add request interceptor to set x-tenant-name header before each request
adminApiClient.interceptors.request.use(
  (config) => {
    config.headers["x-tenant-name"] = getTenantFromUrl();
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default adminApiClient;
