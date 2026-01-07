import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";
import { ROLES } from "../utils/constants";

/* Layout */
import AdminLayout from "../layouts/AdminLayout";

/* Pages */
import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import TicketList from "../pages/tickets/TicketList";
import TicketDetail from "../pages/tickets/TicketDetail";
import SiteList from "../pages/sites/SiteList";
import CreateSite from "../pages/sites/CreateSite";
import CreateSubSite from "../pages/sites/CreateSubSite";
import AdminList from "../pages/admins/AdminList";
import CreateAdmin from "../pages/admins/CreateAdmin";
import NotFound from "../pages/notFound/NotFound";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />

      {/* Protected */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />

        <Route path="dashboard" element={<Dashboard />} />
        <Route path="tickets" element={<TicketList />} />
        <Route path="tickets/:ticketId" element={<TicketDetail />} />

        {/* OWNER + SITE_ADMIN */}
        <Route
          path="sites"
          element={
            <RoleRoute allowedRoles={[ROLES.OWNER, ROLES.SITE_ADMIN]}>
              <SiteList />
            </RoleRoute>
          }
        />

        <Route
          path="sites/create"
          element={
            <RoleRoute allowedRoles={[ROLES.OWNER]}>
              <CreateSite />
            </RoleRoute>
          }
        />

        {/* OWNER + SITE_ADMIN */}
        <Route
          path="sites/:siteId/subsites/create"
          element={
            <RoleRoute allowedRoles={[ROLES.OWNER, ROLES.SITE_ADMIN]}>
              <CreateSubSite />
            </RoleRoute>
          }
        />

        {/* Admins */}
        <Route
          path="admins"
          element={
            <RoleRoute allowedRoles={[ROLES.OWNER, ROLES.SITE_ADMIN]}>
              <AdminList />
            </RoleRoute>
          }
        />

        <Route
          path="admins/create"
          element={
            <RoleRoute allowedRoles={[ROLES.OWNER, ROLES.SITE_ADMIN]}>
              <CreateAdmin />
            </RoleRoute>
          }
        />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}