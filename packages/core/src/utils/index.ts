import { OrganizationDetails } from "../types/admin/auth";

export const CONVERSATIONS_PAGE = 'conversations';
export const LEADS_PAGE = 'leads';

export const setTenantIdentifier = (tenantObj: OrganizationDetails) => {
  localStorage.setItem("admin_tenant_identifier", JSON.stringify(tenantObj));
};

export const getTenantIdentifier = () => {
  return JSON.parse(localStorage.getItem("admin_tenant_identifier") || "null");
};

export const setMessageIndexForAddingAIMessage = () => {
  const PROCESSING_MESSAGE_SEQUENCE = getProcessingMessageSequence();
  return Math.floor(Math.random() * PROCESSING_MESSAGE_SEQUENCE.length);
};

export const getProcessingMessageSequence = () => {
  return [
    `Putting together my answer`,
    `Getting it ready`,
    `Working on it`,
    `Forming a complete response`,
  ];
};
