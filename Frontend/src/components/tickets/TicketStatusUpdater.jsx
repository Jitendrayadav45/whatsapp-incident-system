import { useState } from "react";
import { STATUS_FLOW } from "../../utils/statusFlow";
import { updateTicketStatus } from "../../api/tickets.api";
import Button from "../common/Button";
import { useAuth } from "../../auth/useAuth";
import { isOwner, isSiteAdmin } from "../../utils/roleUtils";
import ResolutionModal from "./ResolutionModal";

export default function TicketStatusUpdater({ ticket, onUpdated }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showResolutionModal, setShowResolutionModal] = useState(false);
  const { user } = useAuth();

  let nextStatuses = STATUS_FLOW[ticket.status] || [];
  
  // Filter out CLOSED status if user is not OWNER or SITE_ADMIN
  if (nextStatuses.includes("CLOSED")) {
    const canClose = user && (isOwner(user.role) || isSiteAdmin(user.role));
    if (!canClose) {
      nextStatuses = nextStatuses.filter(status => status !== "CLOSED");
    }
  }

  if (nextStatuses.length === 0) {
    return (
      <div style={{ 
        padding: 12, 
        background: "rgba(34, 197, 94, 0.1)", 
        border: "1px solid rgba(34, 197, 94, 0.3)", 
        borderRadius: 8,
        color: "#86efac"
      }}>
        ✓ Ticket is in final state: <strong>{ticket.status}</strong>
      </div>
    );
  }

  async function handleUpdate(nextStatus, resolutionData = null) {
    try {
      setLoading(true);
      setError("");
      await updateTicketStatus(ticket.ticketId, nextStatus, resolutionData);
      setShowResolutionModal(false);
      onUpdated?.(); // refetch ticket
    } catch (err) {
      console.error("Status update error:", err);
      setError(err.response?.data?.error || "Failed to update status");
    } finally {
      setLoading(false);
    }
  }

  const handleStatusClick = (status) => {
    // Show modal for RESOLVED status
    if (status === "RESOLVED") {
      setShowResolutionModal(true);
    } else {
      handleUpdate(status);
    }
  };

  const handleResolutionSubmit = (resolutionData) => {
    handleUpdate("RESOLVED", resolutionData);
  };

  return (
    <div>
      {error && (
        <div 
          className="alert alert-error" 
          style={{ 
            marginBottom: 16,
            animation: "slideInRight 0.3s ease"
          }}
        >
          {error}
        </div>
      )}

      <div style={{ 
        fontSize: 13, 
        color: "#94a3b8", 
        marginBottom: 16,
        padding: "12px",
        background: "rgba(59, 130, 246, 0.1)",
        borderRadius: "8px",
        border: "1px solid rgba(59, 130, 246, 0.2)"
      }}>
        <span style={{ fontWeight: 500 }}>CURRENT STATUS:</span>{" "}
        <strong style={{ 
          color: "#60a5fa", 
          fontSize: 14,
          letterSpacing: "0.5px"
        }}>
          {ticket.status}
        </strong>
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {nextStatuses.map(status => (
          <button
            key={status}
            onClick={() => handleStatusClick(status)}
            disabled={loading}
            style={{
              padding: "14px 28px",
              fontSize: 15,
              fontWeight: 700,
              background: loading 
                ? "rgba(100, 116, 139, 0.3)" 
                : "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
              color: "#fff",
              border: "none",
              borderRadius: "12px",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: loading 
                ? "none" 
                : "0 4px 12px rgba(59, 130, 246, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)",
              opacity: loading ? 0.6 : 1,
              letterSpacing: "0.3px",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = "translateY(-3px) scale(1.02)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(59, 130, 246, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.15), 0 0 40px rgba(59, 130, 246, 0.3)";
                e.currentTarget.style.background = "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)";
                e.currentTarget.style.background = "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)";
              }
            }}
          >
            {loading ? (
              <>
                <span style={{
                  width: 16,
                  height: 16,
                  border: "2px solid rgba(255, 255, 255, 0.3)",
                  borderTop: "2px solid #fff",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite"
                }} />
                <span>Updating...</span>
              </>
            ) : (
              <>
                <span style={{ fontSize: "18px" }}>
                  {status === "IN_PROGRESS" ? "⚙️" : status === "RESOLVED" ? "✅" : status === "CLOSED" ? "🔒" : "📋"}
                </span>
                <span>Mark as {status.replace("_", " ")}</span>
              </>
            )}
          </button>
        ))}
      </div>

      {/* Resolution Modal */}
      <ResolutionModal
        isOpen={showResolutionModal}
        onClose={() => setShowResolutionModal(false)}
        onSubmit={handleResolutionSubmit}
        loading={loading}
      />

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}