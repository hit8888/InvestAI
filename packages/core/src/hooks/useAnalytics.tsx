import * as amplitude from "@amplitude/analytics-browser";
import { useParams } from "react-router-dom";
import { ChatParams } from "../types/config";

const useAnalytics = () => {
  const { orgName = "", agentId = "" } = useParams<ChatParams>();

  const commonPayload = { orgName, agentId };
  const isProduction = process.env.NODE_ENV === "production";

  const trackEvent = (
    eventName: string,
    payload: Record<string, unknown> = {}
  ) => {
    if (!isProduction) return;
    if (orgName?.toLowerCase() !== "c2fo") return;

    try {
      amplitude.track(eventName, { ...commonPayload, ...payload });
    } catch (error) {}
  };

  return { trackEvent };
};

export default useAnalytics;
