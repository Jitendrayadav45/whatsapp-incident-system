exports.canAccessTicket = ({ admin, ticket }) => {
  if (admin.role === "OWNER") return true;

  if (admin.role === "SITE_ADMIN") {
    return ticket.siteId === admin.siteId;
  }

  if (admin.role === "SUB_SITE_ADMIN") {
    return (
      ticket.siteId === admin.siteId &&
      ticket.subSiteId === admin.subSiteId
    );
  }

  return false;
};