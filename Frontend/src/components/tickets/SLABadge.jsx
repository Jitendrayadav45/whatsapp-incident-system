import { formatAging } from "../../utils/formatAging";

function getBadgeClass(createdAt) {
  const diffMs = Date.now() - new Date(createdAt).getTime();
  const hours = diffMs / (1000 * 60 * 60);

  if (hours < 4) return "badge-success";
  if (hours < 24) return "badge-warning";
  return "badge-danger";
}

export default function SLABadge({ ticket }) {
  if (ticket.status === "RESOLVED") {
    return null; // Status badge already shows resolved; avoid duplicate pill
  }

  const aging = formatAging(ticket.createdAt);
  const badgeClass = getBadgeClass(ticket.createdAt);

  return (
    <span className={`badge ${badgeClass}`}>
      ⏱ {aging}
    </span>
  );
}