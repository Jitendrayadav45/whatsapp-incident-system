import { useEffect, useState } from "react";
import { getSites } from "../../api/sites.api";
import SiteCard from "../../components/sites/SiteCard";
import { useAuth } from "../../auth/useAuth";
import { ROLES } from "../../utils/constants";
import { Link } from "react-router-dom";

export default function SiteList() {
  const { user } = useAuth();
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadSites() {
    try {
      setLoading(true);
      const data = await getSites();
      setSites(data || []);
    } catch (err) {
      console.error("Failed to load sites", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSites();
  }, []);

  if (loading) return <p>Loading sites...</p>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Sites</h2>

        {user.role === ROLES.OWNER && (
          <Link 
            to="/sites/create" 
            className="premium-create-btn"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "14px 28px",
              background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
              color: "#fff",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: 700,
              textDecoration: "none",
              border: "none",
              boxShadow: "0 8px 24px rgba(37, 99, 235, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.1)",
              transition: "all 0.3s ease",
              cursor: "pointer",
              letterSpacing: "0.3px"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px) scale(1.02)";
              e.currentTarget.style.boxShadow = "0 12px 32px rgba(37, 99, 235, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.15), 0 0 40px rgba(59, 130, 246, 0.3)";
              e.currentTarget.style.background = "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(37, 99, 235, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.1)";
              e.currentTarget.style.background = "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)";
            }}
          >
            <span style={{ fontSize: "20px", fontWeight: "bold" }}>+</span>
            <span>Create Site</span>
            <span style={{ fontSize: "18px" }}>🏭</span>
          </Link>
        )}
      </div>

      {sites.length === 0 ? (
        <p>No sites found.</p>
      ) : (
        sites.map(site => (
          <SiteCard
            key={site.siteId}
            site={site}
            onRefresh={loadSites}
          />
        ))
      )}
    </div>
  );
}