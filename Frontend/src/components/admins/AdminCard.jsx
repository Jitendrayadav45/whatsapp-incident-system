// src/components/admins/AdminCard.jsx
export default function AdminCard({ admin }) {
  return (
    <div className="card">
      <h4>{admin.name}</h4>
      <p>Email: {admin.email}</p>
      <p>Role: {admin.role}</p>

      {admin.allowedSites?.length > 0 && (
        <p>Sites: {admin.allowedSites.join(", ")}</p>
      )}

      {admin.allowedSubSites?.length > 0 && (
        <p>SubSites: {admin.allowedSubSites.join(", ")}</p>
      )}

      <p>Status: {admin.isActive ? "Active" : "Inactive"}</p>
    </div>
  );
}