import axios, { AxiosError } from "axios";
import { ENV } from "../../../../apps/chatbot/src/config/env"; //TODO: Move the env file to the core package in next PR
import { getTenantFromUrl } from "../utils/getTenantFromUrl";

const apiClient = axios.create({
  baseURL: ENV.VITE_BASE_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add request interceptor to set x-tenant-name header before each request
apiClient.interceptors.request.use(
  (config) => {
    config.headers["x-tenant-name"] = getTenantFromUrl();
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Sometimes the backend throws in a 500 or some other error code when it can't find the session id, in such cases, we are required to clear the session id and prospect id from the local storage and retry the request. This interceptor automatically clears the session id and prospect id from the request and retries the request.
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (!error.response || !error.config) return Promise.reject(error);

    const apiPath = error.config.url;

    if (apiPath?.includes("/session/init")) {
      const updatedConfig = {
        ...error.config,
        data: {
          ...JSON.parse(error.config.data),
          session_id: null,
          prospect_id: null,
        },
      };

      return apiClient(updatedConfig);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
