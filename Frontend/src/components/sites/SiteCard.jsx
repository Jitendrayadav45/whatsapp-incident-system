import { useState } from "react";
import { disableSite, enableSite, deleteSite, disableSubSite, enableSubSite, deleteSubSite } from "../../api/sites.api";
import { useAuth } from "../../auth/useAuth";
import { ROLES } from "../../utils/constants";
import QRCodeModal from "./QRCodeModal";

export default function SiteCard({ site, onRefresh }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({ show: false, message: "", onConfirm: null, type: "info" });
  const [qrModal, setQrModal] = useState({ show: false, site: null, subSite: null });

  const canManageSite = user.role === ROLES.OWNER;
  const canManageSubSite = user.role === ROLES.OWNER || user.role === ROLES.SITE_ADMIN;

  function showConfirmDialog(message, onConfirm, type = "info") {
    setConfirmDialog({ show: true, message, onConfirm, type });
  }

  function hideConfirmDialog() {
    setConfirmDialog({ show: false, message: "", onConfirm: null, type: "info" });
  }

  function showQRModal(siteData, subSiteData = null) {
    setQrModal({ show: true, site: siteData, subSite: subSiteData });
  }

  function hideQRModal() {
    setQrModal({ show: false, site: null, subSite: null });
  }

  async function handleToggleSite() {
    const action = site.isActive ? "disable" : "enable";
    const actionText = action === "disable" ? "Disable" : "Enable";
    
    showConfirmDialog(
      `Are you sure you want to ${action} site "${site.siteName}"?`,
      async () => {
        try {
          setLoading(true);
          if (site.isActive) {
            await disableSite(site.siteId);
          } else {
            await enableSite(site.siteId);
          }
          onRefresh?.();
        } catch (err) {
          console.error(`${action} site failed`, err);
          alert(`Failed to ${action} site. Please try again.`);
        } finally {
          setLoading(false);
        }
      },
      action === "disable" ? "warning" : "success"
    );
  }

  async function handleDeleteSite() {
    showConfirmDialog(
      `⚠️ PERMANENTLY DELETE site "${site.siteName}" and ALL its sub-sites?\n\nThis action cannot be undone!`,
      async () => {
        try {
          setLoading(true);
          await deleteSite(site.siteId);
          onRefresh?.();
        } catch (err) {
          console.error("Delete site failed", err);
          alert("Failed to delete site. Please try again.");
        } finally {
          setLoading(false);
        }
      },
      "danger"
    );
  }

  async function handleToggleSubSite(subSiteId, isActive) {
    const action = isActive ? "disable" : "enable";
    const subSite = site.subSites.find(s => s.subSiteId === subSiteId);
    
    showConfirmDialog(
      `Are you sure you want to ${action} sub-site "${subSite?.subSiteName || subSiteId}"?`,
      async () => {
        try {
          setLoading(true);
          if (isActive) {
            await disableSubSite(site.siteId, subSiteId);
          } else {
            await enableSubSite(site.siteId, subSiteId);
          }
          onRefresh?.();
        } catch (err) {
          console.error(`${action} sub-site failed`, err);
          alert(`Failed to ${action} sub-site. Please try again.`);
        } finally {
          setLoading(false);
        }
      },
      action === "disable" ? "warning" : "success"
    );
  }

  async function handleDeleteSubSite(subSiteId) {
    const subSite = site.subSites.find(s => s.subSiteId === subSiteId);
    
    showConfirmDialog(
      `⚠️ PERMANENTLY DELETE sub-site "${subSite?.subSiteName || subSiteId}"?\n\nThis action cannot be undone!`,
      async () => {
        try {
          setLoading(true);
          await deleteSubSite(site.siteId, subSiteId);
          onRefresh?.();
        } catch (err) {
          console.error("Delete sub-site failed", err);
          alert("Failed to delete sub-site. Please try again.");
        } finally {
          setLoading(false);
        }
      },
      "danger"
    );
  }

  return (
    <div 
      className="card" 
      style={{ 
        marginBottom: 24,
        transition: "all 0.3s ease",
        border: "1px solid rgba(226, 232, 240, 0.08)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 12px 40px rgba(59, 130, 246, 0.15)";
        e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.3)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 16px 40px rgba(0, 0, 0, 0.25)";
        e.currentTarget.style.borderColor = "rgba(226, 232, 240, 0.08)";
      }}
    >
      {/* SITE HEADER */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: 24,
        paddingBottom: 20,
        borderBottom: "1px solid rgba(226, 232, 240, 0.08)"
      }}>
        <div>
          <h3 style={{ margin: 0, marginBottom: 10, fontSize: 26, fontWeight: 700 }}>{site.siteName}</h3>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <small style={{ 
              color: "#64748b", 
              fontSize: 15,
              padding: "6px 14px",
              background: "rgba(100, 116, 139, 0.1)",
              borderRadius: 6,
              border: "1px solid rgba(100, 116, 139, 0.2)"
            }}>
              📍 {site.siteId}
            </small>
            {!site.isActive && (
              <span style={{ 
                background: "linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.15))",
                color: "#fca5a5",
                border: "1px solid rgba(239, 68, 68, 0.4)",
                padding: "6px 14px",
                borderRadius: 6,
                fontSize: 14,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}>
                🔴 Disabled
              </span>
            )}
          </div>
        </div>

        {canManageSite && (
          <div style={{ display: "flex", gap: 12 }}>
            <button
              onClick={() => showQRModal(site)}
              style={{ 
                fontSize: 15,
                padding: "12px 24px",
                fontWeight: 700,
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(16, 185, 129, 0.5), 0 0 30px rgba(16, 185, 129, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(16, 185, 129, 0.3)";
              }}
            >
              <span style={{ fontSize: "18px" }}>📱</span>
              <span>QR Code</span>
            </button>
            <button
              className={site.isActive ? "btn btn-outline" : "btn btn-primary"}
              disabled={loading}
              onClick={handleToggleSite}
              style={{ 
                fontSize: 15,
                padding: "12px 24px",
                fontWeight: 600,
                transition: "all 0.2s ease",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.6 : 1
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  if (site.isActive) {
                    e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
                    e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.6)";
                    e.currentTarget.style.color = "#fca5a5";
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(239, 68, 68, 0.3)";
                  } else {
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(59, 130, 246, 0.4)";
                  }
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = site.isActive ? "none" : "0 12px 28px rgba(37, 99, 235, 0.28)";
                  if (site.isActive) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.4)";
                    e.currentTarget.style.color = "#60a5fa";
                  }
                }
              }}
            >
              {site.isActive ? "🔴 Disable" : "✅ Enable"}
            </button>
            <button
              className="btn btn-outline"
              disabled={loading}
              onClick={handleDeleteSite}
              style={{ 
                fontSize: 15,
                padding: "12px 24px",
                fontWeight: 600,
                borderColor: "rgba(239, 68, 68, 0.4)",
                color: "#f87171",
                transition: "all 0.2s ease",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.6 : 1
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.background = "rgba(239, 68, 68, 0.15)";
                  e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.7)";
                  e.currentTarget.style.color = "#fca5a5";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(239, 68, 68, 0.4)";
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.4)";
                  e.currentTarget.style.color = "#f87171";
                  e.currentTarget.style.boxShadow = "none";
                }
              }}
            >
              🗑️ Delete
            </button>
          </div>
        )}
      </div>

      {/* SUB-SITES */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <h4 style={{ 
            margin: 0, 
            fontSize: 15, 
            color: "#94a3b8", 
            textTransform: "uppercase", 
            letterSpacing: "1px",
            fontWeight: 700
          }}>
            🏗 Sub-Sites ({site.subSites?.length || 0})
          </h4>
          {canManageSubSite && site.isActive && (
            <a 
              href={`/sites/${site.siteId}/subsites/create`} 
              className="premium-add-subsite-btn"
              style={{ 
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                fontSize: 15, 
                padding: "12px 24px",
                fontWeight: 700,
                background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                color: "#fff",
                borderRadius: "10px",
                textDecoration: "none",
                border: "none",
                boxShadow: "0 6px 20px rgba(139, 92, 246, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.1)",
                transition: "all 0.3s ease",
                cursor: "pointer",
                letterSpacing: "0.2px"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px) scale(1.02)";
                e.currentTarget.style.boxShadow = "0 10px 28px rgba(139, 92, 246, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.15), 0 0 35px rgba(139, 92, 246, 0.3)";
                e.currentTarget.style.background = "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(139, 92, 246, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.1)";
                e.currentTarget.style.background = "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)";
              }}
            >
              <span style={{ fontSize: "18px", fontWeight: "bold" }}>+</span>
              <span>Add Sub-Site</span>
              <span style={{ fontSize: "16px" }}>🏗</span>
            </a>
          )}
        </div>

        {site.subSites?.length === 0 && (
          <div style={{ 
            color: "#64748b", 
            fontSize: 16,
            textAlign: "center",
            padding: "24px",
            background: "rgba(100, 116, 139, 0.05)",
            borderRadius: 8,
            border: "1px dashed rgba(100, 116, 139, 0.2)"
          }}>
            No sub-sites available
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {site.subSites?.map((subSite) => (
            <div 
              key={subSite.subSiteId} 
              className="subsite-item"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 18,
                background: "rgba(15, 23, 42, 0.6)",
                border: "1px solid rgba(226, 232, 240, 0.08)",
                borderRadius: 10,
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(59, 130, 246, 0.08)";
                e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.3)";
                e.currentTarget.style.transform = "translateX(4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(15, 23, 42, 0.6)";
                e.currentTarget.style.borderColor = "rgba(226, 232, 240, 0.08)";
                e.currentTarget.style.transform = "translateX(0)";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: subSite.isActive 
                    ? "linear-gradient(135deg, #34d399, #10b981)" 
                    : "linear-gradient(135deg, #f87171, #ef4444)",
                  boxShadow: subSite.isActive 
                    ? "0 0 10px rgba(52, 211, 153, 0.5)" 
                    : "0 0 10px rgba(248, 113, 113, 0.5)"
                }}></div>
                <strong style={{ fontSize: 17, fontWeight: 600 }}>{subSite.subSiteName}</strong>
                <small style={{ 
                  color: "#64748b",
                  padding: "4px 10px",
                  background: "rgba(100, 116, 139, 0.15)",
                  borderRadius: 4,
                  fontSize: 13
                }}>
                  {subSite.subSiteId}
                </small>
                {!subSite.isActive && (
                  <span style={{ 
                    background: "linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.15))",
                    color: "#fca5a5",
                    border: "1px solid rgba(239, 68, 68, 0.4)",
                    padding: "4px 10px",
                    borderRadius: 4,
                    fontSize: 12,
                    fontWeight: 600,
                    textTransform: "uppercase"
                  }}>
                    Disabled
                  </span>
                )}
              </div>

              {canManageSubSite && (
                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    onClick={() => showQRModal(site, subSite)}
                    style={{ 
                      fontSize: 14, 
                      padding: "8px 18px",
                      fontWeight: 700,
                      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.08) translateY(-1px)";
                      e.currentTarget.style.boxShadow = "0 6px 20px rgba(16, 185, 129, 0.5)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1) translateY(0)";
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(16, 185, 129, 0.3)";
                    }}
                  >
                    <span style={{ fontSize: "16px" }}>📱</span>
                    <span>QR</span>
                  </button>
                  <button
                    className="btn btn-outline"
                    disabled={loading}
                    onClick={() => handleToggleSubSite(subSite.subSiteId, subSite.isActive)}
                    style={{ 
                      fontSize: 14, 
                      padding: "8px 18px",
                      fontWeight: 600,
                      transition: "all 0.2s ease",
                      cursor: loading ? "not-allowed" : "pointer",
                      opacity: loading ? 0.6 : 1
                    }}
                    onMouseEnter={(e) => {
                      if (!loading) {
                        e.currentTarget.style.transform = "scale(1.08) translateY(-1px)";
                        if (subSite.isActive) {
                          e.currentTarget.style.background = "rgba(239, 68, 68, 0.15)";
                          e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.6)";
                          e.currentTarget.style.color = "#fca5a5";
                          e.currentTarget.style.boxShadow = "0 6px 20px rgba(239, 68, 68, 0.3)";
                        } else {
                          e.currentTarget.style.background = "rgba(59, 130, 246, 0.15)";
                          e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.6)";
                          e.currentTarget.style.color = "#60a5fa";
                          e.currentTarget.style.boxShadow = "0 6px 20px rgba(59, 130, 246, 0.3)";
                        }
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!loading) {
                        e.currentTarget.style.transform = "scale(1) translateY(0)";
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.4)";
                        e.currentTarget.style.color = "#60a5fa";
                        e.currentTarget.style.boxShadow = "none";
                      }
                    }}
                  >
                    {subSite.isActive ? "Disable" : "Enable"}
                  </button>
                  <button
                    className="btn btn-outline"
                    disabled={loading}
                    onClick={() => handleDeleteSubSite(subSite.subSiteId)}
                    style={{ 
                      fontSize: 14, 
                      padding: "8px 18px",
                      fontWeight: 600,
                      borderColor: "rgba(239, 68, 68, 0.4)",
                      color: "#f87171",
                      transition: "all 0.2s ease",
                      cursor: loading ? "not-allowed" : "pointer",
                      opacity: loading ? 0.6 : 1
                    }}
                    onMouseEnter={(e) => {
                      if (!loading) {
                        e.currentTarget.style.transform = "scale(1.08) translateY(-1px)";
                        e.currentTarget.style.background = "rgba(239, 68, 68, 0.15)";
                        e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.7)";
                        e.currentTarget.style.color = "#fca5a5";
                        e.currentTarget.style.boxShadow = "0 6px 20px rgba(239, 68, 68, 0.4)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!loading) {
                        e.currentTarget.style.transform = "scale(1) translateY(0)";
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.4)";
                        e.currentTarget.style.color = "#f87171";
                        e.currentTarget.style.boxShadow = "none";
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CUSTOM CONFIRMATION DIALOG */}
      {confirmDialog.show && (
        <div 
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            animation: "fadeIn 0.2s ease"
          }}
          onClick={hideConfirmDialog}
        >
          <div 
            style={{
              background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
              border: confirmDialog.type === "danger" 
                ? "2px solid rgba(239, 68, 68, 0.5)" 
                : confirmDialog.type === "warning"
                ? "2px solid rgba(251, 191, 36, 0.5)"
                : "2px solid rgba(59, 130, 246, 0.5)",
              borderRadius: 16,
              padding: 32,
              maxWidth: 500,
              width: "90%",
              boxShadow: "0 25px 50px rgba(0, 0, 0, 0.5)",
              animation: "slideUp 0.3s ease"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Icon */}
            <div style={{ 
              textAlign: "center", 
              marginBottom: 20,
              fontSize: 48
            }}>
              {confirmDialog.type === "danger" ? "⚠️" : confirmDialog.type === "warning" ? "🔔" : "✅"}
            </div>

            {/* Message */}
            <div style={{ 
              fontSize: 18, 
              color: "#e2e8f0",
              marginBottom: 32,
              textAlign: "center",
              lineHeight: 1.6,
              whiteSpace: "pre-line"
            }}>
              {confirmDialog.message}
            </div>

            {/* Buttons */}
            <div style={{ 
              display: "flex", 
              gap: 12, 
              justifyContent: "center" 
            }}>
              <button
                onClick={hideConfirmDialog}
                className="btn btn-outline"
                style={{ 
                  fontSize: 15,
                  padding: "12px 32px",
                  fontWeight: 600,
                  minWidth: 120,
                  transition: "all 0.2s ease"
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  hideConfirmDialog();
                  confirmDialog.onConfirm?.();
                }}
                className="btn"
                style={{ 
                  fontSize: 15,
                  padding: "12px 32px",
                  fontWeight: 600,
                  minWidth: 120,
                  background: confirmDialog.type === "danger"
                    ? "linear-gradient(135deg, #ef4444, #dc2626)"
                    : confirmDialog.type === "warning"
                    ? "linear-gradient(135deg, #f59e0b, #d97706)"
                    : "linear-gradient(135deg, #3b82f6, #2563eb)",
                  border: "none",
                  color: "white",
                  transition: "all 0.2s ease"
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR CODE MODAL */}
      {qrModal.show && (
        <QRCodeModal 
          site={qrModal.site}
          subSite={qrModal.subSite}
          onClose={hideQRModal}
        />
      )}
    </div>
  );
}