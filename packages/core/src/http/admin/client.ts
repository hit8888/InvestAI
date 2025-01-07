import axios from "axios";
import { ENV } from "../../types/env";

const adminApiClient = axios.create({
  baseURL: ENV.VITE_BASE_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default adminApiClient;
