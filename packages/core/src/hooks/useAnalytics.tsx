import * as amplitude from "@amplitude/analytics-browser";
import { useParams } from "react-router-dom";
import { ChatParams } from "../types/config";

const useAnalytics = () => {
  const { orgName = "", agentId = "" } = useParams<ChatParams>();

  const commonPayload = { orgName, agentId };

  const trackEvent = (
    eventName: string,
    payload: Record<string, unknown> = {}
  ) => {
    try {
      amplitude.track(eventName, { ...commonPayload, ...payload });
    } catch (error) {}
  };

  return { trackEvent };
};

export default useAnalytics;
