export const getTenantFromUrl = (): string => {
  const pathSegments = window.location.pathname.split("/");
  const orgIndex = pathSegments.indexOf("org");
  return orgIndex !== -1 ? pathSegments[orgIndex + 1] : "";
};
