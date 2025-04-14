import { ProspectRequestData } from "../types";

export const submitProspect = (requestData: ProspectRequestData) => {
  const { prospectId } = window.__breakout__ ?? {};

  if (prospectId) {
    updateProspect(prospectId, requestData);
  } else {
    createProspect(requestData);
  }
};

const createProspect = (requestData: ProspectRequestData) => {
  const apiBaseUrl = window.__breakout__?.apiBaseUrl ?? "";
  const apiUrl = `${apiBaseUrl}/tenant/chat/prospect/create/`;

  safeRequest(apiUrl, requestData);
};

const updateProspect = (
  prospectId: string,
  requestData: ProspectRequestData,
) => {
  const apiBaseUrl = window.__breakout__?.apiBaseUrl ?? "";
  const apiUrl = `${apiBaseUrl}/tenant/chat/prospect/${prospectId}/update/`;
  delete requestData.origin;

  safeRequest(apiUrl, requestData);
};

const safeRequest = (apiUrl: string, requestData: ProspectRequestData) => {
  try {
    fetch(apiUrl, {
      method: "POST",
      headers: {
        "x-tenant-name": window.__breakout__?.tenantId ?? "",
      },
      body: JSON.stringify(requestData),
      keepalive: true,
    });
  } catch (error) {
    // swallow errors if any
    console.log("error while recording prospect", error);
  }
};
