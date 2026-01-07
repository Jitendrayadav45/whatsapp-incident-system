import { useMemo, useState, useEffect } from "react";
import { createAdmin } from "../../api/admins.api";
import { useNavigate } from "react-router-dom";
import { ROLES } from "../../utils/constants";
import { useAuth } from "../../auth/useAuth";
import useSites from "../../hooks/useSites";

export default function CreateAdmin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { sites, loading: loadingSites } = useSites();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: ROLES.SUB_SITE_ADMIN,
    allowedSites: [],
    allowedSubSites: []
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState({ show: false, message: "", type: "success" });
  const [focusedField, setFocusedField] = useState("");

  function showNotification(message, type = "success") {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "success" });
    }, 4000);
  }

  // Filter sites based on user role
  const availableSites = useMemo(() => {
    console.log("Calculating availableSites:", { 
      userRole: user.role, 
      totalSites: sites.length, 
      userAllowedSites: user.allowedSites 
    });
    
    if (user.role === ROLES.OWNER) return sites;
    // SITE_ADMIN can only assign their allowed sites
    if (user.role === ROLES.SITE_ADMIN) {
      const filtered = sites.filter((s) => user.allowedSites?.includes(s.siteId));
      console.log("Filtered sites for SITE_ADMIN:", filtered);
      return filtered;
    }
    return [];
  }, [sites, user]);

  // Auto-select sites for SITE_ADMIN
  useEffect(() => {
    console.log("Auto-select effect:", {
      userRole: user.role,
      availableSitesCount: availableSites.length,
      currentAllowedSites: form.allowedSites
    });
    
    if (user.role === ROLES.SITE_ADMIN && availableSites.length > 0 && form.allowedSites.length === 0) {
      const siteIds = availableSites.map(s => s.siteId);
      console.log("Auto-selecting sites:", siteIds);
      setForm(prev => ({ ...prev, allowedSites: siteIds }));
    }
  }, [user.role, availableSites, form.allowedSites.length]);

  const selectedSubSiteOptions = useMemo(() => {
    if (!form.allowedSites.length) return [];
    return availableSites
      .filter((s) => form.allowedSites.includes(s.siteId))
      .flatMap((s) => s.subSites || []);
  }, [availableSites, form.allowedSites]);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("Creating admin with data:", form);
      await createAdmin(form);
      showNotification("Admin created successfully!", "success");
      setTimeout(() => {
        navigate("/admins");
      }, 1500);
    } catch (err) {
      console.error("Create admin error:", err);
      const errorMsg = err.response?.data?.error || "Failed to create admin";
      setError(errorMsg);
      showNotification(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-container">
      {/* Header with gradient */}
      <div style={{
        marginBottom: 32,
        padding: "24px 32px",
        background: "linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.05))",
        borderRadius: 16,
        border: "1px solid rgba(59, 130, 246, 0.2)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #3b82f6, #2563eb)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 28,
            boxShadow: "0 8px 24px rgba(59, 130, 246, 0.4)"
          }}>
            ➕
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: 28, fontWeight: 700, letterSpacing: "-0.5px" }}>
              {user.role === ROLES.OWNER ? "Create Admin User" : "Create Sub-Site Admin"}
            </h2>
            <p style={{ margin: "6px 0 0 0", fontSize: 15, color: "#94a3b8" }}>
              Add a new administrator to your system
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={submit} style={{ 
        background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
        border: "1px solid rgba(226, 232, 240, 0.08)",
        borderRadius: 16,
        padding: 0,
        overflow: "hidden",
        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)"
      }}>
        {error && (
          <div style={{
            padding: "16px 32px",
            background: "linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(220, 38, 38, 0.1))",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            borderBottom: "1px solid rgba(239, 68, 68, 0.3)",
            color: "#fca5a5",
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 15
          }}>
            <span style={{ fontSize: 20 }}>⚠️</span>
            <span>{error}</span>
          </div>
        )}
        
        {loadingSites && (
          <div style={{
            padding: "16px 32px",
            background: "linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(37, 99, 235, 0.1))",
            border: "1px solid rgba(59, 130, 246, 0.3)",
            borderBottom: "1px solid rgba(59, 130, 246, 0.3)",
            color: "#93c5fd",
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 15
          }}>
            <span style={{ fontSize: 20 }}>⏳</span>
            <span>Loading sites...</span>
          </div>
        )}

        {/* Form Content */}
        <div style={{ padding: "32px" }}>
          {/* Basic Information Section */}
          <div style={{ marginBottom: 32 }}>
            <h3 style={{
              fontSize: 16,
              fontWeight: 700,
              color: "#94a3b8",
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginBottom: 20,
              display: "flex",
              alignItems: "center",
              gap: 8
            }}>
              <span style={{ fontSize: 20 }}>👤</span> Basic Information
            </h3>
            
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 20
            }}>
              {/* Name Field */}
              <div>
                <label style={{
                  display: "block",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#94a3b8",
                  marginBottom: 8
                }}>
                  Full Name <span style={{ color: "#f87171" }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={form.name}
                  required
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField("")}
                  style={{
                    width: "100%",
                    padding: "14px 18px",
                    fontSize: 15,
                    background: "rgba(15, 23, 42, 0.6)",
                    border: focusedField === "name" 
                      ? "2px solid rgba(59, 130, 246, 0.5)" 
                      : "2px solid rgba(226, 232, 240, 0.1)",
                    borderRadius: 10,
                    color: "#e2e8f0",
                    outline: "none",
                    transition: "all 0.2s ease",
                    boxShadow: focusedField === "name" 
                      ? "0 0 0 4px rgba(59, 130, 246, 0.1)" 
                      : "none"
                  }}
                />
              </div>

              {/* Email Field */}
              <div>
                <label style={{
                  display: "block",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#94a3b8",
                  marginBottom: 8
                }}>
                  Email Address <span style={{ color: "#f87171" }}>*</span>
                </label>
                <input
                  type="email"
                  placeholder="admin@example.com"
                  value={form.email}
                  required
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField("")}
                  style={{
                    width: "100%",
                    padding: "14px 18px",
                    fontSize: 15,
                    background: "rgba(15, 23, 42, 0.6)",
                    border: focusedField === "email" 
                      ? "2px solid rgba(59, 130, 246, 0.5)" 
                      : "2px solid rgba(226, 232, 240, 0.1)",
                    borderRadius: 10,
                    color: "#e2e8f0",
                    outline: "none",
                    transition: "all 0.2s ease",
                    boxShadow: focusedField === "email" 
                      ? "0 0 0 4px rgba(59, 130, 246, 0.1)" 
                      : "none"
                  }}
                />
              </div>

              {/* Password Field */}
              <div>
                <label style={{
                  display: "block",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#94a3b8",
                  marginBottom: 8
                }}>
                  Password <span style={{ color: "#f87171" }}>*</span>
                </label>
                <input
                  type="password"
                  placeholder="Minimum 6 characters"
                  value={form.password}
                  required
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField("")}
                  style={{
                    width: "100%",
                    padding: "14px 18px",
                    fontSize: 15,
                    background: "rgba(15, 23, 42, 0.6)",
                    border: focusedField === "password" 
                      ? "2px solid rgba(59, 130, 246, 0.5)" 
                      : "2px solid rgba(226, 232, 240, 0.1)",
                    borderRadius: 10,
                    color: "#e2e8f0",
                    outline: "none",
                    transition: "all 0.2s ease",
                    boxShadow: focusedField === "password" 
                      ? "0 0 0 4px rgba(59, 130, 246, 0.1)" 
                      : "none"
                  }}
                />
                <div style={{ 
                  fontSize: 13, 
                  color: "#64748b", 
                  marginTop: 6,
                  display: "flex",
                  alignItems: "center",
                  gap: 6
                }}>
                  <span>🔒</span> Password will be securely encrypted
                </div>
              </div>

              {/* Role Field */}
              <div>
                <label style={{
                  display: "block",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#94a3b8",
                  marginBottom: 8
                }}>
                  Admin Role <span style={{ color: "#f87171" }}>*</span>
                </label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  onFocus={() => setFocusedField("role")}
                  onBlur={() => setFocusedField("")}
                  style={{
                    width: "100%",
                    padding: "14px 18px",
                    fontSize: 15,
                    background: "rgba(15, 23, 42, 0.6)",
                    border: focusedField === "role" 
                      ? "2px solid rgba(59, 130, 246, 0.5)" 
                      : "2px solid rgba(226, 232, 240, 0.1)",
                    borderRadius: 10,
                    color: "#e2e8f0",
                    outline: "none",
                    transition: "all 0.2s ease",
                    cursor: "pointer",
                    boxShadow: focusedField === "role" 
                      ? "0 0 0 4px rgba(59, 130, 246, 0.1)" 
                      : "none"
                  }}
                >
                  {user.role === ROLES.OWNER && (
                    <option value={ROLES.SITE_ADMIN}>SITE_ADMIN</option>
                  )}
                  <option value={ROLES.SUB_SITE_ADMIN}>SUB_SITE_ADMIN</option>
                </select>
                <div style={{ 
                  fontSize: 13, 
                  color: "#64748b", 
                  marginTop: 6 
                }}>
                  {form.role === ROLES.SITE_ADMIN 
                    ? "📍 Can manage specific sites"
                    : "🏗 Can manage specific sub-sites"}
                </div>
              </div>
            </div>
          </div>

          {/* Permissions Section */}
          <div style={{ marginBottom: 24 }}>
            <h3 style={{
              fontSize: 16,
              fontWeight: 700,
              color: "#94a3b8",
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginBottom: 20,
              display: "flex",
              alignItems: "center",
              gap: 8
            }}>
              <span style={{ fontSize: 20 }}>🔐</span> Access Permissions
            </h3>

            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 24
            }}>
              {/* Allowed Sites */}
              <div style={{
                background: "rgba(15, 23, 42, 0.6)",
                padding: 20,
                borderRadius: 12,
                border: "1px solid rgba(226, 232, 240, 0.08)"
              }}>
                <label style={{
                  display: "block",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#94a3b8",
                  marginBottom: 12,
                  display: "flex",
                  alignItems: "center",
                  gap: 8
                }}>
                  <span>📍</span> Allowed Sites
                  {user.role === ROLES.SITE_ADMIN && (
                    <span style={{
                      padding: "2px 8px",
                      background: "rgba(251, 191, 36, 0.2)",
                      color: "#fbbf24",
                      fontSize: 11,
                      borderRadius: 4,
                      fontWeight: 600
                    }}>
                      AUTO-SELECTED
                    </span>
                  )}
                </label>
                <select
                  multiple
                  size={6}
                  value={form.allowedSites}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      allowedSites: Array.from(e.target.selectedOptions).map(o => o.value),
                      allowedSubSites: []
                    })
                  }
                  disabled={user.role === ROLES.SITE_ADMIN || loadingSites || !availableSites.length}
                  style={{
                    width: "100%",
                    padding: "12px",
                    fontSize: 14,
                    background: "rgba(15, 23, 42, 0.8)",
                    border: "2px solid rgba(226, 232, 240, 0.1)",
                    borderRadius: 8,
                    color: "#e2e8f0",
                    outline: "none",
                    cursor: user.role === ROLES.SITE_ADMIN ? "not-allowed" : "pointer",
                    opacity: user.role === ROLES.SITE_ADMIN ? 0.7 : 1
                  }}
                >
                  {availableSites.map((site) => (
                    <option 
                      key={site.siteId} 
                      value={site.siteId}
                      style={{ 
                        padding: "8px 12px",
                        marginBottom: 4,
                        background: form.allowedSites.includes(site.siteId) 
                          ? "rgba(59, 130, 246, 0.3)" 
                          : "transparent",
                        borderRadius: 4
                      }}
                    >
                      {site.siteName} ({site.siteId})
                    </option>
                  ))}
                </select>
                <div style={{ 
                  fontSize: 12, 
                  color: "#64748b", 
                  marginTop: 8,
                  padding: "8px 12px",
                  background: "rgba(100, 116, 139, 0.1)",
                  borderRadius: 6,
                  border: "1px solid rgba(100, 116, 139, 0.2)"
                }}>
                  {user.role === ROLES.SITE_ADMIN 
                    ? "🔒 Your assigned sites are automatically selected"
                    : form.allowedSites.length > 0
                    ? `✓ ${form.allowedSites.length} site${form.allowedSites.length > 1 ? 's' : ''} selected`
                    : "ℹ️ Hold Ctrl/Cmd and click to select multiple"}
                </div>
              </div>

              {/* Allowed Sub-Sites */}
              <div style={{
                background: "rgba(15, 23, 42, 0.6)",
                padding: 20,
                borderRadius: 12,
                border: "1px solid rgba(226, 232, 240, 0.08)",
                opacity: form.role === ROLES.SITE_ADMIN ? 0.5 : 1,
                position: "relative"
              }}>
                {form.role === ROLES.SITE_ADMIN && (
                  <div style={{
                    position: "absolute",
                    top: 20,
                    right: 20,
                    padding: "4px 10px",
                    background: "rgba(100, 116, 139, 0.3)",
                    color: "#94a3b8",
                    fontSize: 11,
                    borderRadius: 4,
                    fontWeight: 600,
                    border: "1px solid rgba(100, 116, 139, 0.4)"
                  }}>
                    🔒 NOT REQUIRED
                  </div>
                )}
                <label style={{
                  display: "block",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#94a3b8",
                  marginBottom: 12,
                  display: "flex",
                  alignItems: "center",
                  gap: 8
                }}>
                  <span>🏗</span> Allowed Sub-Sites
                  {selectedSubSiteOptions.length > 0 && form.role !== ROLES.SITE_ADMIN && (
                    <span style={{
                      padding: "2px 8px",
                      background: "rgba(59, 130, 246, 0.2)",
                      color: "#60a5fa",
                      fontSize: 11,
                      borderRadius: 4,
                      fontWeight: 600
                    }}>
                      {selectedSubSiteOptions.length} AVAILABLE
                    </span>
                  )}
                </label>
                <select
                  multiple
                  size={6}
                  value={form.allowedSubSites}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      allowedSubSites: Array.from(e.target.selectedOptions).map(o => o.value)
                    })
                  }
                  disabled={form.role === ROLES.SITE_ADMIN || !selectedSubSiteOptions.length}
                  style={{
                    width: "100%",
                    padding: "12px",
                    fontSize: 14,
                    background: "rgba(15, 23, 42, 0.8)",
                    border: "2px solid rgba(226, 232, 240, 0.1)",
                    borderRadius: 8,
                    color: "#e2e8f0",
                    outline: "none",
                    cursor: (form.role === ROLES.SITE_ADMIN || !selectedSubSiteOptions.length) ? "not-allowed" : "pointer",
                    opacity: (form.role === ROLES.SITE_ADMIN || !selectedSubSiteOptions.length) ? 0.5 : 1
                  }}
                >
                  {selectedSubSiteOptions.length > 0 ? (
                    selectedSubSiteOptions.map((sub) => (
                      <option 
                        key={sub.subSiteId} 
                        value={sub.subSiteId}
                        style={{ 
                          padding: "8px 12px",
                          marginBottom: 4,
                          background: form.allowedSubSites.includes(sub.subSiteId) 
                            ? "rgba(139, 92, 246, 0.3)" 
                            : "transparent",
                          borderRadius: 4
                        }}
                      >
                        {sub.subSiteName} ({sub.subSiteId})
                      </option>
                    ))
                  ) : (
                    <option disabled>Select sites first to view sub-sites</option>
                  )}
                </select>
                <div style={{ 
                  fontSize: 12, 
                  color: "#64748b", 
                  marginTop: 8,
                  padding: "8px 12px",
                  background: "rgba(100, 116, 139, 0.1)",
                  borderRadius: 6,
                  border: "1px solid rgba(100, 116, 139, 0.2)"
                }}>
                  {form.role === ROLES.SITE_ADMIN
                    ? "🔒 Sub-sites are not required for SITE_ADMIN role"
                    : !selectedSubSiteOptions.length 
                    ? "ℹ️ Select sites to view available sub-sites"
                    : form.allowedSubSites.length > 0
                    ? `✓ ${form.allowedSubSites.length} sub-site${form.allowedSubSites.length > 1 ? 's' : ''} selected`
                    : "ℹ️ Hold Ctrl/Cmd and click to select multiple"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{
          padding: "20px 32px",
          borderTop: "1px solid rgba(226, 232, 240, 0.08)",
          background: "rgba(15, 23, 42, 0.5)",
          display: "flex",
          gap: 12,
          justifyContent: "flex-end"
        }}>
          <button
            type="button"
            onClick={() => navigate("/admins")}
            disabled={loading}
            style={{
              fontSize: 15,
              padding: "12px 28px",
              fontWeight: 600,
              background: "transparent",
              border: "2px solid rgba(148, 163, 184, 0.4)",
              color: "#cbd5e1",
              borderRadius: 10,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.background = "rgba(148, 163, 184, 0.15)";
                e.currentTarget.style.borderColor = "rgba(148, 163, 184, 0.7)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(148, 163, 184, 0.3)";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = "rgba(148, 163, 184, 0.4)";
                e.currentTarget.style.boxShadow = "none";
              }
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || loadingSites}
            style={{
              fontSize: 15,
              padding: "12px 32px",
              fontWeight: 600,
              background: loading 
                ? "rgba(59, 130, 246, 0.4)" 
                : "linear-gradient(135deg, #3b82f6, #2563eb)",
              border: "2px solid rgba(59, 130, 246, 0.6)",
              color: "white",
              borderRadius: 10,
              cursor: (loading || loadingSites) ? "not-allowed" : "pointer",
              opacity: (loading || loadingSites) ? 0.6 : 1,
              transition: "all 0.2s ease",
              boxShadow: loading 
                ? "none" 
                : "0 8px 24px rgba(59, 130, 246, 0.4)",
              minWidth: 140
            }}
            onMouseEnter={(e) => {
              if (!loading && !loadingSites) {
                e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
                e.currentTarget.style.background = "linear-gradient(135deg, #60a5fa, #3b82f6)";
                e.currentTarget.style.boxShadow = "0 12px 32px rgba(59, 130, 246, 0.5), 0 0 20px rgba(59, 130, 246, 0.3)";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading && !loadingSites) {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.background = "linear-gradient(135deg, #3b82f6, #2563eb)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(59, 130, 246, 0.4)";
              }
            }}
          >
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ 
                  display: "inline-block", 
                  width: 16, 
                  height: 16, 
                  border: "2px solid rgba(255,255,255,0.3)",
                  borderTop: "2px solid white",
                  borderRadius: "50%",
                  animation: "spin 0.6s linear infinite"
                }}></span>
                Creating...
              </span>
            ) : (
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span>✓</span> Create Admin
              </span>
            )}
          </button>
        </div>
      </form>

      {/* NOTIFICATION TOAST */}
      {notification.show && (
        <div
          style={{
            position: "fixed",
            top: 24,
            right: 24,
            zIndex: 10001,
            minWidth: 320,
            maxWidth: 500,
            background: notification.type === "success"
              ? "linear-gradient(135deg, rgba(52, 211, 153, 0.95), rgba(16, 185, 129, 0.95))"
              : notification.type === "error"
              ? "linear-gradient(135deg, rgba(239, 68, 68, 0.95), rgba(220, 38, 38, 0.95))"
              : "linear-gradient(135deg, rgba(251, 191, 36, 0.95), rgba(245, 158, 11, 0.95))",
            color: "white",
            padding: "16px 20px",
            borderRadius: 12,
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
            display: "flex",
            alignItems: "center",
            gap: 12,
            animation: "slideInRight 0.3s ease",
            border: `1px solid ${notification.type === "success"
              ? "rgba(52, 211, 153, 0.5)"
              : notification.type === "error"
              ? "rgba(239, 68, 68, 0.5)"
              : "rgba(251, 191, 36, 0.5)"}`
          }}
        >
          <div style={{ fontSize: 24 }}>
            {notification.type === "success" ? "✓" : notification.type === "error" ? "✕" : "ℹ"}
          </div>
          <div style={{ flex: 1, fontSize: 15, fontWeight: 500, lineHeight: 1.4 }}>
            {notification.message}
          </div>
          <button
            onClick={() => setNotification({ show: false, message: "", type: "success" })}
            style={{
              background: "rgba(255, 255, 255, 0.2)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              borderRadius: 6,
              width: 24,
              height: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "white",
              fontSize: 16,
              fontWeight: 700,
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.3)";
              e.currentTarget.style.transform = "scale(1.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* Add CSS Animation for spinner */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}