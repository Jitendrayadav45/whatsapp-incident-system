import { NavLink } from "react-router-dom";
import { SIDEBAR_ITEMS } from "../../utils/sidebarConfig";
import { useAuth } from "../../auth/useAuth";

export default function Sidebar() {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return null;

  return (
    <aside className="sidebar">
      <h2 className="logo">Sentinel</h2>

      <nav>
        {SIDEBAR_ITEMS
          .filter(item => item.roles.includes(user.role))
          .map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive ? "nav active" : "nav"
              }
            >
              {item.label}
            </NavLink>
          ))}
      </nav>
    </aside>
  );
}