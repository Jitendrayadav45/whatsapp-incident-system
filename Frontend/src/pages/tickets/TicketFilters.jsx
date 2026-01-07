import { useAuth } from "../../auth/useAuth";
import { isOwner, isSiteAdmin } from "../../utils/roleUtils";
import useSites from "../../hooks/useSites";

export default function TicketFilters({ filters, setFilters }) {
  const { user } = useAuth();
  const { sites, loading } = useSites();

  return (
    <div className="ticket-filters-container">
      {/* Premium Filter Card */}
      <div className="premium-filter-card">
        {/* Filter Header */}
        <div className="filter-header">
          <div className="filter-icon-wrapper">
            <span className="filter-icon">🔍</span>
          </div>
          <div className="filter-title-section">
            <h3 className="filter-title">Filter Tickets</h3>
            <p className="filter-subtitle">Refine your ticket search</p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="filter-controls-grid">
          {/* SITE FILTER */}
          {(isOwner(user.role) || isSiteAdmin(user.role)) && (
            <div className="filter-field">
              <label className="filter-label">
                <span className="label-icon">🏭</span>
                Site Location
              </label>
              <div className="select-wrapper">
                <select
                  className="premium-select"
                  value={filters.siteId || ""}
                  onChange={(e) =>
                    setFilters({ ...filters, siteId: e.target.value, page: 1 })
                  }
                  disabled={loading}
                >
                  <option value="">🌐 All Sites</option>
                  {sites.map((site) => (
                    <option key={site.siteId} value={site.siteId}>
                      {site.siteName}
                    </option>
                  ))}
                </select>
                <span className="select-arrow">▼</span>
              </div>
              <p className="filter-help-text">
                {filters.siteId 
                  ? `Showing tickets for ${sites.find(s => s.siteId === filters.siteId)?.siteName || 'selected site'}`
                  : `Showing tickets from all ${sites.length} sites`
                }
              </p>
            </div>
          )}

          {/* STATUS FILTER */}
          <div className="filter-field">
            <label className="filter-label">
              <span className="label-icon">📊</span>
              Ticket Status
            </label>
            <div className="select-wrapper">
              <select
                className="premium-select"
                value={filters.status || ""}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value, page: 1 })
                }
              >
                <option value="">📋 All Status</option>
                <option value="OPEN">🟢 Open</option>
                <option value="IN_PROGRESS">🟡 In Progress</option>
                <option value="RESOLVED">✅ Resolved</option>
              </select>
              <span className="select-arrow">▼</span>
            </div>
            <p className="filter-help-text">
              {filters.status 
                ? `Showing ${filters.status.toLowerCase().replace('_', ' ')} tickets`
                : 'Showing tickets of all statuses'
              }
            </p>
          </div>
        </div>

        {/* Active Filters Summary */}
        {(filters.siteId || filters.status) && (
          <div className="active-filters-bar">
            <div className="active-filters-header">
              <span className="active-filters-icon">✨</span>
              <span className="active-filters-text">Active Filters:</span>
            </div>
            <div className="active-filters-tags">
              {filters.siteId && (
                <span className="filter-tag site-tag">
                  <span className="tag-icon">🏭</span>
                  {sites.find(s => s.siteId === filters.siteId)?.siteName || filters.siteId}
                  <button
                    className="tag-remove"
                    onClick={() => setFilters({ ...filters, siteId: '', page: 1 })}
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.status && (
                <span className="filter-tag status-tag">
                  <span className="tag-icon">📊</span>
                  {filters.status.replace('_', ' ')}
                  <button
                    className="tag-remove"
                    onClick={() => setFilters({ ...filters, status: '', page: 1 })}
                  >
                    ×
                  </button>
                </span>
              )}
              <button
                className="clear-all-filters"
                onClick={() => setFilters({ page: 1, limit: filters.limit })}
              >
                Clear All
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        /* Premium Filter Container */
        .ticket-filters-container {
          margin-bottom: 2rem;
        }

        .premium-filter-card {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 
            0 10px 40px rgba(0, 0, 0, 0.3),
            0 0 0 1px rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.2);
          transition: all 0.3s ease;
        }

        .premium-filter-card:hover {
          box-shadow: 
            0 15px 50px rgba(0, 0, 0, 0.4),
            0 0 0 1px rgba(59, 130, 246, 0.3),
            0 0 30px rgba(59, 130, 246, 0.1);
        }

        /* Filter Header */
        .filter-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .filter-icon-wrapper {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 
            0 4px 12px rgba(59, 130, 246, 0.4),
            inset 0 -2px 8px rgba(0, 0, 0, 0.2);
        }

        .filter-icon {
          font-size: 28px;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
        }

        .filter-title-section {
          flex: 1;
        }

        .filter-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #fff;
          margin: 0 0 0.25rem 0;
          letter-spacing: -0.02em;
        }

        .filter-subtitle {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.6);
          margin: 0;
        }

        /* Filter Controls Grid */
        .filter-controls-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .filter-field {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .filter-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 0.25rem;
        }

        .label-icon {
          font-size: 1rem;
        }

        /* Premium Select Dropdown */
        .select-wrapper {
          position: relative;
        }

        .premium-select {
          width: 100%;
          padding: 0.875rem 2.5rem 0.875rem 1rem;
          background: rgba(15, 23, 42, 0.6);
          border: 2px solid rgba(59, 130, 246, 0.3);
          border-radius: 12px;
          color: #fff;
          font-size: 0.9375rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          appearance: none;
          outline: none;
        }

        .premium-select:hover {
          background: rgba(15, 23, 42, 0.8);
          border-color: rgba(59, 130, 246, 0.5);
        }

        .premium-select:focus {
          background: rgba(15, 23, 42, 0.9);
          border-color: #3b82f6;
          box-shadow: 
            0 0 0 3px rgba(59, 130, 246, 0.1),
            0 0 20px rgba(59, 130, 246, 0.3);
        }

        .premium-select:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .premium-select option {
          background: #1e293b;
          color: #fff;
          padding: 0.5rem;
        }

        .select-arrow {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(59, 130, 246, 0.7);
          pointer-events: none;
          font-size: 0.75rem;
          transition: all 0.3s ease;
        }

        .select-wrapper:hover .select-arrow {
          color: #3b82f6;
        }

        .premium-select:focus + .select-arrow {
          transform: translateY(-50%) scale(1.2);
          color: #3b82f6;
        }

        .filter-help-text {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.5);
          margin: 0;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        /* Active Filters Bar */
        .active-filters-bar {
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 12px;
          padding: 1rem;
          animation: slideDown 0.3s ease;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .active-filters-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }

        .active-filters-icon {
          font-size: 1rem;
        }

        .active-filters-text {
          font-size: 0.875rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.9);
        }

        .active-filters-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          align-items: center;
        }

        .filter-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.375rem 0.75rem;
          background: rgba(59, 130, 246, 0.15);
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 8px;
          font-size: 0.8125rem;
          font-weight: 500;
          color: #93c5fd;
          transition: all 0.2s ease;
        }

        .filter-tag:hover {
          background: rgba(59, 130, 246, 0.2);
          border-color: rgba(59, 130, 246, 0.4);
        }

        .tag-icon {
          font-size: 0.875rem;
        }

        .tag-remove {
          background: rgba(239, 68, 68, 0.2);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #fca5a5;
          border-radius: 4px;
          width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 1rem;
          line-height: 1;
          padding: 0;
          transition: all 0.2s ease;
        }

        .tag-remove:hover {
          background: rgba(239, 68, 68, 0.3);
          border-color: rgba(239, 68, 68, 0.5);
          transform: scale(1.1);
        }

        .clear-all-filters {
          padding: 0.375rem 0.875rem;
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 8px;
          color: #fca5a5;
          font-size: 0.8125rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .clear-all-filters:hover {
          background: rgba(239, 68, 68, 0.25);
          border-color: rgba(239, 68, 68, 0.5);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .premium-filter-card {
            padding: 1.5rem;
          }

          .filter-controls-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .filter-header {
            margin-bottom: 1.5rem;
          }

          .filter-icon-wrapper {
            width: 48px;
            height: 48px;
          }

          .filter-icon {
            font-size: 24px;
          }

          .filter-title {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
}