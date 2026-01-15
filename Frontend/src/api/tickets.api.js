import api from "./axios";

export const getTicketsApi = async (params) => {
  const res = await api.get("/tickets", { params });
  return res.data;
};

export const getTicketByIdApi = async (ticketId) => {
  const res = await api.get(`/tickets/${ticketId}`);
  return res.data;
};

export async function updateTicketStatus(ticketId, status, resolutionData = null) {
  const payload = { status };
  
  // Add resolution data if provided (for RESOLVED status)
  if (resolutionData) {
    payload.resolutionPhoto = resolutionData.photo;
    payload.resolutionNotes = resolutionData.notes;
  }
  
  const res = await api.patch(
    `/tickets/${ticketId}/status`,
    payload
  );
  return res.data;
}

export async function deleteTicket(ticketId) {
  const res = await api.delete(`/tickets/${ticketId}`);
  return res.data;
}

export async function reportTicket(ticketId, reason) {
  const res = await api.post(`/tickets/${ticketId}/report`, { reason });
  return res.data;
}