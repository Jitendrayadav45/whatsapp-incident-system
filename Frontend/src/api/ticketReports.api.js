import api from "./axios";

export const getTicketReports = async (params) => {
  const res = await api.get("/ticket-reports", { params });
  return res.data;
};

export const updateReportStatus = async (reportId, status, note) => {
  const res = await api.patch(`/ticket-reports/${reportId}/status`, { status, note });
  return res.data;
};

export const deleteReport = async (reportId) => {
  const res = await api.delete(`/ticket-reports/${reportId}`);
  return res.data;
};

export const deleteTicketFromReport = async (reportId) => {
  const res = await api.delete(`/ticket-reports/${reportId}/ticket`);
  return res.data;
};
