import api from "./axios";


export const getAdmins = async () => {
  const { data } = await api.get("/admins");
  return data;
};


export const createAdmin = async (payload) => {
  const { data } = await api.post("/admins", payload);
  return data;
};


export const updateAdminStatus = async (adminId, isActive) => {
  const { data } = await api.patch(
    `/admins/${adminId}/status`,
    { isActive }
  );
  return data;
};

export const deleteAdmin = async (adminId) => {
  const { data } = await api.delete(`/admins/${adminId}`);
  return data;
};

export const resetAdminPassword = async (adminId, newPassword) => {
  const { data } = await api.patch(
    `/admins/${adminId}/reset-password`,
    { newPassword }
  );
  return data;
};
