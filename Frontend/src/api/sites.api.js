// src/api/sites.api.js
import api from "./axios";

/**
 * 🏭 GET SITES + SUB-SITES (ROLE FILTERED)
 * OWNER        → all
 * SITE_ADMIN   → allowedSites
 * SUB_SITE_ADMIN → scoped read-only
 */
export const getSites = async () => {
  const response = await api.get("/sites");
  return response.data; // ✅ return actual payload
};

/**
 * ➕ CREATE SITE (OWNER ONLY)
 */
export const createSite = async ({ siteId, siteName }) => {
  const response = await api.post("/sites", {
    siteId,
    siteName
  });
  return response.data;
};

/**
 * ➕ CREATE SUB-SITE (OWNER / SITE_ADMIN)
 */
export const createSubSite = async (
  siteId,
  { subSiteId, subSiteName }
) => {
  const response = await api.post(
    `/sites/${siteId}/subsites`,
    { subSiteId, subSiteName }
  );
  return response.data;
};

/**
 * ⛔ DISABLE SITE (OWNER ONLY)
 */
export const disableSite = async (siteId) => {
  const response = await api.patch(
    `/sites/${siteId}/disable`
  );
  return response.data;
};

/**
 * ✅ ENABLE SITE (OWNER ONLY)
 */
export const enableSite = async (siteId) => {
  const response = await api.patch(
    `/sites/${siteId}/enable`
  );
  return response.data;
};

/**
 * 🗑️ DELETE SITE (OWNER ONLY)
 */
export const deleteSite = async (siteId) => {
  const response = await api.delete(
    `/sites/${siteId}`
  );
  return response.data;
};

/**
 * ⛔ DISABLE SUB-SITE (OWNER / SITE_ADMIN)
 */
export const disableSubSite = async (siteId, subSiteId) => {
  const response = await api.patch(
    `/sites/${siteId}/subsites/${subSiteId}/disable`
  );
  return response.data;
};

/**
 * ✅ ENABLE SUB-SITE (OWNER / SITE_ADMIN)
 */
export const enableSubSite = async (siteId, subSiteId) => {
  const response = await api.patch(
    `/sites/${siteId}/subsites/${subSiteId}/enable`
  );
  return response.data;
};

/**
 * 🗑️ DELETE SUB-SITE (OWNER / SITE_ADMIN)
 */
export const deleteSubSite = async (siteId, subSiteId) => {
  const response = await api.delete(
    `/sites/${siteId}/subsites/${subSiteId}`
  );
  return response.data;
};

/**
 * 📱 GENERATE QR CODE FOR SITE
 */
export const generateSiteQR = async (siteId) => {
  const response = await api.get(`/sites/${siteId}/qr`);
  return response.data;
};

/**
 * 📱 GENERATE QR CODE FOR SUB-SITE
 */
export const generateSubSiteQR = async (siteId, subSiteId) => {
  const response = await api.get(`/sites/${siteId}/subsites/${subSiteId}/qr`);
  return response.data;
};