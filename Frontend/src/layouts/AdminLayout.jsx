import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import { Outlet } from "react-router-dom";

export default function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      <Sidebar />

      <div className="content">
        <Header />
        <main>
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}