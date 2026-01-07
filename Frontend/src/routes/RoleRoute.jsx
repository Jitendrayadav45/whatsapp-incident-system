import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

export default function RoleRoute({ allowedRoles, children }) {
  const { user } = useAuth();

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}