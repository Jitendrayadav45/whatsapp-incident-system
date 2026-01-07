import { disableSubSite } from "../../api/sites.api";
import { useAuth } from "../../auth/useAuth";
import { ROLES } from "../../utils/constants";

export default function SubSiteList({ siteId, subSites, refresh }) {
  const { user } = useAuth();

  async function handleDisable(subSiteId) {
    if (!window.confirm("Disable this sub-site?")) return;
    await disableSubSite(siteId, subSiteId);
    refresh();
  }

  return (
    <ul>
      {subSites.map(sub => (
        <li key={sub.subSiteId}>
          {sub.subSiteId}

          {!sub.isActive && (
            <span className="badge warning">Inactive</span>
          )}

          {(user.role === ROLES.OWNER ||
            user.role === ROLES.SITE_ADMIN) &&
            sub.isActive && (
              <button onClick={() => handleDisable(sub.subSiteId)}>
                Disable
              </button>
            )}
        </li>
      ))}
    </ul>
  );
}