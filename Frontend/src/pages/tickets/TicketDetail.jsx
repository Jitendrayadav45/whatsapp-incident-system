// src/pages/tickets/TicketDetail.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Loader from "../../components/common/Loader";
import TicketStatusUpdater from "../../components/tickets/TicketStatusUpdater";
import AIAnalysisPanel from "../../components/tickets/AIAnalysisPanel";
import SLABadge from "../../components/tickets/SLABadge";
import StatusBadge from "../../components/tickets/StatusBadge";
import { formatDateTime } from "../../utils/formatDate";

export default function TicketDetail() {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      {/* Premium Header */}
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
        <StatusBadge status={ticket.status} />
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

      {/* AI Analysis Section */}
      {ticket.aiAnalysis && (
        <AIAnalysisPanel analysis={ticket.aiAnalysis} />
      )}
    </div>
  );
}