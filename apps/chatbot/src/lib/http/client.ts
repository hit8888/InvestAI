import axios from "axios";
import { ENV } from "../../config/env";

const apiClient = axios.create({
  baseURL: ENV.VITE_BASE_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default apiClient;
