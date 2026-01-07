export const ROLES = {
  OWNER: "OWNER",
  SITE_ADMIN: "SITE_ADMIN",
  SUB_SITE_ADMIN: "SUB_SITE_ADMIN"
};

export const isOwner = (role) => role === ROLES.OWNER;
export const isSiteAdmin = (role) => role === ROLES.SITE_ADMIN;
export const isSubSiteAdmin = (role) => role === ROLES.SUB_SITE_ADMIN;