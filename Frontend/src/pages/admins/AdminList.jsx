import { useEffect, useState } from "react";
import { getAdmins, updateAdminStatus, deleteAdmin, resetAdminPassword } from "../../api/admins.api";
import Loader from "../../components/common/Loader";
import { useAuth } from "../../auth/useAuth";
import { ROLES } from "../../utils/constants";

export default function AdminList() {
  const { user } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({ show: false, message: "", onConfirm: null, type: "info" });
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [passwordResetDialog, setPasswordResetDialog] = useState({ show: false, adminId: null, adminName: "" });
  const [newPassword, setNewPassword] = useState("");
  const [notification, setNotification] = useState({ show: false, message: "", type: "success" });

  const isOwner = user.role === ROLES.OWNER;

  function showNotification(message, type = "success") {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "success" });
    }, 4000);
  }

  function showAdminDetails(admin) {
    setSelectedAdmin(admin);
  }

  function hideAdminDetails() {
    setSelectedAdmin(null);
  }

  function showPasswordResetDialog(admin) {
    setPasswordResetDialog({ show: true, adminId: admin._id, adminName: admin.name });
    setNewPassword("");
  }

  function hidePasswordResetDialog() {
    setPasswordResetDialog({ show: false, adminId: null, adminName: "" });
    setNewPassword("");
  }

  async function handleResetPassword() {
    if (!newPassword || newPassword.length < 6) {
      showNotification("Password must be at least 6 characters long", "error");
      return;
    }

    try {
      setActionLoading(true);
      const response = await resetAdminPassword(passwordResetDialog.adminId, newPassword);
      hidePasswordResetDialog();
      showNotification(`Password reset successfully for ${response.adminName || 'admin'}!`, "success");
      loadAdmins();
    } catch (err) {
      console.error("Failed to reset password", err);
      const errorMsg = err.response?.data?.error || "Failed to reset password. Please try again.";
      showNotification(errorMsg, "error");
    } finally {
      setActionLoading(false);
    }
  }

  function showConfirmDialog(message, onConfirm, type = "info") {
    setConfirmDialog({ show: true, message, onConfirm, type });
  }

  function hideConfirmDialog() {
    setConfirmDialog({ show: false, message: "", onConfirm: null, type: "info" });
  }

  async function loadAdmins() {
    try {
      setLoading(true);
      const data = await getAdmins();
      setAdmins(data);
    } catch (err) {
      console.error("Failed to load admins", err);
    } finally {
      setLoading(false);
    }
  }

  async function toggleStatus(admin) {
    if (!isOwner) {
      showNotification("Only OWNER can manage admin users", "error");
      return;
    }

    if (admin.role === ROLES.OWNER) {
      showNotification("Cannot disable OWNER account", "error");
      return;
    }

    const action = admin.isActive ? "disable" : "enable";
    
    showConfirmDialog(
      `Are you sure you want to ${action} admin "${admin.name}" (${admin.email})?`,
      async () => {
        try {
          setActionLoading(true);
          await updateAdminStatus(admin._id, !admin.isActive);
          loadAdmins();
          showNotification(`Admin ${action}d successfully!`, "success");
        } catch (err) {
          console.error("Failed to update admin status", err);
          const errorMsg = err.response?.data?.error || "Failed to update admin status. Please try again.";
          showNotification(errorMsg, "error");
        } finally {
          setActionLoading(false);
        }
      },
      action === "disable" ? "warning" : "success"
    );
  }

  async function handleDeleteAdmin(admin) {
    if (!isOwner) {
      showNotification("Only OWNER can delete admin users", "error");
      return;
    }

    if (admin.role === ROLES.OWNER) {
      showNotification("Cannot delete OWNER account", "error");
      return;
    }

    showConfirmDialog(
      `⚠️ PERMANENTLY DELETE admin "${admin.name}" (${admin.email})?\n\nThis action cannot be undone!`,
      async () => {
        try {
          setActionLoading(true);
          await deleteAdmin(admin._id);
          loadAdmins();
          showNotification("Admin deleted successfully!", "success");
        } catch (err) {
          console.error("Failed to delete admin", err);
          const errorMsg = err.response?.data?.error || "Failed to delete admin. Please try again.";
          showNotification(errorMsg, "error");
        } finally {
          setActionLoading(false);
        }
      },
      "danger"
    );
  }

  useEffect(() => {
    loadAdmins();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="page-container">
      <h2 style={{ marginBottom: 24 }}>Admin Users</h2>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table className="table" style={{ marginBottom: 0 }}>
            <thead>
              <tr style={{ background: "rgba(59, 130, 246, 0.05)" }}>
                <th style={{ fontSize: 15, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", padding: "16px 20px" }}>Name</th>
                <th style={{ fontSize: 15, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", padding: "16px 20px" }}>Email</th>
                <th style={{ fontSize: 15, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", padding: "16px 20px" }}>Role</th>
                <th style={{ fontSize: 15, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", padding: "16px 20px" }}>Sites</th>
                <th style={{ fontSize: 15, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", padding: "16px 20px" }}>Status</th>
                <th style={{ fontSize: 15, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", padding: "16px 20px", textAlign: "right" }}>Action</th>
              </tr>
            </thead>

            <tbody>
              {admins.map((admin) => (
                <tr 
                  key={admin._id}
                  style={{ 
                    transition: "all 0.2s ease",
                    cursor: "pointer"
                  }}
                  onClick={() => showAdminDetails(admin)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(59, 130, 246, 0.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <td style={{ padding: "18px 20px", fontSize: 16, fontWeight: 600 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: admin.isActive 
                          ? "linear-gradient(135deg, #34d399, #10b981)" 
                          : "linear-gradient(135deg, #f87171, #ef4444)",
                        boxShadow: admin.isActive 
                          ? "0 0 10px rgba(52, 211, 153, 0.5)" 
                          : "0 0 10px rgba(248, 113, 113, 0.5)"
                      }}></div>
                      {admin.name}
                    </div>
                  </td>
                  <td style={{ padding: "18px 20px", fontSize: 15, color: "#94a3b8" }}>{admin.email}</td>
                  <td style={{ padding: "18px 20px" }}>
                    <span style={{
                      padding: "6px 14px",
                      borderRadius: 6,
                      fontSize: 13,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      background: admin.role === ROLES.OWNER 
                        ? "linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(245, 158, 11, 0.15))"
                        : admin.role === ROLES.SITE_ADMIN
                        ? "linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.15))"
                        : "linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(124, 58, 237, 0.15))",
                      color: admin.role === ROLES.OWNER 
                        ? "#fbbf24"
                        : admin.role === ROLES.SITE_ADMIN
                        ? "#60a5fa"
                        : "#a78bfa",
                      border: `1px solid ${admin.role === ROLES.OWNER 
                        ? "rgba(251, 191, 36, 0.4)"
                        : admin.role === ROLES.SITE_ADMIN
                        ? "rgba(59, 130, 246, 0.4)"
                        : "rgba(139, 92, 246, 0.4)"}`
                    }}>
                      {admin.role}
                    </span>
                  </td>

                  <td style={{ padding: "18px 20px", fontSize: 14 }}>
                    <span style={{
                      padding: "4px 10px",
                      background: "rgba(100, 116, 139, 0.15)",
                      borderRadius: 4,
                      fontSize: 13,
                      color: "#94a3b8",
                      border: "1px solid rgba(100, 116, 139, 0.2)"
                    }}>
                      {admin.allowedSites?.length
                        ? admin.allowedSites.join(", ")
                        : "ALL"}
                    </span>
                  </td>

                  <td style={{ padding: "18px 20px" }}>
                    {admin.isActive ? (
                      <span style={{
                        background: "linear-gradient(135deg, rgba(52, 211, 153, 0.2), rgba(16, 185, 129, 0.15))",
                        color: "#34d399",
                        border: "1px solid rgba(52, 211, 153, 0.4)",
                        padding: "6px 12px",
                        borderRadius: 6,
                        fontSize: 13,
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px"
                      }}>✓ Active</span>
                    ) : (
                      <span style={{
                        background: "linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.15))",
                        color: "#fca5a5",
                        border: "1px solid rgba(239, 68, 68, 0.4)",
                        padding: "6px 12px",
                        borderRadius: 6,
                        fontSize: 13,
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px"
                      }}>✕ Disabled</span>
                    )}
                  </td>

                  <td style={{ padding: "18px 20px", textAlign: "right" }}>
                    {admin.role !== ROLES.OWNER && isOwner ? (
                      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleStatus(admin);
                          }}
                          disabled={actionLoading}
                          className="btn btn-outline"
                          style={{
                            fontSize: 14,
                            padding: "8px 18px",
                            fontWeight: 600,
                            cursor: actionLoading ? "not-allowed" : "pointer",
                            opacity: actionLoading ? 0.6 : 1,
                            transition: "all 0.2s ease"
                          }}
                          onMouseEnter={(e) => {
                            if (!actionLoading) {
                              e.currentTarget.style.transform = "scale(1.05) translateY(-1px)";
                              if (admin.isActive) {
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
                            if (!actionLoading) {
                              e.currentTarget.style.transform = "scale(1) translateY(0)";
                              e.currentTarget.style.background = "transparent";
                              e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.4)";
                              e.currentTarget.style.color = "#60a5fa";
                              e.currentTarget.style.boxShadow = "none";
                            }
                          }}
                        >
                          {admin.isActive ? "Disable" : "Enable"}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAdmin(admin);
                          }}
                          disabled={actionLoading}
                          className="btn btn-outline"
                          style={{
                            fontSize: 14,
                            padding: "8px 18px",
                            fontWeight: 600,
                            borderColor: "rgba(239, 68, 68, 0.4)",
                            color: "#f87171",
                            cursor: actionLoading ? "not-allowed" : "pointer",
                            opacity: actionLoading ? 0.6 : 1,
                            transition: "all 0.2s ease"
                          }}
                          onMouseEnter={(e) => {
                            if (!actionLoading) {
                              e.currentTarget.style.transform = "scale(1.05) translateY(-1px)";
                              e.currentTarget.style.background = "rgba(239, 68, 68, 0.15)";
                              e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.7)";
                              e.currentTarget.style.color = "#fca5a5";
                              e.currentTarget.style.boxShadow = "0 6px 20px rgba(239, 68, 68, 0.4)";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!actionLoading) {
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
                    ) : admin.role === ROLES.OWNER ? (
                      <span style={{ fontSize: 13, color: "#64748b", fontStyle: "italic" }}>—</span>
                    ) : (
                      <span style={{ 
                        fontSize: 13, 
                        color: "#64748b",
                        padding: "6px 12px",
                        background: "rgba(100, 116, 139, 0.1)",
                        borderRadius: 4,
                        border: "1px solid rgba(100, 116, 139, 0.2)"
                      }}>🔒 Owner Only</span>
                    )}
                  </td>
                </tr>
              ))}

              {admins.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "32px", fontSize: 16, color: "#64748b" }}>
                    No admins found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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

      {/* ADMIN DETAILS MODAL */}
      {selectedAdmin && (
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
            animation: "fadeIn 0.2s ease",
            padding: "20px"
          }}
          onClick={hideAdminDetails}
        >
          <div 
            style={{
              background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
              border: "2px solid rgba(59, 130, 246, 0.3)",
              borderRadius: 16,
              padding: 0,
              maxWidth: 800,
              width: "100%",
              maxHeight: "90vh",
              overflow: "auto",
              boxShadow: "0 25px 50px rgba(0, 0, 0, 0.5)",
              animation: "slideUp 0.3s ease"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{
              padding: "24px 32px",
              borderBottom: "1px solid rgba(226, 232, 240, 0.08)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "rgba(59, 130, 246, 0.05)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: selectedAdmin.isActive 
                    ? "linear-gradient(135deg, #34d399, #10b981)" 
                    : "linear-gradient(135deg, #f87171, #ef4444)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  fontWeight: 700,
                  color: "white",
                  boxShadow: selectedAdmin.isActive 
                    ? "0 0 20px rgba(52, 211, 153, 0.5)" 
                    : "0 0 20px rgba(248, 113, 113, 0.5)"
                }}>
                  {selectedAdmin.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>{selectedAdmin.name}</h2>
                  <span style={{
                    fontSize: 14,
                    color: "#94a3b8",
                    marginTop: 4,
                    display: "block"
                  }}>
                    Admin Details
                  </span>
                </div>
              </div>
              <button
                onClick={hideAdminDetails}
                style={{
                  background: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  borderRadius: 8,
                  width: 36,
                  height: 36,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "#f87171",
                  fontSize: 20,
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(239, 68, 68, 0.2)";
                  e.currentTarget.style.transform = "scale(1.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div style={{ padding: "32px" }}>
              {/* Basic Information */}
              <div style={{ marginBottom: 32 }}>
                <h3 style={{ 
                  fontSize: 16, 
                  fontWeight: 700, 
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  marginBottom: 16,
                  display: "flex",
                  alignItems: "center",
                  gap: 8
                }}>
                  <span style={{ fontSize: 20 }}>👤</span> Basic Information
                </h3>
                <div style={{ 
                  display: "grid", 
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: 16
                }}>
                  <div style={{
                    background: "rgba(15, 23, 42, 0.6)",
                    padding: 16,
                    borderRadius: 10,
                    border: "1px solid rgba(226, 232, 240, 0.08)"
                  }}>
                    <div style={{ fontSize: 13, color: "#64748b", marginBottom: 6 }}>Full Name</div>
                    <div style={{ fontSize: 16, fontWeight: 600 }}>{selectedAdmin.name}</div>
                  </div>
                  <div style={{
                    background: "rgba(15, 23, 42, 0.6)",
                    padding: 16,
                    borderRadius: 10,
                    border: "1px solid rgba(226, 232, 240, 0.08)"
                  }}>
                    <div style={{ fontSize: 13, color: "#64748b", marginBottom: 6 }}>Email Address</div>
                    <div style={{ fontSize: 16, fontWeight: 600, wordBreak: "break-all" }}>{selectedAdmin.email}</div>
                  </div>
                  <div style={{
                    background: "rgba(15, 23, 42, 0.6)",
                    padding: 16,
                    borderRadius: 10,
                    border: "1px solid rgba(226, 232, 240, 0.08)"
                  }}>
                    <div style={{ fontSize: 13, color: "#64748b", marginBottom: 6 }}>Admin ID</div>
                    <div style={{ 
                      fontSize: 14, 
                      fontWeight: 600,
                      fontFamily: "monospace",
                      color: "#60a5fa"
                    }}>{selectedAdmin._id}</div>
                  </div>
                </div>
              </div>

              {/* Role & Status */}
              <div style={{ marginBottom: 32 }}>
                <h3 style={{ 
                  fontSize: 16, 
                  fontWeight: 700, 
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  marginBottom: 16,
                  display: "flex",
                  alignItems: "center",
                  gap: 8
                }}>
                  <span style={{ fontSize: 20 }}>🎭</span> Role & Status
                </h3>
                <div style={{ 
                  display: "grid", 
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: 16
                }}>
                  <div style={{
                    background: "rgba(15, 23, 42, 0.6)",
                    padding: 16,
                    borderRadius: 10,
                    border: "1px solid rgba(226, 232, 240, 0.08)"
                  }}>
                    <div style={{ fontSize: 13, color: "#64748b", marginBottom: 8 }}>Role</div>
                    <span style={{
                      padding: "8px 16px",
                      borderRadius: 8,
                      fontSize: 15,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      display: "inline-block",
                      background: selectedAdmin.role === ROLES.OWNER 
                        ? "linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(245, 158, 11, 0.15))"
                        : selectedAdmin.role === ROLES.SITE_ADMIN
                        ? "linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.15))"
                        : "linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(124, 58, 237, 0.15))",
                      color: selectedAdmin.role === ROLES.OWNER 
                        ? "#fbbf24"
                        : selectedAdmin.role === ROLES.SITE_ADMIN
                        ? "#60a5fa"
                        : "#a78bfa",
                      border: `1px solid ${selectedAdmin.role === ROLES.OWNER 
                        ? "rgba(251, 191, 36, 0.4)"
                        : selectedAdmin.role === ROLES.SITE_ADMIN
                        ? "rgba(59, 130, 246, 0.4)"
                        : "rgba(139, 92, 246, 0.4)"}`
                    }}>
                      {selectedAdmin.role}
                    </span>
                  </div>
                  <div style={{
                    background: "rgba(15, 23, 42, 0.6)",
                    padding: 16,
                    borderRadius: 10,
                    border: "1px solid rgba(226, 232, 240, 0.08)"
                  }}>
                    <div style={{ fontSize: 13, color: "#64748b", marginBottom: 8 }}>Account Status</div>
                    <span style={{
                      padding: "8px 16px",
                      borderRadius: 8,
                      fontSize: 15,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      display: "inline-block",
                      background: selectedAdmin.isActive
                        ? "linear-gradient(135deg, rgba(52, 211, 153, 0.2), rgba(16, 185, 129, 0.15))"
                        : "linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.15))",
                      color: selectedAdmin.isActive ? "#34d399" : "#fca5a5",
                      border: `1px solid ${selectedAdmin.isActive ? "rgba(52, 211, 153, 0.4)" : "rgba(239, 68, 68, 0.4)"}`
                    }}>
                      {selectedAdmin.isActive ? "✓ Active" : "✕ Disabled"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Sites & Sub-Sites Access */}
              <div style={{ marginBottom: 32 }}>
                <h3 style={{ 
                  fontSize: 16, 
                  fontWeight: 700, 
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  marginBottom: 16,
                  display: "flex",
                  alignItems: "center",
                  gap: 8
                }}>
                  <span style={{ fontSize: 20 }}>🏭</span> Sites & Sub-Sites Access
                </h3>
                <div style={{ 
                  display: "grid", 
                  gap: 16
                }}>
                  {/* Allowed Sites */}
                  <div style={{
                    background: "rgba(15, 23, 42, 0.6)",
                    padding: 20,
                    borderRadius: 10,
                    border: "1px solid rgba(226, 232, 240, 0.08)"
                  }}>
                    <div style={{ 
                      fontSize: 14, 
                      color: "#94a3b8", 
                      marginBottom: 12,
                      fontWeight: 600
                    }}>
                      📍 Allowed Sites
                    </div>
                    {selectedAdmin.allowedSites?.length > 0 ? (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {selectedAdmin.allowedSites.map((site, idx) => (
                          <span key={idx} style={{
                            padding: "6px 14px",
                            background: "linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(37, 99, 235, 0.1))",
                            color: "#60a5fa",
                            borderRadius: 6,
                            fontSize: 14,
                            fontWeight: 600,
                            border: "1px solid rgba(59, 130, 246, 0.3)"
                          }}>
                            {site}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div style={{
                        padding: "12px 16px",
                        background: "rgba(251, 191, 36, 0.1)",
                        borderRadius: 8,
                        border: "1px solid rgba(251, 191, 36, 0.3)",
                        color: "#fbbf24",
                        fontSize: 14,
                        fontWeight: 600,
                        display: "inline-block"
                      }}>
                        🌐 ALL SITES
                      </div>
                    )}
                  </div>

                  {/* Allowed Sub-Sites */}
                  <div style={{
                    background: "rgba(15, 23, 42, 0.6)",
                    padding: 20,
                    borderRadius: 10,
                    border: "1px solid rgba(226, 232, 240, 0.08)"
                  }}>
                    <div style={{ 
                      fontSize: 14, 
                      color: "#94a3b8", 
                      marginBottom: 12,
                      fontWeight: 600
                    }}>
                      🏗 Allowed Sub-Sites
                    </div>
                    {selectedAdmin.allowedSubSites?.length > 0 ? (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {selectedAdmin.allowedSubSites.map((subSite, idx) => (
                          <span key={idx} style={{
                            padding: "6px 14px",
                            background: "linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(124, 58, 237, 0.1))",
                            color: "#a78bfa",
                            borderRadius: 6,
                            fontSize: 14,
                            fontWeight: 600,
                            border: "1px solid rgba(139, 92, 246, 0.3)"
                          }}>
                            {subSite}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div style={{
                        padding: "12px 16px",
                        background: "rgba(100, 116, 139, 0.1)",
                        borderRadius: 8,
                        border: "1px solid rgba(100, 116, 139, 0.3)",
                        color: "#94a3b8",
                        fontSize: 14,
                        fontWeight: 600,
                        display: "inline-block"
                      }}>
                        {selectedAdmin.allowedSites?.length > 0 
                          ? "🌐 ALL SUB-SITES (in allowed sites)" 
                          : "🌐 ALL SUB-SITES"}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Account Timestamps */}
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ 
                  fontSize: 16, 
                  fontWeight: 700, 
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  marginBottom: 16,
                  display: "flex",
                  alignItems: "center",
                  gap: 8
                }}>
                  <span style={{ fontSize: 20 }}>📅</span> Account Information
                </h3>
                <div style={{ 
                  display: "grid", 
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: 16
                }}>
                  {selectedAdmin.createdAt && (
                    <div style={{
                      background: "rgba(15, 23, 42, 0.6)",
                      padding: 16,
                      borderRadius: 10,
                      border: "1px solid rgba(226, 232, 240, 0.08)"
                    }}>
                      <div style={{ fontSize: 13, color: "#64748b", marginBottom: 6 }}>Created At</div>
                      <div style={{ fontSize: 15, fontWeight: 600 }}>
                        {new Date(selectedAdmin.createdAt).toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  )}
                  {selectedAdmin.updatedAt && (
                    <div style={{
                      background: "rgba(15, 23, 42, 0.6)",
                      padding: 16,
                      borderRadius: 10,
                      border: "1px solid rgba(226, 232, 240, 0.08)"
                    }}>
                      <div style={{ fontSize: 13, color: "#64748b", marginBottom: 6 }}>Last Updated</div>
                      <div style={{ fontSize: 15, fontWeight: 600 }}>
                        {new Date(selectedAdmin.updatedAt).toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Security Notice */}
              <div style={{
                background: "rgba(59, 130, 246, 0.1)",
                border: "1px solid rgba(59, 130, 246, 0.3)",
                borderRadius: 10,
                padding: 16,
                display: "flex",
                alignItems: "start",
                gap: 12
              }}>
                <span style={{ fontSize: 24 }}>🔒</span>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#60a5fa", marginBottom: 4 }}>
                    Security Notice
                  </div>
                  <div style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.6 }}>
                    Password is securely encrypted and cannot be viewed. For security reasons, passwords can only be reset through the admin management system.
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            {selectedAdmin.role !== ROLES.OWNER && isOwner && (
              <div style={{
                padding: "20px 32px",
                borderTop: "1px solid rgba(226, 232, 240, 0.08)",
                background: "rgba(15, 23, 42, 0.5)",
                display: "flex",
                gap: 12,
                justifyContent: "flex-end"
              }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    hideAdminDetails();
                    showPasswordResetDialog(selectedAdmin);
                  }}
                  disabled={actionLoading}
                  className="btn btn-outline"
                  style={{
                    fontSize: 15,
                    padding: "12px 24px",
                    fontWeight: 600,
                    borderColor: "rgba(251, 191, 36, 0.4)",
                    color: "#fbbf24",
                    cursor: actionLoading ? "not-allowed" : "pointer",
                    opacity: actionLoading ? 0.6 : 1,
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={(e) => {
                    if (!actionLoading) {
                      e.currentTarget.style.transform = "translateY(-3px) scale(1.02)";
                      e.currentTarget.style.background = "rgba(251, 191, 36, 0.2)";
                      e.currentTarget.style.borderColor = "rgba(251, 191, 36, 0.8)";
                      e.currentTarget.style.color = "#fcd34d";
                      e.currentTarget.style.boxShadow = "0 12px 32px rgba(251, 191, 36, 0.4), 0 0 20px rgba(251, 191, 36, 0.2)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!actionLoading) {
                      e.currentTarget.style.transform = "translateY(0) scale(1)";
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.borderColor = "rgba(251, 191, 36, 0.4)";
                      e.currentTarget.style.color = "#fbbf24";
                      e.currentTarget.style.boxShadow = "none";
                    }
                  }}
                >
                  🔑 Reset Password
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    hideAdminDetails();
                    toggleStatus(selectedAdmin);
                  }}
                  disabled={actionLoading}
                  className="btn btn-outline"
                  style={{
                    fontSize: 15,
                    padding: "12px 24px",
                    fontWeight: 600,
                    cursor: actionLoading ? "not-allowed" : "pointer",
                    opacity: actionLoading ? 0.6 : 1,
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={(e) => {
                    if (!actionLoading) {
                      e.currentTarget.style.transform = "translateY(-3px) scale(1.02)";
                      if (selectedAdmin.isActive) {
                        e.currentTarget.style.background = "rgba(239, 68, 68, 0.2)";
                        e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.8)";
                        e.currentTarget.style.color = "#fca5a5";
                        e.currentTarget.style.boxShadow = "0 12px 32px rgba(239, 68, 68, 0.4), 0 0 20px rgba(239, 68, 68, 0.2)";
                      } else {
                        e.currentTarget.style.background = "rgba(59, 130, 246, 0.2)";
                        e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.8)";
                        e.currentTarget.style.color = "#60a5fa";
                        e.currentTarget.style.boxShadow = "0 12px 32px rgba(59, 130, 246, 0.4), 0 0 20px rgba(59, 130, 246, 0.2)";
                      }
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!actionLoading) {
                      e.currentTarget.style.transform = "translateY(0) scale(1)";
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.4)";
                      e.currentTarget.style.color = "#60a5fa";
                      e.currentTarget.style.boxShadow = "none";
                    }
                  }}
                >
                  {selectedAdmin.isActive ? "🔴 Disable Account" : "✅ Enable Account"}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    hideAdminDetails();
                    handleDeleteAdmin(selectedAdmin);
                  }}
                  disabled={actionLoading}
                  className="btn btn-outline"
                  style={{
                    fontSize: 15,
                    padding: "12px 24px",
                    fontWeight: 600,
                    borderColor: "rgba(239, 68, 68, 0.4)",
                    color: "#f87171",
                    cursor: actionLoading ? "not-allowed" : "pointer",
                    opacity: actionLoading ? 0.6 : 1,
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={(e) => {
                    if (!actionLoading) {
                      e.currentTarget.style.transform = "translateY(-3px) scale(1.02)";
                      e.currentTarget.style.background = "rgba(239, 68, 68, 0.2)";
                      e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.9)";
                      e.currentTarget.style.color = "#fca5a5";
                      e.currentTarget.style.boxShadow = "0 12px 32px rgba(239, 68, 68, 0.5), 0 0 20px rgba(239, 68, 68, 0.3)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!actionLoading) {
                      e.currentTarget.style.transform = "translateY(0) scale(1)";
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.4)";
                      e.currentTarget.style.color = "#f87171";
                      e.currentTarget.style.boxShadow = "none";
                    }
                  }}
                >
                  🗑️ Delete Account
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PASSWORD RESET DIALOG */}
      {passwordResetDialog.show && (
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
            zIndex: 10000,
            animation: "fadeIn 0.2s ease"
          }}
          onClick={hidePasswordResetDialog}
        >
          <div 
            style={{
              background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
              border: "2px solid rgba(251, 191, 36, 0.5)",
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
              🔑
            </div>

            {/* Title */}
            <h3 style={{
              margin: 0,
              marginBottom: 8,
              fontSize: 22,
              fontWeight: 700,
              textAlign: "center"
            }}>
              Reset Password
            </h3>
            
            <div style={{ 
              fontSize: 15, 
              color: "#94a3b8",
              marginBottom: 24,
              textAlign: "center"
            }}>
              Enter new password for <strong style={{ color: "#60a5fa" }}>{passwordResetDialog.adminName}</strong>
            </div>

            {/* Password Input */}
            <div style={{ marginBottom: 24 }}>
              <label style={{
                display: "block",
                fontSize: 14,
                fontWeight: 600,
                color: "#94a3b8",
                marginBottom: 8
              }}>
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min 6 characters)"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  fontSize: 15,
                  background: "rgba(15, 23, 42, 0.6)",
                  border: "1px solid rgba(226, 232, 240, 0.1)",
                  borderRadius: 8,
                  color: "#e2e8f0",
                  outline: "none",
                  transition: "all 0.2s ease"
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(251, 191, 36, 0.5)";
                  e.target.style.boxShadow = "0 0 0 3px rgba(251, 191, 36, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(226, 232, 240, 0.1)";
                  e.target.style.boxShadow = "none";
                }}
              />
              <div style={{
                fontSize: 13,
                color: "#64748b",
                marginTop: 6
              }}>
                ℹ️ Password must be at least 6 characters long
              </div>
            </div>

            {/* Buttons */}
            <div style={{ 
              display: "flex", 
              gap: 12, 
              justifyContent: "center" 
            }}>
              <button
                onClick={hidePasswordResetDialog}
                disabled={actionLoading}
                className="btn btn-outline"
                style={{ 
                  fontSize: 15,
                  padding: "12px 32px",
                  fontWeight: 600,
                  minWidth: 120,
                  transition: "all 0.2s ease",
                  cursor: actionLoading ? "not-allowed" : "pointer",
                  opacity: actionLoading ? 0.6 : 1,
                  background: "transparent",
                  border: "2px solid rgba(148, 163, 184, 0.4)",
                  color: "#cbd5e1"
                }}
                onMouseEnter={(e) => {
                  if (!actionLoading) {
                    e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
                    e.currentTarget.style.background = "rgba(148, 163, 184, 0.15)";
                    e.currentTarget.style.borderColor = "rgba(148, 163, 184, 0.7)";
                    e.currentTarget.style.color = "#e2e8f0";
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(148, 163, 184, 0.3)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!actionLoading) {
                    e.currentTarget.style.transform = "translateY(0) scale(1)";
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.borderColor = "rgba(148, 163, 184, 0.4)";
                    e.currentTarget.style.color = "#cbd5e1";
                    e.currentTarget.style.boxShadow = "none";
                  }
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleResetPassword}
                disabled={actionLoading || !newPassword}
                className="btn"
                style={{ 
                  fontSize: 15,
                  padding: "12px 32px",
                  fontWeight: 600,
                  minWidth: 120,
                  background: "linear-gradient(135deg, #f59e0b, #d97706)",
                  border: "2px solid rgba(245, 158, 11, 0.6)",
                  color: "white",
                  transition: "all 0.2s ease",
                  cursor: (actionLoading || !newPassword) ? "not-allowed" : "pointer",
                  opacity: (actionLoading || !newPassword) ? 0.6 : 1
                }}
                onMouseEnter={(e) => {
                  if (!actionLoading && newPassword) {
                    e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
                    e.currentTarget.style.background = "linear-gradient(135deg, #fbbf24, #f59e0b)";
                    e.currentTarget.style.borderColor = "rgba(251, 191, 36, 0.9)";
                    e.currentTarget.style.boxShadow = "0 10px 30px rgba(245, 158, 11, 0.5), 0 0 20px rgba(251, 191, 36, 0.3)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!actionLoading && newPassword) {
                    e.currentTarget.style.transform = "translateY(0) scale(1)";
                    e.currentTarget.style.background = "linear-gradient(135deg, #f59e0b, #d97706)";
                    e.currentTarget.style.borderColor = "rgba(245, 158, 11, 0.6)";
                    e.currentTarget.style.boxShadow = "none";
                  }
                }}
              >
                {actionLoading ? "Resetting..." : "Reset Password"}
              </button>
            </div>
          </div>
        </div>
      )}

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
    </div>
  );
}