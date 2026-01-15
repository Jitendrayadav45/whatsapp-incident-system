import { useEffect, useState } from "react";
import { getTicketReports } from "../api/ticketReports.api";

export default function useTicketReports(filters) {
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0, limit: filters?.limit || 20 });
  const [loading, setLoading] = useState(true);
  const [refreshToken, setRefreshToken] = useState(0);

  // Debounce client-side filter changes
  const [debouncedFilters, setDebouncedFilters] = useState(filters);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedFilters(filters), 300);
    return () => clearTimeout(timer);
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    setLoading(true);

    getTicketReports(debouncedFilters)
      .then((res) => {
        setData(res.data);
        setMeta({
          total: res.total,
          page: res.page,
          totalPages: res.totalPages
        });
      })
      .finally(() => setLoading(false));
  }, [JSON.stringify(debouncedFilters), refreshToken]);

  const refetch = () => setRefreshToken((x) => x + 1);

  return { data, meta, loading, refetch };
}
