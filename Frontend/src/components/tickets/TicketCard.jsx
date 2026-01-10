import StatusBadge from "./StatusBadge";
import { formatDateTime } from "../../utils/formatDate";

export default function TicketCard({ ticket, onClick, rightMeta }) {
  return (
    <div className="ticket-card" onClick={onClick}>
      <div className="row">
        <strong>{ticket.ticketId}</strong>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {rightMeta}
          <StatusBadge status={ticket.status} />
        </div>
      </div>

      <p>{ticket.message?.text || "No message"}</p>

      {ticket.message?.mediaUrl && (
        <div style={{ marginTop: 6, fontSize: 12, color: "#60a5fa" }}>
          📷 Image attached
        </div>
      )}

      <div style={{ display: "flex", gap: 14, marginTop: 8 }}>
        <small>
          📍 {ticket.siteId}
          {ticket.subSiteId && ` / ${ticket.subSiteId}`}
        </small>
        <small>📅 {formatDateTime(ticket.createdAt)}</small>
      </div>
    </div>
  );
}