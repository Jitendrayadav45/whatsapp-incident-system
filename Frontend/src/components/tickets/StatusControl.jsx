import StatusBadge from "./StatusBadge";
import { isOwner, isSiteAdmin } from "../../utils/roleUtils";
import { useAuth } from "../../auth/useAuth";

export default function StatusControl({ status, onChange }) {
  const { user } = useAuth();

  const canUpdate =
    isOwner(user.role) || isSiteAdmin(user.role);

  if (!canUpdate) {
    return <StatusBadge status={status} />;
  }

  return (
    <select
      value={status}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="OPEN">OPEN</option>
      <option value="IN_PROGRESS">IN_PROGRESS</option>
      <option value="RESOLVED">RESOLVED</option>
    </select>
  );
}