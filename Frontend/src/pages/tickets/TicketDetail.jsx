import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { deleteTicket, reportTicket } from "../../api/tickets.api";
import Loader from "../../components/common/Loader";
import TicketStatusUpdater from "../../components/tickets/TicketStatusUpdater";
import AIAnalysisPanel from "../../components/tickets/AIAnalysisPanel";
import SLABadge from "../../components/tickets/SLABadge";
import StatusBadge from "../../components/tickets/StatusBadge";
import { formatDateTime } from "../../utils/formatDate";
import { useAuth } from "../../auth/useAuth";
import { isOwner } from "../../utils/roleUtils";
import ConfirmModal from "../../components/common/ConfirmModal";
import PromptModal from "../../components/common/PromptModal";

export default function TicketDetail() {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionBusy, setActionBusy] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [reportModal, setReportModal] = useState(false);

  async function fetchTicket() {
    try {
      setLoading(true);
      setError("");
      const res = await api.get(`/tickets/${ticketId}`);
      setTicket(res.data);
    } catch (err) {
      console.error("Failed to fetch ticket:", err);
      setError(err.response?.data?.error || "Failed to load ticket");
      setTicket(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTicket();
  }, [ticketId]);

  const handleDelete = () => {
    setDeleteModal(true);
  };

  const confirmDelete = async () => {
    setDeleteModal(false);
    try {
      setActionBusy(true);
      await deleteTicket(ticketId);
      window.showToast?.("Ticket deleted successfully", "success");
      navigate("/tickets");
    } catch (err) {
      window.showToast?.(err?.response?.data?.error || "Failed to delete ticket", "error");
    } finally {
      setActionBusy(false);
    }
  };

  const handleReport = () => {
    setReportModal(true);
  };

  const confirmReport = async (reason) => {
    setReportModal(false);
    if (!reason || !reason.trim()) return;
    try {
      setActionBusy(true);
      await reportTicket(ticketId, reason.trim());
      window.showToast?.("Ticket reported successfully", "success");
    } catch (err) {
      window.showToast?.(err?.response?.data?.error || "Failed to report ticket", "error");
    } finally {
      setActionBusy(false);
    }
  };

  if (loading) return (
    <div className="page-container">
      <Loader />
    </div>
  );

  if (error) return (
    <div className="page-container">
      <div className="alert alert-error">{error}</div>
      <button className="btn-outline" onClick={() => navigate("/tickets")} style={{ marginTop: 16 }}>
        ← Back to Tickets
      </button>
    </div>
  );

  if (!ticket) return (
    <div className="page-container">
      <div className="alert alert-error">Ticket not found</div>
      <button className="btn-outline" onClick={() => navigate("/tickets")} style={{ marginTop: 16 }}>
        ← Back to Tickets
      </button>
    </div>
  );

  return (
    <div className="page-container">
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: 32,
        padding: "24px",
        background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
        borderRadius: "16px",
        border: "1px solid rgba(59, 130, 246, 0.2)",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)"
      }}>
        <div style={{ flex: 1 }}>
          <button 
            className="btn-outline" 
            onClick={() => navigate("/tickets")} 
            style={{ 
              marginBottom: 16,
              padding: "10px 20px",
              fontSize: "14px",
              fontWeight: 600,
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateX(-4px)";
              e.currentTarget.style.background = "rgba(59, 130, 246, 0.1)";
              e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.6)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateX(0)";
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.4)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            ← Back
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
              boxShadow: "0 4px 12px rgba(59, 130, 246, 0.4)"
            }}>
              🎫
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: "28px", fontWeight: 700, color: "#fff" }}>
                Ticket {ticket.ticketId}
              </h2>
              <p style={{ margin: "4px 0 0 0", fontSize: "14px", color: "rgba(255, 255, 255, 0.6)" }}>
                Track and manage ticket status
              </p>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <StatusBadge status={ticket.status} />
          {isOwner(user.role) ? (
            <button
              style={{
                border: "1px solid rgba(248, 113, 113, 0.5)",
                background: "linear-gradient(135deg, rgba(220, 38, 38, 0.2) 0%, rgba(153, 27, 27, 0.2) 100%)",
                color: "#fca5a5",
                padding: "10px 24px",
                borderRadius: "999px",
                cursor: actionBusy ? "not-allowed" : "pointer",
                fontSize: "0.9rem",
                fontWeight: 600,
                letterSpacing: "0.025em",
                transition: "all 0.3s ease",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                opacity: actionBusy ? 0.5 : 1
              }}
              onClick={handleDelete}
              disabled={actionBusy}
              onMouseEnter={(e) => {
                if (!actionBusy) {
                  e.currentTarget.style.borderColor = "rgba(248, 113, 113, 0.8)";
                  e.currentTarget.style.background = "linear-gradient(135deg, rgba(220, 38, 38, 0.3) 0%, rgba(153, 27, 27, 0.3) 100%)";
                  e.currentTarget.style.color = "#fecdd3";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 4px 16px rgba(248, 113, 113, 0.3)";
                }
              }}
              onMouseLeave={(e) => {
                if (!actionBusy) {
                  e.currentTarget.style.borderColor = "rgba(248, 113, 113, 0.5)";
                  e.currentTarget.style.background = "linear-gradient(135deg, rgba(220, 38, 38, 0.2) 0%, rgba(153, 27, 27, 0.2) 100%)";
                  e.currentTarget.style.color = "#fca5a5";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.15)";
                }
              }}
            >
              🗑️ Delete
            </button>
          ) : (
            <button
              style={{
                border: "1px solid rgba(148, 163, 184, 0.3)",
                background: "linear-gradient(135deg, rgba(51, 65, 85, 0.3) 0%, rgba(30, 41, 59, 0.3) 100%)",
                color: "#cbd5e1",
                padding: "10px 24px",
                borderRadius: "999px",
                cursor: actionBusy ? "not-allowed" : "pointer",
                fontSize: "0.9rem",
                fontWeight: 600,
                letterSpacing: "0.025em",
                transition: "all 0.3s ease",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                opacity: actionBusy ? 0.5 : 1
              }}
              onClick={handleReport}
              disabled={actionBusy}
              onMouseEnter={(e) => {
                if (!actionBusy) {
                  e.currentTarget.style.borderColor = "rgba(148, 163, 184, 0.5)";
                  e.currentTarget.style.background = "linear-gradient(135deg, rgba(51, 65, 85, 0.5) 0%, rgba(30, 41, 59, 0.5) 100%)";
                  e.currentTarget.style.color = "#e2e8f0";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 4px 16px rgba(148, 163, 184, 0.2)";
                }
              }}
              onMouseLeave={(e) => {
                if (!actionBusy) {
                  e.currentTarget.style.borderColor = "rgba(148, 163, 184, 0.3)";
                  e.currentTarget.style.background = "linear-gradient(135deg, rgba(51, 65, 85, 0.3) 0%, rgba(30, 41, 59, 0.3) 100%)";
                  e.currentTarget.style.color = "#cbd5e1";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.15)";
                }
              }}
            >
              🚩 Report
            </button>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
        {/* Ticket Info Card */}
        <div 
          className="card premium-info-card"
          style={{
            transition: "all 0.3s ease",
            border: "1px solid rgba(59, 130, 246, 0.2)"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-4px)";
            e.currentTarget.style.boxShadow = "0 12px 32px rgba(59, 130, 246, 0.2)";
            e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 16px 40px rgba(0, 0, 0, 0.25)";
            e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.2)";
          }}
        >
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "12px", 
            marginBottom: 20,
            paddingBottom: 16,
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)"
          }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              boxShadow: "0 4px 8px rgba(59, 130, 246, 0.3)"
            }}>
              📋
            </div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#93c5fd" }}>Ticket Information</h3>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{
              padding: "12px",
              background: "rgba(59, 130, 246, 0.08)",
              borderRadius: "10px",
              border: "1px solid rgba(59, 130, 246, 0.15)",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(59, 130, 246, 0.12)";
              e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(59, 130, 246, 0.08)";
              e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.15)";
            }}
            >
              <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 6, fontWeight: 600, letterSpacing: "0.5px" }}>SITE</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#60a5fa" }}>🏭 {ticket.siteId}</div>
            </div>

            <div style={{
              padding: "12px",
              background: "rgba(139, 92, 246, 0.08)",
              borderRadius: "10px",
              border: "1px solid rgba(139, 92, 246, 0.15)",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(139, 92, 246, 0.12)";
              e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(139, 92, 246, 0.08)";
              e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.15)";
            }}
            >
              <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 6, fontWeight: 600, letterSpacing: "0.5px" }}>SUB-SITE</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#a78bfa" }}>🏗 {ticket.subSiteId || "-"}</div>
            </div>

            <div style={{
              padding: "12px",
              background: "rgba(34, 197, 94, 0.08)",
              borderRadius: "10px",
              border: "1px solid rgba(34, 197, 94, 0.15)",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(34, 197, 94, 0.12)";
              e.currentTarget.style.borderColor = "rgba(34, 197, 94, 0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(34, 197, 94, 0.08)";
              e.currentTarget.style.borderColor = "rgba(34, 197, 94, 0.15)";
            }}
            >
              <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 6, fontWeight: 600, letterSpacing: "0.5px" }}>CREATED AT</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#4ade80" }}>📅 {formatDateTime(ticket.createdAt)}</div>
            </div>

            <div style={{
              padding: "12px",
              background: "rgba(251, 191, 36, 0.08)",
              borderRadius: "10px",
              border: "1px solid rgba(251, 191, 36, 0.15)",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(251, 191, 36, 0.12)";
              e.currentTarget.style.borderColor = "rgba(251, 191, 36, 0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(251, 191, 36, 0.08)";
              e.currentTarget.style.borderColor = "rgba(251, 191, 36, 0.15)";
            }}
            >
              <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 6, fontWeight: 600, letterSpacing: "0.5px" }}>AGING</div>
              <SLABadge ticket={ticket} />
            </div>
          </div>
        </div>

        {/* Issue Card */}
        <div 
          className="card premium-issue-card"
          style={{
            transition: "all 0.3s ease",
            border: "1px solid rgba(139, 92, 246, 0.2)"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-4px)";
            e.currentTarget.style.boxShadow = "0 12px 32px rgba(139, 92, 246, 0.2)";
            e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 16px 40px rgba(0, 0, 0, 0.25)";
            e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.2)";
          }}
        >
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "12px", 
            marginBottom: 20,
            paddingBottom: 16,
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)"
          }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              boxShadow: "0 4px 8px rgba(139, 92, 246, 0.3)"
            }}>
              📝
            </div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#c4b5fd" }}>Issue Details</h3>
          </div>
          
          <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 8, fontWeight: 600, letterSpacing: "0.5px" }}>DESCRIPTION</div>
          <div style={{ 
            background: "linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(15, 23, 42, 0.6) 100%)", 
            padding: 16, 
            borderRadius: 12, 
            border: "1px solid rgba(139, 92, 246, 0.2)",
            lineHeight: 1.8,
            fontSize: 15,
            color: "#e2e8f0",
            minHeight: 100,
            boxShadow: "inset 0 2px 8px rgba(0, 0, 0, 0.3)"
          }}>
            {ticket.message?.text || "No message"}
          </div>

          {ticket.message?.mediaUrl && (
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 8, fontWeight: 600, letterSpacing: "0.5px" }}>IMAGE</div>
              <a
                href={ticket.message.mediaUrl}
                target="_blank"
                rel="noreferrer"
                style={{ display: "inline-block", borderRadius: 12, overflow: "hidden", border: "1px solid rgba(148, 163, 184, 0.3)" }}
              >
                <img
                  src={ticket.message.mediaUrl}
                  alt="Ticket attachment"
                  style={{ display: "block", maxWidth: "100%", height: "auto" }}
                />
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Status Update Section */}
      <div 
        className="card premium-status-card" 
        style={{ 
          marginBottom: 32,
          border: "1px solid rgba(34, 197, 94, 0.2)",
          transition: "all 0.3s ease"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.boxShadow = "0 12px 32px rgba(34, 197, 94, 0.2)";
          e.currentTarget.style.borderColor = "rgba(34, 197, 94, 0.4)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 16px 40px rgba(0, 0, 0, 0.25)";
          e.currentTarget.style.borderColor = "rgba(34, 197, 94, 0.2)";
        }}
      >
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "12px", 
          marginBottom: 20,
          paddingBottom: 16,
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)"
        }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
            boxShadow: "0 4px 8px rgba(16, 185, 129, 0.3)"
          }}>
            ⚡
          </div>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#86efac" }}>Update Status</h3>
        </div>
        <TicketStatusUpdater
          ticket={ticket}
          onUpdated={fetchTicket}
        />
      </div>

      {/* Resolution Details Section */}
      {ticket.resolutionDetails && ticket.resolutionDetails.photoUrl && (
        <div 
          className="card resolution-details-card"
          style={{
            border: "1px solid rgba(34, 197, 94, 0.3)",
            transition: "all 0.3s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-4px)";
            e.currentTarget.style.boxShadow = "0 12px 32px rgba(34, 197, 94, 0.3)";
            e.currentTarget.style.borderColor = "rgba(34, 197, 94, 0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 16px 40px rgba(0, 0, 0, 0.25)";
            e.currentTarget.style.borderColor = "rgba(34, 197, 94, 0.3)";
          }}
        >
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "12px",
            marginBottom: 20,
            paddingBottom: 16,
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)"
          }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              boxShadow: "0 4px 8px rgba(34, 197, 94, 0.4)"
            }}>
              ✅
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#86efac" }}>Resolution Details</h3>
              <p style={{ margin: "4px 0 0 0", fontSize: 12, color: "#94a3b8" }}>
                Resolved by {ticket.resolutionDetails.resolvedBy} on {formatDateTime(ticket.resolutionDetails.resolvedAt)}
              </p>
            </div>
          </div>

          {/* Resolution Photo */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ 
              fontSize: 13, 
              fontWeight: 600, 
              color: "#86efac", 
              marginBottom: 12,
              display: "flex",
              alignItems: "center",
              gap: 8
            }}>
              <span>📷</span>
              <span>Resolution Photo</span>
            </div>
            <img 
              src={ticket.resolutionDetails.photoUrl} 
              alt="Resolution" 
              style={{
                width: "100%",
                maxHeight: "500px",
                objectFit: "contain",
                borderRadius: "12px",
                border: "1px solid rgba(34, 197, 94, 0.2)",
                background: "rgba(0, 0, 0, 0.3)",
                cursor: "pointer"
              }}
              onClick={() => window.open(ticket.resolutionDetails.photoUrl, "_blank")}
            />
            <p style={{ 
              fontSize: 12, 
              color: "#64748b", 
              marginTop: 8,
              fontStyle: "italic"
            }}>
              Click image to view full size
            </p>
          </div>

          {/* Resolution Notes */}
          {ticket.resolutionDetails.notes && (
            <div>
              <div style={{ 
                fontSize: 13, 
                fontWeight: 600, 
                color: "#86efac", 
                marginBottom: 12,
                display: "flex",
                alignItems: "center",
                gap: 8
              }}>
                <span>📝</span>
                <span>Resolution Notes</span>
              </div>
              <div style={{
                padding: "16px",
                background: "rgba(34, 197, 94, 0.05)",
                border: "1px solid rgba(34, 197, 94, 0.15)",
                borderRadius: "10px",
                fontSize: 14,
                color: "#cbd5e1",
                lineHeight: 1.6,
                whiteSpace: "pre-wrap"
              }}>
                {ticket.resolutionDetails.notes}
              </div>
            </div>
          )}
        </div>
      )}

      {/* AI Analysis Section */}
      {ticket.aiAnalysis && (
        <AIAnalysisPanel analysis={ticket.aiAnalysis} />
      )}

      <ConfirmModal
        isOpen={deleteModal}
        title="Delete Ticket"
        message="Are you sure you want to delete this ticket? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        danger={true}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal(false)}
      />

      <PromptModal
        isOpen={reportModal}
        title="Report Ticket"
        message="Please provide a reason for reporting this ticket:"
        placeholder="e.g., Duplicate ticket, Spam, Inappropriate content..."
        confirmText="Submit Report"
        cancelText="Cancel"
        onConfirm={confirmReport}
        onCancel={() => setReportModal(false)}
      />
    </div>
  );
}