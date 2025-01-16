import { getTenantIdentifier } from "./index";

export const getTenantFromUrl = (): string => {
  const pathSegments = window.location.pathname.split("/");
  const orgIndex = pathSegments.indexOf("org");

  const tenantNameFromLocalStorage: string = getTenantIdentifier()?.["tenant-name"] ?? "";

  // If org is not present in the path, return a default tenant name
  // Make a organisation tenant using backend application in localhost and use the same tenant name here.
  return orgIndex !== -1
    ? pathSegments[orgIndex + 1]
    : tenantNameFromLocalStorage;
};
