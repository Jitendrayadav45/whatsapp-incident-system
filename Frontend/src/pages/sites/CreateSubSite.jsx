// src/pages/sites/CreateSubSite.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { createSubSite } from "../../api/sites.api";

export default function CreateSubSite() {
  const { siteId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ subSiteId: "", subSiteName: "" });
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

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await createSubSite(siteId, form);
      showNotification("Sub-Site created successfully!", "success");
      setTimeout(() => {
        navigate("/sites");
      }, 1500);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to create sub-site";
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
        background: "linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(124, 58, 237, 0.05))",
        borderRadius: 16,
        border: "1px solid rgba(139, 92, 246, 0.2)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 28,
            boxShadow: "0 8px 24px rgba(139, 92, 246, 0.4)"
          }}>
            🏗
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: 28, fontWeight: 700, letterSpacing: "-0.5px" }}>
              Create Sub-Site for {siteId}
            </h2>
            <p style={{ margin: "6px 0 0 0", fontSize: 15, color: "#94a3b8" }}>
              Add a new sub-site unit to <span style={{ color: "#a78bfa", fontWeight: 600 }}>{siteId}</span> site
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

        {/* Form Content */}
        <div style={{ padding: "32px" }}>
          {/* Sub-Site Information Section */}
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
              <span style={{ fontSize: 20 }}>📋</span> Sub-Site Information
            </h3>
            
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 24
            }}>
              {/* Sub-Site ID Field */}
              <div>
                <label style={{
                  display: "block",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#94a3b8",
                  marginBottom: 8
                }}>
                  Sub-Site ID <span style={{ color: "#f87171" }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., GITA1"
                  value={form.subSiteId}
                  required
                  onChange={e => setForm({ ...form, subSiteId: e.target.value.toUpperCase() })}
                  onFocus={() => setFocusedField("subSiteId")}
                  onBlur={() => setFocusedField("")}
                  style={{
                    width: "100%",
                    padding: "14px 18px",
                    fontSize: 15,
                    background: "rgba(15, 23, 42, 0.6)",
                    border: focusedField === "subSiteId" 
                      ? "2px solid rgba(139, 92, 246, 0.5)" 
                      : "2px solid rgba(226, 232, 240, 0.1)",
                    borderRadius: 10,
                    color: "#e2e8f0",
                    outline: "none",
                    transition: "all 0.2s ease",
                    textTransform: "uppercase",
                    fontWeight: 600,
                    letterSpacing: "0.5px",
                    boxShadow: focusedField === "subSiteId" 
                      ? "0 0 0 4px rgba(139, 92, 246, 0.1)" 
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
                  <span>💡</span> Unique identifier in uppercase (e.g., GITA1, JIT2)
                </div>
              </div>

              {/* Sub-Site Name Field */}
              <div>
                <label style={{
                  display: "block",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#94a3b8",
                  marginBottom: 8
                }}>
                  Sub-Site Name <span style={{ color: "#f87171" }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., GITA Unit 1"
                  value={form.subSiteName}
                  required
                  onChange={e => setForm({ ...form, subSiteName: e.target.value })}
                  onFocus={() => setFocusedField("subSiteName")}
                  onBlur={() => setFocusedField("")}
                  style={{
                    width: "100%",
                    padding: "14px 18px",
                    fontSize: 15,
                    background: "rgba(15, 23, 42, 0.6)",
                    border: focusedField === "subSiteName" 
                      ? "2px solid rgba(139, 92, 246, 0.5)" 
                      : "2px solid rgba(226, 232, 240, 0.1)",
                    borderRadius: 10,
                    color: "#e2e8f0",
                    outline: "none",
                    transition: "all 0.2s ease",
                    boxShadow: focusedField === "subSiteName" 
                      ? "0 0 0 4px rgba(139, 92, 246, 0.1)" 
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
                  <span>🏢</span> Full descriptive name of the sub-site unit
                </div>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div style={{
            background: "rgba(139, 92, 246, 0.1)",
            border: "1px solid rgba(139, 92, 246, 0.3)",
            borderRadius: 10,
            padding: 16,
            display: "flex",
            alignItems: "start",
            gap: 12
          }}>
            <span style={{ fontSize: 24 }}>ℹ️</span>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#a78bfa", marginBottom: 4 }}>
                Sub-Site Configuration
              </div>
              <div style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.6 }}>
                This sub-site will be created under <strong style={{ color: "#a78bfa" }}>{siteId}</strong> site. You can assign sub-site administrators to manage tickets for this specific unit.
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
            onClick={() => navigate("/sites")}
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
            disabled={loading}
            style={{
              fontSize: 15,
              padding: "12px 32px",
              fontWeight: 600,
              background: loading 
                ? "rgba(139, 92, 246, 0.4)" 
                : "linear-gradient(135deg, #8b5cf6, #7c3aed)",
              border: "2px solid rgba(139, 92, 246, 0.6)",
              color: "white",
              borderRadius: 10,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
              transition: "all 0.2s ease",
              boxShadow: loading 
                ? "none" 
                : "0 8px 24px rgba(139, 92, 246, 0.4)",
              minWidth: 160
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
                e.currentTarget.style.background = "linear-gradient(135deg, #a78bfa, #8b5cf6)";
                e.currentTarget.style.boxShadow = "0 12px 32px rgba(139, 92, 246, 0.5), 0 0 20px rgba(139, 92, 246, 0.3)";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.background = "linear-gradient(135deg, #8b5cf6, #7c3aed)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(139, 92, 246, 0.4)";
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
                <span>✓</span> Create Sub-Site
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