// src/pages/tickets/TicketList.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useTickets from "../../hooks/useTickets";
import TicketCard from "../../components/tickets/TicketCard";
import TicketFilters from "./TicketFilters";
import { useAuth } from "../../auth/useAuth";
import SLABadge from "../../components/tickets/SLABadge";

export default function TicketList() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    page: 1,
    limit: 20
  });

  const { data, meta, loading } = useTickets(filters);

  if (loading) return <p>Loading tickets...</p>;

  return (
    <div className="page-container">
      <h2>Tickets</h2>

      <TicketFilters
        filters={filters}
        setFilters={setFilters}
      />

      {data.map((ticket) => (
        <TicketCard
          key={ticket.ticketId}
          ticket={ticket}
          rightMeta={<SLABadge ticket={ticket} />}
          onClick={() => navigate(`/tickets/${ticket.ticketId}`)}
        />
      ))}

      <div className="pagination">
        <button
          disabled={filters.page === 1}
          onClick={() =>
            setFilters({ ...filters, page: filters.page - 1 })
          }
        >
          Prev
        </button>

        <span>
          Page {meta.page} / {meta.totalPages}
        </span>

        <button
          disabled={filters.page === meta.totalPages}
          onClick={() =>
            setFilters({ ...filters, page: filters.page + 1 })
          }
        >
          Next
        </button>
      </div>
    </div>
  );
}