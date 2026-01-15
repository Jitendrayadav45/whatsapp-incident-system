import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useTickets from "../../hooks/useTickets";
import TicketCard from "../../components/tickets/TicketCard";
import TicketFilters from "./TicketFilters";
import { useAuth } from "../../auth/useAuth";
import SLABadge from "../../components/tickets/SLABadge";
import { deleteTicket, reportTicket } from "../../api/tickets.api";
import { isOwner } from "../../utils/roleUtils";
import ConfirmModal from "../../components/common/ConfirmModal";
import PromptModal from "../../components/common/PromptModal";

export default function TicketList() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    search: ""
  });

  const { data, meta, loading, refetch } = useTickets(filters);
  const [actionBusy, setActionBusy] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, ticketId: null });
  const [reportModal, setReportModal] = useState({ isOpen: false, ticketId: null });

  const handleDelete = async (ticketId) => {
    setDeleteModal({ isOpen: true, ticketId });
  };

  const confirmDelete = async () => {
    const ticketId = deleteModal.ticketId;
    setDeleteModal({ isOpen: false, ticketId: null });
    try {
      setActionBusy(true);
      await deleteTicket(ticketId);
      refetch();
      window.showToast?.("Ticket deleted successfully", "success");
    } catch (err) {
      window.showToast?.(err?.response?.data?.error || "Failed to delete ticket", "error");
    } finally {
      setActionBusy(false);
    }
  };

  const handleReport = async (ticketId) => {
    setReportModal({ isOpen: true, ticketId });
  };

  const confirmReport = async (reason) => {
    const ticketId = reportModal.ticketId;
    setReportModal({ isOpen: false, ticketId: null });
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

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Tickets</h2>
        {(loading || actionBusy) && <span className="loading-indicator">Refreshing…</span>}
      </div>

      <TicketFilters
        filters={filters}
        setFilters={setFilters}
      />

      {data.length === 0 && (
        <div className="empty-state">
          <p>No tickets found for this search.</p>
        </div>
      )}

      {data.map((ticket) => (
        <TicketCard
          key={ticket.ticketId}
          ticket={ticket}
          rightMeta={<SLABadge ticket={ticket} />}
          actions={
            isOwner(user.role) ? (
              <button
                className="pill-btn danger"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(ticket.ticketId);
                }}
                disabled={actionBusy}
              >
                🗑️ Delete
              </button>
            ) : (
              <button
                className="pill-btn ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  handleReport(ticket.ticketId);
                }}
                disabled={actionBusy}
              >
                🚩 Report
              </button>
            )
          }
          onClick={() => navigate(`/tickets/${ticket.ticketId}`)}
        />
      ))}

      <div className="pagination">
        <button
          disabled={filters.page === 1}
          onClick={() =>
            setFilters({ ...filters, page: filters.page - 1 })
          }
        >
          Prev
        </button>

        <span>
          Page {meta.page} / {meta.totalPages}
        </span>

        <button
          disabled={filters.page === meta.totalPages}
          onClick={() =>
            setFilters({ ...filters, page: filters.page + 1 })
          }
        >
          Next
        </button>
      </div>

      <style>{`
        .page-header {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .loading-indicator {
          font-size: 0.9rem;
          color: #9ca3af;
        }

        .pill-btn {
          border: 1px solid rgba(255,255,255,0.2);
          background: linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.9) 100%);
          color: #fff;
          padding: 8px 20px;
          border-radius: 999px;
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 600;
          letter-spacing: 0.025em;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        .pill-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
        }

        .pill-btn.danger {
          border-color: rgba(248, 113, 113, 0.5);
          background: linear-gradient(135deg, rgba(220, 38, 38, 0.2) 0%, rgba(153, 27, 27, 0.2) 100%);
          color: #fca5a5;
        }

        .pill-btn.danger:hover:not(:disabled) {
          border-color: rgba(248, 113, 113, 0.8);
          background: linear-gradient(135deg, rgba(220, 38, 38, 0.3) 0%, rgba(153, 27, 27, 0.3) 100%);
          color: #fecdd3;
          box-shadow: 0 4px 16px rgba(248, 113, 113, 0.3);
        }

        .pill-btn.ghost {
          border-color: rgba(148, 163, 184, 0.3);
          background: linear-gradient(135deg, rgba(51, 65, 85, 0.3) 0%, rgba(30, 41, 59, 0.3) 100%);
          color: #cbd5e1;
        }

        .pill-btn.ghost:hover:not(:disabled) {
          border-color: rgba(148, 163, 184, 0.5);
          background: linear-gradient(135deg, rgba(51, 65, 85, 0.5) 0%, rgba(30, 41, 59, 0.5) 100%);
          color: #e2e8f0;
          box-shadow: 0 4px 16px rgba(148, 163, 184, 0.2);
        }

        .pill-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }
      `}</style>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Delete Ticket"
        message="Are you sure you want to delete this ticket? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        danger={true}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, ticketId: null })}
      />

      <PromptModal
        isOpen={reportModal.isOpen}
        title="Report Ticket"
        message="Please provide a reason for reporting this ticket:"
        placeholder="e.g., Duplicate ticket, Spam, Inappropriate content..."
        confirmText="Submit Report"
        cancelText="Cancel"
        onConfirm={confirmReport}
        onCancel={() => setReportModal({ isOpen: false, ticketId: null })}
      />
    </div>
  );
}