import { useEffect, useState } from "react";
import { getTicketsApi } from "../api/tickets.api";

export default function useTickets(filters) {
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    getTicketsApi(filters)
      .then((res) => {
        setData(res.data);
        setMeta({
          total: res.total,
          page: res.page,
          totalPages: res.totalPages
        });
      })
      .finally(() => setLoading(false));
  }, [JSON.stringify(filters)]);

  return { data, meta, loading };
}