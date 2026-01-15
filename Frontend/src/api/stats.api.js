import api from "./axios";

export const fetchStats = async () => {
  const res = await api.get("/stats");

  const payload = res.data || {};
  const byStatus = payload.byStatus || {};

  return {
    totalTickets: payload.totalTickets ?? 0,
    open: byStatus.OPEN ?? 0,
    inProgress: byStatus.IN_PROGRESS ?? 0,
    resolved: byStatus.RESOLVED ?? 0,
    closed: byStatus.CLOSED ?? 0,
    lastUpdated: new Date().toISOString()
  };
};