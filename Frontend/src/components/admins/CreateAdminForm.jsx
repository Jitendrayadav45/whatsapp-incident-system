// src/components/admins/CreateAdminForm.jsx
import { useState } from "react";
import { createAdmin } from "../../api/admins.api";
import { useAuth } from "../../auth/useAuth";
import { ROLES } from "../../utils/constants";

export default function CreateAdminForm() {
  const { user } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    siteId: "",
    subSiteId: ""
  });

  const allowedRoles =
    user.role === ROLES.OWNER
      ? [ROLES.SITE_ADMIN, ROLES.SUB_SITE_ADMIN]
      : [ROLES.SUB_SITE_ADMIN];

  async function handleSubmit(e) {
    e.preventDefault();
    await createAdmin(form);
    alert("Admin created");
    window.location.href = "/admins";
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Name"
        required
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <input
        placeholder="Email"
        required
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <input
        type="password"
        placeholder="Password"
        required
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <select
        required
        onChange={(e) => setForm({ ...form, role: e.target.value })}
      >
        <option value="">Select Role</option>
        {allowedRoles.map((r) => (
          <option key={r} value={r}>{r}</option>
        ))}
      </select>

      {(form.role === ROLES.SITE_ADMIN ||
        form.role === ROLES.SUB_SITE_ADMIN) && (
        <input
          placeholder="Site ID (e.g. GITA)"
          required
          onChange={(e) =>
            setForm({ ...form, siteId: e.target.value })
          }
        />
      )}

      {form.role === ROLES.SUB_SITE_ADMIN && (
        <input
          placeholder="SubSite ID (e.g. GITA1)"
          required
          onChange={(e) =>
            setForm({ ...form, subSiteId: e.target.value })
          }
        />
      )}

      <button type="submit">Create Admin</button>
    </form>
  );
}