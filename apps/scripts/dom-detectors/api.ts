import { ProspectRequestData } from "../lib/types";

const prospectIdKey = "__breakout__prospectId";

export const submitProspect = (requestData: ProspectRequestData) => {
  const prospectId =
    window.__breakout__?.prospectId ?? localStorage.getItem(prospectIdKey);

  if (prospectId) {
    updateProspect(prospectId, requestData);
  } else {
    createProspect(requestData);
  }
};

const createProspect = (requestData: ProspectRequestData) => {
  const apiBaseUrl = window.__breakout__?.apiBaseUrl ?? "";
  const apiUrl = `${apiBaseUrl}/tenant/chat/prospect/create/`;

  safeRequest(apiUrl, requestData)?.then((response) => {
    localStorage.setItem(prospectIdKey, response.prospect_id);
  });
};

export const updateProspect = (
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
    return fetch(apiUrl, {
      method: "POST",
      headers: {
        "x-tenant-name": window.__breakout__?.tenantId ?? "",
      },
      body: JSON.stringify(requestData),
      keepalive: true,
    }).then((res) => res.json());
  } catch (error) {
    // swallow errors if any
    console.log("error while recording prospect", error);
  }
};
