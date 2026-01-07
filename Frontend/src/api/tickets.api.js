import api from "./axios";

export const getTicketsApi = async (params) => {
  const res = await api.get("/tickets", { params });
  return res.data;
};

export const getTicketByIdApi = async (ticketId) => {
  const res = await api.get(`/tickets/${ticketId}`);
  return res.data;
};

export async function updateTicketStatus(ticketId, status) {
  const res = await api.patch(
    `/tickets/${ticketId}/status`,
    { status }
  );
  return res.data;
}