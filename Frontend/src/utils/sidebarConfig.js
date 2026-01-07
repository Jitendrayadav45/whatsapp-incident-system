import { ROLES } from "./roleUtils";

export const SIDEBAR_ITEMS = [
  {
    label: "Dashboard",
    path: "/dashboard",
    roles: [ROLES.OWNER, ROLES.SITE_ADMIN, ROLES.SUB_SITE_ADMIN]
  },
  {
    label: "Tickets",
    path: "/tickets",
    roles: [ROLES.OWNER, ROLES.SITE_ADMIN, ROLES.SUB_SITE_ADMIN]
  },
  {
    label: "Sites",
    path: "/sites",
    roles: [ROLES.OWNER]
  },
  {
    label: "Sub Sites",
    path: "/sites",
    roles: [ROLES.OWNER, ROLES.SITE_ADMIN]
  },
  {
    label: "Stats",
    path: "/dashboard",
    roles: [ROLES.OWNER]
  }
];