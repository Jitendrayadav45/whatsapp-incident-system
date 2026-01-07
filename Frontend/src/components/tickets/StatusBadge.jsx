export default function StatusBadge({ status }) {
  const classMap = {
    OPEN: "status-badge status-open",
    IN_PROGRESS: "status-badge status-in-progress",
    RESOLVED: "status-badge status-resolved"
  };

  const displayMap = {
    OPEN: "Open",
    IN_PROGRESS: "In Progress",
    RESOLVED: "Resolved"
  };

  return (
    <span className={classMap[status] || "status-badge"}>
      {displayMap[status] || status}
    </span>
  );
}