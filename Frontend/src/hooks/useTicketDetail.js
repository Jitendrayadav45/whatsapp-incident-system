import { useEffect, useState } from "react";
import {
  getTicketByIdApi,
  updateTicketStatusApi
} from "../api/tickets.api";

export default function useTicketDetail(ticketId) {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    getTicketByIdApi(ticketId)
      .then(setTicket)
      .finally(() => setLoading(false));
  }, [ticketId]);

  const updateStatus = async (status) => {
    await updateTicketStatusApi(ticketId, status);
    setTicket((prev) => ({ ...prev, status }));
  };

  return { ticket, loading, updateStatus };
}