import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useTicketReports from "../../hooks/useTicketReports";
import { formatDateTime } from "../../utils/formatDate";
import { updateReportStatus, deleteReport, deleteTicketFromReport } from "../../api/ticketReports.api";
import ConfirmModal from "../../components/common/ConfirmModal";

export default function TicketReports() {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    status: "pending"
  });

  const { data, meta, loading, refetch } = useTicketReports(filters);
  const [actionBusy, setActionBusy] = useState(false);
  const [deleteReportModal, setDeleteReportModal] = useState(null);
  const [deleteTicketModal, setDeleteTicketModal] = useState(null);

  const handleMarkReviewed = async (reportId) => {
    try {
      setActionBusy(true);
      await updateReportStatus(reportId, "reviewed");
      refetch();
      window.showToast?.("Report marked as reviewed", "success");
    } catch (err) {
      window.showToast?.(err?.response?.data?.error || "Failed to mark as reviewed", "error");
    } finally {
      setActionBusy(false);
    }
  };

  const handleDeleteReport = async () => {
    if (!deleteReportModal) return;
    try {
      setActionBusy(true);
      await deleteReport(deleteReportModal.reportId);
      refetch();
      window.showToast?.("Report deleted successfully", "success");
      setDeleteReportModal(null);
    } catch (err) {
      window.showToast?.(err?.response?.data?.error || "Failed to delete report", "error");
    } finally {
      setActionBusy(false);
    }
  };

  const handleDeleteTicket = async () => {
    if (!deleteTicketModal) return;
    try {
      setActionBusy(true);
      await deleteTicketFromReport(deleteTicketModal.reportId);
      refetch();
      window.showToast?.("Ticket deleted successfully", "success");
      setDeleteTicketModal(null);
    } catch (err) {
      window.showToast?.(err?.response?.data?.error || "Failed to delete ticket", "error");
    } finally {
      setActionBusy(false);
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: "1400px", margin: "0 auto" }}>
      {/* Header Section */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "28px",
        padding: "0 4px"
      }}>
        <div>
          <h1 style={{
            margin: 0,
            fontSize: "1.75rem",
            fontWeight: 700,
            background: "linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            display: "inline-flex",
            alignItems: "center",
            gap: "12px"
          }}>
            <span style={{ fontSize: "1.5rem" }}>🚩</span> Reported Tickets
          </h1>
          <p style={{
            margin: "6px 0 0 0",
            fontSize: "0.9rem",
            color: "rgba(255, 255, 255, 0.5)"
          }}>
            Review and manage reported tickets from site administrators
          </p>
        </div>
        {loading && (
          <div style={{
            padding: "8px 16px",
            borderRadius: "8px",
            background: "rgba(59, 130, 246, 0.1)",
            border: "1px solid rgba(59, 130, 246, 0.2)",
            fontSize: "0.85rem",
            color: "#93c5fd",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <div style={{
              width: "12px",
              height: "12px",
              border: "2px solid rgba(59, 130, 246, 0.3)",
              borderTopColor: "#60a5fa",
              borderRadius: "50%",
              animation: "spin 1s linear infinite"
            }} />
            Loading…
          </div>
        )}
      </div>

      {/* Filter Bar */}
      <div style={{
        background: "linear-gradient(145deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%)",
        backdropFilter: "blur(10px)",
        borderRadius: "12px",
        padding: "18px 20px",
        marginBottom: "24px",
        border: "1px solid rgba(59, 130, 246, 0.15)",
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <label style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "0.9rem", fontWeight: 500 }}>
              Status:
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
              style={{
                padding: "8px 14px",
                borderRadius: "8px",
                border: "1px solid rgba(59, 130, 246, 0.25)",
                background: "rgba(15, 23, 42, 0.7)",
                color: "#fff",
                fontSize: "0.9rem",
                cursor: "pointer",
                outline: "none",
                fontWeight: 500
              }}
            >
              <option value="all">All Reports</option>
              <option value="pending">⏳ Pending</option>
              <option value="reviewed">✓ Reviewed</option>
            </select>
          </div>

          <div style={{
            marginLeft: "auto",
            padding: "6px 14px",
            borderRadius: "8px",
            background: "rgba(59, 130, 246, 0.1)",
            border: "1px solid rgba(59, 130, 246, 0.2)",
            color: "#93c5fd",
            fontSize: "0.85rem",
            fontWeight: 600
          }}>
            {meta.total} {meta.total === 1 ? "report" : "reports"}
          </div>
        </div>
      </div>

      {/* Reports List */}
      {data.length === 0 && !loading && (
        <div style={{
          background: "linear-gradient(145deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.6) 100%)",
          borderRadius: "12px",
          padding: "60px 32px",
          textAlign: "center",
          border: "1px solid rgba(59, 130, 246, 0.15)"
        }}>
          <div style={{ fontSize: "3rem", marginBottom: "16px", opacity: 0.5 }}>📭</div>
          <p style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "1.05rem", margin: 0 }}>
            No reports found
          </p>
          <p style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "0.9rem", margin: "8px 0 0 0" }}>
            All clear! No tickets have been reported yet.
          </p>
        </div>
      )}

      {data.map((report) => (
        <div
          key={report._id}
          style={{
            background: "linear-gradient(145deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.7) 100%)",
            backdropFilter: "blur(10px)",
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "16px",
            border: "1px solid rgba(59, 130, 246, 0.15)",
            boxShadow: "0 2px 12px rgba(0, 0, 0, 0.15)",
            transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 6px 20px rgba(59, 130, 246, 0.15)";
            e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 2px 12px rgba(0, 0, 0, 0.15)";
            e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.15)";
          }}
        >
          {/* Header Row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px", gap: "16px" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                <h3 
                  style={{ 
                    margin: 0,
                    fontSize: "1.1rem", 
                    fontWeight: 700, 
                    color: "#60a5fa",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    transition: "color 0.2s"
                  }}
                  onClick={() => navigate(`/tickets/${report.ticketId}`)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#93c5fd";
                    e.currentTarget.style.textDecoration = "underline";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "#60a5fa";
                    e.currentTarget.style.textDecoration = "none";
                  }}
                >
                  🎫 {report.ticketId}
                </h3>
                <span style={{
                  padding: "4px 10px",
                  borderRadius: "6px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  background: report.status === "pending" 
                    ? "rgba(251, 191, 36, 0.15)" 
                    : "rgba(59, 130, 246, 0.15)",
                  color: report.status === "pending"
                    ? "#fbbf24"
                    : "#60a5fa",
                  border: `1px solid ${report.status === "pending" ? "rgba(251, 191, 36, 0.3)" : "rgba(59, 130, 246, 0.3)"}`
                }}>
                  {report.status === "pending" ? "⏳ PENDING" : "✓ REVIEWED"}
                </span>
              </div>
              <p style={{ margin: "0 0 10px 0", fontSize: "0.9rem", color: "rgba(255, 255, 255, 0.75)", lineHeight: 1.5, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                {report.ticket?.message?.text || "No message"}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "0.8rem", color: "rgba(255, 255, 255, 0.45)" }}>
                <span>📍 {report.siteId}{report.subSiteId && ` / ${report.subSiteId}`}</span>
              </div>
            </div>
          </div>

          {/* Report Reason */}
          <div style={{
            background: "rgba(220, 38, 38, 0.08)",
            backdropFilter: "blur(5px)",
            borderRadius: "8px",
            padding: "12px 14px",
            marginBottom: "14px",
            border: "1px solid rgba(220, 38, 38, 0.2)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
              <span style={{ fontSize: "0.75rem", color: "rgba(248, 113, 113, 0.9)", fontWeight: 700, letterSpacing: "0.5px" }}>
                ⚠️ REPORT REASON
              </span>
            </div>
            <p style={{ margin: 0, color: "#f3f4f6", fontSize: "0.9rem", lineHeight: 1.5 }}>
              {report.reason}
            </p>
          </div>

          {/* Reporter Info - Compact Row */}
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            padding: "10px 12px",
            background: "rgba(15, 23, 42, 0.4)",
            borderRadius: "8px",
            marginBottom: "14px",
            fontSize: "0.85rem"
          }}>
            <div style={{ color: "rgba(255, 255, 255, 0.6)" }}>
              <span>👤 {report.reporterAdminId?.name || "Unknown"}</span>
              <span style={{ margin: "0 8px", color: "rgba(255, 255, 255, 0.3)" }}>•</span>
              <span style={{ color: "rgba(255, 255, 255, 0.45)" }}>
                {formatDateTime(report.createdAt)}
              </span>
            </div>
            <span style={{
              padding: "4px 10px",
              borderRadius: "6px",
              fontSize: "0.75rem",
              fontWeight: 600,
              background: "rgba(59, 130, 246, 0.12)",
              color: "#60a5fa",
              border: "1px solid rgba(59, 130, 246, 0.3)"
            }}>
              {report.reporterRole}
            </span>
          </div>

          {/* Action Buttons - Compact Design */}
          {report.status === "pending" && (
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {/* Mark Reviewed */}
              <button
                onClick={() => handleMarkReviewed(report._id)}
                disabled={actionBusy}
                style={{
                  flex: "1 1 auto",
                  minWidth: "140px",
                  padding: "9px 16px",
                  borderRadius: "7px",
                  border: "1px solid rgba(59, 130, 246, 0.4)",
                  background: "linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.15) 100%)",
                  color: "#60a5fa",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  cursor: actionBusy ? "not-allowed" : "pointer",
                  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  opacity: actionBusy ? 0.5 : 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px"
                }}
                onMouseEnter={(e) => {
                  if (!actionBusy) {
                    e.currentTarget.style.background = "linear-gradient(135deg, rgba(59, 130, 246, 0.25) 0%, rgba(37, 99, 235, 0.25) 100%)";
                    e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.6)";
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.2)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.15) 100%)";
                  e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.4)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <span>👁️</span> Mark Reviewed
              </button>

              {/* Delete Report */}
              <button
                onClick={() => setDeleteReportModal({ reportId: report._id, ticketId: report.ticketId })}
                disabled={actionBusy}
                style={{
                  flex: "1 1 auto",
                  minWidth: "140px",
                  padding: "9px 16px",
                  borderRadius: "7px",
                  border: "1px solid rgba(251, 191, 36, 0.4)",
                  background: "linear-gradient(135deg, rgba(251, 191, 36, 0.12) 0%, rgba(245, 158, 11, 0.12) 100%)",
                  color: "#fbbf24",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  cursor: actionBusy ? "not-allowed" : "pointer",
                  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  opacity: actionBusy ? 0.5 : 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px"
                }}
                onMouseEnter={(e) => {
                  if (!actionBusy) {
                    e.currentTarget.style.background = "linear-gradient(135deg, rgba(251, 191, 36, 0.22) 0%, rgba(245, 158, 11, 0.22) 100%)";
                    e.currentTarget.style.borderColor = "rgba(251, 191, 36, 0.6)";
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(251, 191, 36, 0.2)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "linear-gradient(135deg, rgba(251, 191, 36, 0.12) 0%, rgba(245, 158, 11, 0.12) 100%)";
                  e.currentTarget.style.borderColor = "rgba(251, 191, 36, 0.4)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <span>🗑️</span> Delete Report
              </button>

              {/* Delete Ticket */}
              <button
                onClick={() => setDeleteTicketModal({ reportId: report._id, ticketId: report.ticketId })}
                disabled={actionBusy}
                style={{
                  flex: "1 1 auto",
                  minWidth: "140px",
                  padding: "9px 16px",
                  borderRadius: "7px",
                  border: "1px solid rgba(239, 68, 68, 0.4)",
                  background: "linear-gradient(135deg, rgba(220, 38, 38, 0.12) 0%, rgba(153, 27, 27, 0.12) 100%)",
                  color: "#f87171",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  cursor: actionBusy ? "not-allowed" : "pointer",
                  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  opacity: actionBusy ? 0.5 : 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px"
                }}
                onMouseEnter={(e) => {
                  if (!actionBusy) {
                    e.currentTarget.style.background = "linear-gradient(135deg, rgba(220, 38, 38, 0.22) 0%, rgba(153, 27, 27, 0.22) 100%)";
                    e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.6)";
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(239, 68, 68, 0.2)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "linear-gradient(135deg, rgba(220, 38, 38, 0.12) 0%, rgba(153, 27, 27, 0.12) 100%)";
                  e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.4)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <span>❌</span> Delete Ticket
              </button>
            </div>
          )}
        </div>
      ))}

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "12px",
          marginTop: "32px",
          padding: "20px 0"
        }}>
          <button
            disabled={filters.page === 1}
            onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
            style={{
              padding: "8px 18px",
              borderRadius: "8px",
              border: "1px solid rgba(59, 130, 246, 0.25)",
              background: filters.page === 1 ? "rgba(51, 65, 85, 0.2)" : "rgba(59, 130, 246, 0.12)",
              color: filters.page === 1 ? "rgba(148, 163, 184, 0.5)" : "#60a5fa",
              fontSize: "0.9rem",
              fontWeight: 600,
              cursor: filters.page === 1 ? "not-allowed" : "pointer",
              opacity: filters.page === 1 ? 0.4 : 1,
              transition: "all 0.2s"
            }}
          >
            ← Previous
          </button>

          <div style={{
            padding: "8px 16px",
            borderRadius: "8px",
            background: "rgba(59, 130, 246, 0.1)",
            border: "1px solid rgba(59, 130, 246, 0.2)",
            color: "#93c5fd",
            fontSize: "0.9rem",
            fontWeight: 600
          }}>
            {meta.page} / {meta.totalPages}
          </div>

          <button
            disabled={filters.page === meta.totalPages}
            onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
            style={{
              padding: "8px 18px",
              borderRadius: "8px",
              border: "1px solid rgba(59, 130, 246, 0.25)",
              background: filters.page === meta.totalPages ? "rgba(51, 65, 85, 0.2)" : "rgba(59, 130, 246, 0.12)",
              color: filters.page === meta.totalPages ? "rgba(148, 163, 184, 0.5)" : "#60a5fa",
              fontSize: "0.9rem",
              fontWeight: 600,
              cursor: filters.page === meta.totalPages ? "not-allowed" : "pointer",
              opacity: filters.page === meta.totalPages ? 0.4 : 1,
              transition: "all 0.2s"
            }}
          >
            Next →
          </button>
        </div>
      )}

      {/* Delete Report Modal */}
      {deleteReportModal && (
        <ConfirmModal
          isOpen={true}
          title="Delete Report"
          message={`Are you sure you want to delete this report for ticket ${deleteReportModal.ticketId}? This will only remove the report, not the ticket itself.`}
          onConfirm={handleDeleteReport}
          onCancel={() => setDeleteReportModal(null)}
          confirmText="Delete Report"
          cancelText="Cancel"
          variant="danger"
        />
      )}

      {/* Delete Ticket Modal */}
      {deleteTicketModal && (
        <ConfirmModal
          isOpen={true}
          title="Delete Ticket"
          message={`⚠️ CRITICAL ACTION: Are you sure you want to permanently delete ticket ${deleteTicketModal.ticketId}? This will delete the ticket AND the report. This action cannot be undone.`}
          onConfirm={handleDeleteTicket}
          onCancel={() => setDeleteTicketModal(null)}
          confirmText="Delete Ticket"
          cancelText="Cancel"
          variant="danger"
        />
      )}
    </div>
  );
}
