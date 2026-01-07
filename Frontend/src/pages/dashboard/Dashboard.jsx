import useStats from "../../hooks/useStats";
import Loader from "../../components/common/Loader";
import StatsCard from "./StatsCard";
import TicketStatusBar from "../../components/charts/TicketStatusBar";
import TicketStatusPie from "../../components/charts/TicketStatusPie";
import { formatDateTime } from "../../utils/formatDate";

export default function Dashboard() {
  const { data, loading, error } = useStats();

  if (loading) return (
    <div className="page-container">
      <Loader />
    </div>
  );

  if (error) return (
    <div className="page-container">
      <div className="alert alert-error">{error}</div>
    </div>
  );

  if (!data) return (
    <div className="page-container">
      <div className="alert alert-error">Failed to load dashboard data</div>
    </div>
  );

  const totalActive = data.open + data.inProgress;
  const resolutionRate = data.totalTickets > 0 
    ? Math.round((data.resolved / data.totalTickets) * 100) 
    : 0;

  return (
    <div className="page-container">
      {/* Premium Header */}
      <div style={{ 
        marginBottom: 40,
        padding: "32px",
        background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
        borderRadius: "20px",
        border: "1px solid rgba(59, 130, 246, 0.2)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "16px" }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "32px",
            boxShadow: "0 8px 24px rgba(59, 130, 246, 0.5)",
            animation: "pulse 2s ease-in-out infinite"
          }}>
            📊
          </div>
          <div>
            <h1 style={{ margin: 0, marginBottom: 8, fontSize: "32px", fontWeight: 700, color: "#fff" }}>Dashboard</h1>
            <p style={{ margin: 0, fontSize: "15px", color: "rgba(255, 255, 255, 0.7)" }}>
              Monitor ticket performance and system metrics
            </p>
          </div>
        </div>
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: 12, 
          fontSize: 13, 
          color: "rgba(255, 255, 255, 0.6)",
          padding: "12px",
          background: "rgba(59, 130, 246, 0.1)",
          borderRadius: "8px",
          border: "1px solid rgba(59, 130, 246, 0.2)"
        }}>
          <span>🕐 Last Updated: {formatDateTime(data.lastUpdated)}</span>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>

      {/* KPI CARDS */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", 
        gap: 20, 
        marginBottom: 32 
      }}>
        <StatsCard 
          title="Total Tickets" 
          value={data.totalTickets} 
          icon="🎫"
          gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        />
        <StatsCard 
          title="Open" 
          value={data.open} 
          icon="🔴"
          gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
          subtitle={`${Math.round((data.open / data.totalTickets) * 100)}% of total`}
        />
        <StatsCard 
          title="In Progress" 
          value={data.inProgress} 
          icon="⚙️"
          gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
          subtitle={`${Math.round((data.inProgress / data.totalTickets) * 100)}% of total`}
        />
        <StatsCard 
          title="Resolved" 
          value={data.resolved} 
          icon="✅"
          gradient="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
          subtitle={`${resolutionRate}% resolution rate`}
        />
      </div>

      {/* Additional Metrics */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", 
        gap: 20, 
        marginBottom: 40 
      }}>
        <div 
          className="card metric-card" 
          style={{ 
            padding: 24,
            border: "1px solid rgba(59, 130, 246, 0.2)",
            transition: "all 0.3s ease",
            cursor: "pointer"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-8px) scale(1.02)";
            e.currentTarget.style.boxShadow = "0 12px 32px rgba(59, 130, 246, 0.3)";
            e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0) scale(1)";
            e.currentTarget.style.boxShadow = "0 16px 40px rgba(0, 0, 0, 0.25)";
            e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.2)";
          }}
        >
          <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 12, fontWeight: 600, letterSpacing: "0.5px" }}>ACTIVE TICKETS</div>
          <div style={{ fontSize: 36, fontWeight: 700, color: "#60a5fa", display: "flex", alignItems: "center", gap: "12px" }}>
            <span>⚡</span>
            <span>{totalActive}</span>
          </div>
        </div>
        <div 
          className="card metric-card" 
          style={{ 
            padding: 24,
            border: "1px solid rgba(34, 197, 94, 0.2)",
            transition: "all 0.3s ease",
            cursor: "pointer"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-8px) scale(1.02)";
            e.currentTarget.style.boxShadow = "0 12px 32px rgba(34, 197, 94, 0.3)";
            e.currentTarget.style.borderColor = "rgba(34, 197, 94, 0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0) scale(1)";
            e.currentTarget.style.boxShadow = "0 16px 40px rgba(0, 0, 0, 0.25)";
            e.currentTarget.style.borderColor = "rgba(34, 197, 94, 0.2)";
          }}
        >
          <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 12, fontWeight: 600, letterSpacing: "0.5px" }}>RESOLUTION RATE</div>
          <div style={{ fontSize: 36, fontWeight: 700, color: "#34d399", display: "flex", alignItems: "center", gap: "12px" }}>
            <span>📈</span>
            <span>{resolutionRate}%</span>
          </div>
        </div>
        <div 
          className="card metric-card" 
          style={{ 
            padding: 24,
            border: "1px solid rgba(251, 191, 36, 0.2)",
            transition: "all 0.3s ease",
            cursor: "pointer"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-8px) scale(1.02)";
            e.currentTarget.style.boxShadow = "0 12px 32px rgba(251, 191, 36, 0.3)";
            e.currentTarget.style.borderColor = "rgba(251, 191, 36, 0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0) scale(1)";
            e.currentTarget.style.boxShadow = "0 16px 40px rgba(0, 0, 0, 0.25)";
            e.currentTarget.style.borderColor = "rgba(251, 191, 36, 0.2)";
          }}
        >
          <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 12, fontWeight: 600, letterSpacing: "0.5px" }}>PENDING</div>
          <div style={{ fontSize: 36, fontWeight: 700, color: "#f59e0b", display: "flex", alignItems: "center", gap: "12px" }}>
            <span>⏳</span>
            <span>{data.open}</span>
          </div>
        </div>
      </div>

      {/* CHARTS */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "1.5fr 1fr", 
        gap: 24,
        marginBottom: 32
      }}>
        <div 
          className="card chart-card" 
          style={{ 
            padding: 32,
            border: "1px solid rgba(59, 130, 246, 0.2)",
            transition: "all 0.3s ease"
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
            marginBottom: 24,
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
              📊
            </div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#93c5fd" }}>Tickets by Status</h3>
          </div>
          <TicketStatusBar stats={data} />
        </div>
        <div 
          className="card chart-card" 
          style={{ 
            padding: 32,
            border: "1px solid rgba(139, 92, 246, 0.2)",
            transition: "all 0.3s ease"
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
            marginBottom: 24,
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
              📈
            </div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#c4b5fd" }}>Ticket Distribution</h3>
          </div>
          <TicketStatusPie stats={data} />
        </div>
      </div>
    </div>
  );
}