import { useAuth } from "../../auth/useAuth";

export default function Header() {
  const { user, logout, loading } = useAuth();

  if (loading || !user) return null;

  return (
    <header className="header">
      <div className="header-meta">
        <span className="header-title">System Owner ({user.role})</span>
      </div>
      <div className="header-actions">
        <div className="user-pill">
          <span className="user-name">{user.name}</span>
          <span className="user-role">{user.role}</span>
        </div>
        <button className="btn btn-outline" onClick={logout}>
          Logout
        </button>
      </div>
    </header>
  );
}