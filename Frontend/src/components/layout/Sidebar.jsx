import { NavLink } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import { ROLES } from "../../utils/constants";

export default function Sidebar() {
  const { user, loading } = useAuth();

  if (loading || !user) return null;

  const role = user.role;

  const linkClass = ({ isActive }) =>
    isActive ? "nav-link active" : "nav-link";

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h3>Sentinel</h3>
        <span className="role-badge">{role}</span>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={linkClass}>
          Dashboard
        </NavLink>

        <NavLink to="/tickets" className={linkClass}>
          Tickets
        </NavLink>

        {role === ROLES.OWNER && (
          <>
            <div className="nav-section">System</div>

            <NavLink to="/sites" className={linkClass}>
              Sites
            </NavLink>

            <NavLink to="/sites/create" className={linkClass}>
              Create Site
            </NavLink>

            <NavLink to="/admins" className={linkClass}>
              Admin Users
            </NavLink>

            <NavLink to="/admins/create" className={linkClass}>
              Create Admin
            </NavLink>

            <NavLink to="/ticket-reports" className={linkClass}>
              Reported Tickets
            </NavLink>
          </>
        )}

        {role === ROLES.SITE_ADMIN && (
          <>
            <div className="nav-section">Management</div>

            <NavLink to="/sites" className={linkClass}>
              Sites & Sub-Sites
            </NavLink>

            <NavLink to="/admins" className={linkClass}>
              Sub-Admins
            </NavLink>

            <NavLink to="/admins/create" className={linkClass}>
              Create Sub-Admin
            </NavLink>
          </>
        )}
        {role === ROLES.SUB_SITE_ADMIN && (
          <>
            <div className="nav-section">Management</div>

            <NavLink to="/sites" className={linkClass}>
              Sites & Sub-Sites
            </NavLink>

            <div className="nav-hint">Limited access</div>
          </>
        )}
      </nav>
    </aside>
  );
}
